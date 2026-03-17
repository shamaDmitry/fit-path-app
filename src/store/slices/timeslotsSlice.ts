import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type Timeslot } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

interface TimeslotsState {
  timeslots: Timeslot[];
  loading: boolean;
  error: string | null;
}

const initialState: TimeslotsState = {
  timeslots: [],
  loading: false,
  error: null,
};

export const fetchTrainerTimeslots = createAsyncThunk(
  "timeslots/fetchTrainerTimeslots",
  async (trainerId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("timeslots")
      .select("*")
      .eq("trainer_id", trainerId)
      .order("date")
      .order("start_time");

    if (error) return rejectWithValue(error.message);
    return data as Timeslot[];
  }
);

export const fetchPublicTimeslots = createAsyncThunk(
  "timeslots/fetchPublicTimeslots",
  async (trainerId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("timeslots")
      .select("*")
      .eq("trainer_id", trainerId)
      .eq("is_booked", false)
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date")
      .order("start_time");

    if (error) return rejectWithValue(error.message);
    return data as Timeslot[];
  }
);

export const addTimeslot = createAsyncThunk(
  "timeslots/addTimeslot",
  async (timeslot: Omit<Timeslot, "id">, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("timeslots")
      .insert([timeslot])
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data as Timeslot;
  }
);

export const removeTimeslot = createAsyncThunk(
  "timeslots/removeTimeslot",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("timeslots")
      .delete()
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return id;
  }
);

export const bookTimeslot = createAsyncThunk(
  "timeslots/bookTimeslot",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("timeslots")
      .update({ is_booked: true })
      .eq("id", id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data as Timeslot;
  }
);

export const unbookTimeslot = createAsyncThunk(
  "timeslots/unbookTimeslot",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("timeslots")
      .update({ is_booked: false })
      .eq("id", id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data as Timeslot;
  }
);

const timeslotsSlice = createSlice({
  name: "timeslots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainerTimeslots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerTimeslots.fulfilled, (state, action) => {
        state.loading = false;
        state.timeslots = action.payload;
      })
      .addCase(fetchTrainerTimeslots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPublicTimeslots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicTimeslots.fulfilled, (state, action) => {
        state.loading = false;
        state.timeslots = action.payload;
      })
      .addCase(fetchPublicTimeslots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTimeslot.fulfilled, (state, action) => {
        state.timeslots.push(action.payload);
        // Re-sort
        state.timeslots.sort((a, b) => 
          `${a.date}${a.start_time}`.localeCompare(`${b.date}${b.start_time}`)
        );
      })
      .addCase(removeTimeslot.fulfilled, (state, action) => {
        state.timeslots = state.timeslots.filter((ts) => ts.id !== action.payload);
      })
      .addCase(bookTimeslot.fulfilled, (state, action) => {
        const index = state.timeslots.findIndex((ts) => ts.id === action.payload.id);
        if (index !== -1) {
          state.timeslots[index].is_booked = true;
        }
      })
      .addCase(unbookTimeslot.fulfilled, (state, action) => {
        const index = state.timeslots.findIndex((ts) => ts.id === action.payload.id);
        if (index !== -1) {
          state.timeslots[index].is_booked = false;
        }
      });
  },
});

export default timeslotsSlice.reducer;
