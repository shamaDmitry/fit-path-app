import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import authReducer from "./slices/authSlice";
// import trainersReducer from "./slices/trainersSlice";
// import appointmentsReducer from "./slices/appointmentsSlice";
// import timeslotsReducer from "./slices/timeslotsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // trainers: trainersReducer,
    // appointments: appointmentsReducer,
    // timeslots: timeslotsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
