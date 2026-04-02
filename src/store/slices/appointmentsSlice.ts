import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type Appointment } from "@/types";
import { supabase } from "@/lib/supabase";

interface AppointmentsState {
  currentAppointment: Appointment | null;
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

type AppointmentWithRelations =
  & Omit<Appointment, "trainer_name" | "user_name">
  & {
    trainer?: { full_name: string; color?: string } | null;
    user?: { full_name: string } | null;
  };

const initialState: AppointmentsState = {
  currentAppointment: null,
  appointments: [],
  loading: false,
  error: null,
};

const toAppointment = (appointment: AppointmentWithRelations): Appointment => ({
  ...appointment,
  trainer_name: appointment.trainer?.full_name || "Unknown Trainer",
  user_name: appointment.user?.full_name || "Unknown User",
});

export const fetchAdminAppointments = createAsyncThunk(
  "appointments/fetchAdminAppointments",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name,color),
        user:profiles!user_id(full_name)
      `)
      .order("start_time", { ascending: true });

    if (error) return rejectWithValue(error.message);

    return ((data ?? []) as AppointmentWithRelations[]).map(toAppointment);
  },
);
export const fetchUserAppointments = createAsyncThunk(
  "appointments/fetchUserAppointments",
  async (userId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name,color),
        user:profiles!user_id(full_name)
      `)
      .eq("user_id", userId)
      .order("start_time", { ascending: true });

    if (error) return rejectWithValue(error.message);

    return ((data ?? []) as AppointmentWithRelations[]).map(toAppointment);
  },
);

export const fetchAppointment = createAsyncThunk(
  "appointments/fetchAppointment",
  async (appointmentId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name,color),
        user:profiles!user_id(full_name)
      `)
      .eq("id", appointmentId)
      .single();

    if (error) return rejectWithValue(error.message);

    return toAppointment(data as AppointmentWithRelations);
  },
);

export const payAppointment = createAsyncThunk(
  "appointments/payAppointment",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.functions.invoke(
      "create-checkout",
      {},
    );

    console.log("payAppointment", { data, error });

    if (error) return rejectWithValue(error.message);

    return toAppointment(data as AppointmentWithRelations);
  },
);

export const fetchTrainerAppointments = createAsyncThunk(
  "appointments/fetchTrainerAppointments",
  async (trainerId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name,color),
        user:profiles!user_id(full_name)
      `)
      .eq("trainer_id", trainerId)
      .order("start_time", { ascending: true });

    if (error) return rejectWithValue(error.message);

    return ((data ?? []) as AppointmentWithRelations[]).map(toAppointment);
  },
);

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (
    appointment: Omit<
      Appointment,
      "id" | "created_at" | "trainer_name" | "user_name"
    >,
    { rejectWithValue },
  ) => {
    const { data, error } = await supabase
      .from("appointments")
      .insert([appointment])
      .select(`
        *,
        trainer:trainers(full_name,color),
        user:profiles!user_id(full_name)
      `)
      .single();

    if (error) return rejectWithValue(error.message);

    return toAppointment(data as AppointmentWithRelations);
  },
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateAppointmentStatus",
  async (
    { id, status }: { id: string; status: Appointment["status"] },
    { rejectWithValue },
  ) => {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select(`
        *,
        trainer:trainers(full_name,color),
        user:profiles!user_id(full_name)
      `)
      .single();

    if (error) return rejectWithValue(error.message);

    return toAppointment(data as AppointmentWithRelations);
  },
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAdminAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
        const index = state.appointments.findIndex((a) =>
          a.id === action.payload.id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }

        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      });
  },
});

export default appointmentsSlice.reducer;
