import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockTimeslots, type Timeslot } from "@/data/mockData";

interface TimeslotsState {
  timeslots: Timeslot[];
}

const initialState: TimeslotsState = {
  timeslots: mockTimeslots,
};

const timeslotsSlice = createSlice({
  name: "timeslots",
  initialState,
  reducers: {
    addTimeslot(state, action: PayloadAction<Timeslot>) {
      state.timeslots.push(action.payload);
    },

    removeTimeslot(state, action: PayloadAction<string>) {
      state.timeslots = state.timeslots.filter((timeSlot) => {
        return timeSlot.id !== action.payload;
      });
    },

    bookTimeslot(state, action: PayloadAction<string>) {
      const currentTimeslot = state.timeslots.find((timeSlot) => {
        return timeSlot.id === action.payload;
      });

      if (currentTimeslot) {
        currentTimeslot.is_booked = true;
      }
    },

    unbookTimeslot(state, action: PayloadAction<string>) {
      const currentTimeslot = state.timeslots.find((timeSlot) => {
        return timeSlot.id === action.payload;
      });

      if (currentTimeslot) {
        currentTimeslot.is_booked = false;
      }
    },
  },
});

export const { addTimeslot, removeTimeslot, bookTimeslot, unbookTimeslot } =
  timeslotsSlice.actions;

export default timeslotsSlice.reducer;
