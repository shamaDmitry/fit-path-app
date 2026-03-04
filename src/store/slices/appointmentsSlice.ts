import { mockAppointments, type Appointment } from "@/data/mockData";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppointmentsState {
  appointments: Appointment[];
}

const initialState: AppointmentsState = {
  appointments: mockAppointments,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.appointments.push(action.payload);
    },

    updateAppointmentStatus(
      state,
      action: PayloadAction<{ id: string; status: Appointment["status"] }>,
    ) {
      const apt = state.appointments.find((a) => a.id === action.payload.id);

      if (apt) {
        apt.status = action.payload.status;
      }
    },

    cancelAppointment(state, action: PayloadAction<string>) {
      const apt = state.appointments.find((item) => item.id === action.payload);

      if (apt) {
        apt.status = "cancelled";
      }
    },
  },
});

export const { addAppointment, cancelAppointment, updateAppointmentStatus } =
  appointmentsSlice.actions;

export default appointmentsSlice.reducer;
