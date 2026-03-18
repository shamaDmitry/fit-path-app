import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type Appointment } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

type AppointmentWithRelations = Omit<Appointment, "trainer_name" | "user_name"> & {
  trainer?: { full_name: string } | null;
  user?: { full_name: string } | null;
};

const initialState: AppointmentsState = {
  appointments: [],
  loading: false,
  error: null,
};

const toAppointment = (appointment: AppointmentWithRelations): Appointment => ({
  ...appointment,
  trainer_name: appointment.trainer?.full_name || "Unknown Trainer",
  user_name: appointment.user?.full_name || "Unknown User",
});

export const fetchUserAppointments = createAsyncThunk(
  "appointments/fetchUserAppointments",
  async (userId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name),
        user:profiles(full_name)
      `)
      .eq("user_id", userId)
      .order("start_time", { ascending: true });

    if (error) return rejectWithValue(error.message);

    return ((data ?? []) as AppointmentWithRelations[]).map(toAppointment);
  }
);

export const fetchTrainerAppointments = createAsyncThunk(
  "appointments/fetchTrainerAppointments",
  async (trainerId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name),
        user:profiles(full_name)
      `)
      .eq("trainer_id", trainerId)
      .order("start_time", { ascending: true });

    if (error) return rejectWithValue(error.message);

    return ((data ?? []) as AppointmentWithRelations[]).map(toAppointment);
  }
);

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (appointment: Omit<Appointment, "id" | "created_at" | "trainer_name" | "user_name">, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .insert([appointment])
      .select(`
        *,
        trainer:trainers(full_name),
        user:profiles(full_name)
      `)
      .single();

    if (error) return rejectWithValue(error.message);

    return toAppointment(data as AppointmentWithRelations);
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateAppointmentStatus",
  async ({ id, status }: { id: string; status: Appointment["status"] }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select(`
        *,
        trainer:trainers(full_name),
        user:profiles(full_name)
      `)
      .single();

    if (error) return rejectWithValue(error.message);

    return toAppointment(data as AppointmentWithRelations);
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTrainerAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export default appointmentsSlice.reducer;
