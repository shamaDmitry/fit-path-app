import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type Trainer } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

interface TrainersState {
  trainers: Trainer[];
  loading: boolean;
  error: string | null;
}

const initialState: TrainersState = {
  trainers: [],
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
  }
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
  }
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

const trainersSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      // Create Trainer
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.trainers.push(action.payload);
      })
      // Update Trainer
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trainers[index] = action.payload;
        }
      })
      // Soft Delete Trainer
      .addCase(softDeleteTrainer.fulfilled, (state, action) => {
        state.trainers = state.trainers.filter((t) => t.id !== action.payload);
      });
  },
});

export default trainersSlice.reducer;
