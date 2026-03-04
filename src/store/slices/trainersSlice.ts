import { createSlice } from "@reduxjs/toolkit";
import { mockTrainers, type Trainer } from "@/data/mockData";

interface TrainersState {
  trainers: Trainer[];
}

const initialState: TrainersState = {
  trainers: mockTrainers,
};

const trainersSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {
    addTrainer(state, action) {
      state.trainers.push(action.payload);
    },

    removeTrainer(state, action) {
      state.trainers = state.trainers.filter((trainer) => {
        return trainer.id !== action.payload;
      });
    },
  },
});

export const { addTrainer, removeTrainer } = trainersSlice.actions;

export default trainersSlice.reducer;
