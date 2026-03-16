import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type Trainer } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

export interface Specialty {
  id: string;
  label: string;
  value: string;
}

interface TrainersState {
  trainers: Trainer[];
  specialties: Specialty[];
  loading: boolean;
  error: string | null;
}

const initialState: TrainersState = {
  trainers: [],
  specialties: [],
  loading: false,
  error: null,
};

export const fetchSpecialties = createAsyncThunk(
  "trainers/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("specialties")
      .select("*")
      .order("label");

    if (error) return rejectWithValue(error.message);
    return data as Specialty[];
  }
);

export const fetchTrainer = createAsyncThunk(
  "trainers/fetchTrainer",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .select(`
        *,
        specialty:specialties(label)
      `)
      .eq("id", id)
      .single();

    if (error) return rejectWithValue(error.message);
    
    return {
      ...data,
      specialty: data.specialty?.label || "Unassigned"
    } as Trainer;
  }
);

export const fetchTrainers = createAsyncThunk(
  "trainers/fetchTrainers",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .select(`
        *,
        specialty:specialties(label)
      `)
      .eq("is_active", true)
      .order("full_name");

    if (error) return rejectWithValue(error.message);
    
    const flattenedData = data.map((trainer: any) => ({
      ...trainer,
      specialty: trainer.specialty?.label || "Unassigned"
    }));

    return flattenedData as Trainer[];
  }
);

export const fetchAdminTrainers = createAsyncThunk(
  "trainers/fetchAdminTrainers",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .select(`
        *,
        specialty:specialties(label)
      `)
      .order("is_active", { ascending: false })
      .order("full_name");

    if (error) return rejectWithValue(error.message);
    
    const flattenedData = data.map((trainer: any) => ({
      ...trainer,
      specialty: trainer.specialty?.label || "Unassigned"
    }));

    return flattenedData as Trainer[];
  }
);

export const createTrainer = createAsyncThunk(
  "trainers/createTrainer",
  async (trainer: Partial<Trainer> & { id: string }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .insert([{ ...trainer, is_active: true }])
      .select(`
        *,
        specialty:specialties(label)
      `)
      .single();

    if (error) return rejectWithValue(error.message);
    
    return {
      ...data,
      specialty: data.specialty?.label || "Unassigned"
    } as Trainer;
  }
);

export const updateTrainer = createAsyncThunk(
  "trainers/updateTrainer",
  async (trainer: Partial<Trainer> & { id: string }, { rejectWithValue }) => {
    const { specialty: _specialty, ...updateData } = trainer;

    const { data, error } = await supabase
      .from("trainers")
      .update(updateData)
      .eq("id", trainer.id)
      .select(`
        *,
        specialty:specialties(label)
      `)
      .single();

    if (error) return rejectWithValue(error.message);
    
    return {
      ...data,
      specialty: data.specialty?.label || "Unassigned"
    } as Trainer;
  }
);

export const softDeleteTrainer = createAsyncThunk(
  "trainers/softDeleteTrainer",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("trainers")
      .update({ is_active: false })
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return id;
  }
);

export const restoreTrainer = createAsyncThunk(
  "trainers/restoreTrainer",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .update({ is_active: true })
      .eq("id", id)
      .select(`
        *,
        specialty:specialties(label)
      `)
      .single();

    if (error) return rejectWithValue(error.message);
    
    return {
      ...data,
      specialty: data.specialty?.label || "Unassigned"
    } as Trainer;
  }
);

const trainersSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialties = action.payload;
      })
      .addCase(fetchTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trainers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trainers[index] = action.payload;
        } else {
          state.trainers.push(action.payload);
        }
      })
      .addCase(fetchTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchAdminTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.trainers.push(action.payload);
      })
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trainers[index] = action.payload;
        }
      })
      .addCase(softDeleteTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.trainers[index].is_active = false;
        }
      })
      .addCase(restoreTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trainers[index] = action.payload;
        }
      });
  },
});

export default trainersSlice.reducer;