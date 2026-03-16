import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type Trainer } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

interface TrainersState {
  trainers: Trainer[];
  trainer: Trainer | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrainersState = {
  trainers: [],
  trainer: null,
  loading: false,
  error: null,
};

export const fetchTrainers = createAsyncThunk(
  "trainers/fetchTrainers",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("is_active", true)
      .order("full_name");

    if (error) return rejectWithValue(error.message);

    return data as Trainer[];
  },
);

export const fetchTrainer = createAsyncThunk(
  "trainers/fetchTrainer",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .select()
      .single();

    if (!data) return rejectWithValue("Trainer not found");

    if (error) return rejectWithValue(error.message);

    return data as Trainer;
  },
);

export const fetchAdminTrainers = createAsyncThunk(
  "trainers/fetchAdminTrainers",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("rating", { ascending: false });

    if (error) return rejectWithValue(error.message);

    return data as Trainer[];
  },
);

export const handleTest = createAsyncThunk(
  "trainers/handleTest",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.functions.invoke("hello", {
      body: {
        name: "FitPath 12121",
      },
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  },
);

export const createTrainer = createAsyncThunk(
  "trainers/createTrainer",
  async (trainer: Partial<Trainer> & { id: string }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .insert([{ ...trainer, is_active: true }])
      .select()
      .single();

    if (error) return rejectWithValue(error.message);

    return data as Trainer;
  },
);

export const updateTrainer = createAsyncThunk(
  "trainers/updateTrainer",
  async (trainer: Partial<Trainer> & { id: string }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("trainers")
      .update(trainer)
      .eq("id", trainer.id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data as Trainer;
  },
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
  },
);

export const restoreTrainer = createAsyncThunk(
  "trainers/restoreTrainer",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("trainers")
      .update({ is_active: true })
      .eq("id", id);

    if (error) return rejectWithValue(error.message);

    return id;
  },
);

const trainersSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Trainer
      .addCase(fetchTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.trainer = action.payload;
      })
      .addCase(fetchTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Trainers
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
      // Fetch Admin Trainers
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
      // Create Trainer
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.trainers.push(action.payload);
      })
      // Update Trainer
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex(
          (t) => t.id === action.payload.id,
        );
        if (index !== -1) {
          state.trainers[index] = action.payload;
        }
      })
      // Soft Delete Trainer
      .addCase(softDeleteTrainer.fulfilled, (state, action) => {
        const trainer = state.trainers.find((t) => t.id === action.payload);
        if (trainer) {
          trainer.is_active = false;
        }
      })
      // Restore Trainer
      .addCase(restoreTrainer.fulfilled, (state, action) => {
        const trainer = state.trainers.find((t) => t.id === action.payload);
        if (trainer) {
          trainer.is_active = true;
        }
      });
  },
});

export default trainersSlice.reducer;
