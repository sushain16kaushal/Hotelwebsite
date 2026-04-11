import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface BookingState {
  roomBookings: any[];
  diningBookings: any[];
}

const initialState: BookingState = {
  roomBookings: [],
  diningBookings: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addRoomBooking: (state, action: PayloadAction<any>) => {
      state.roomBookings.push(action.payload);
    },
    addDiningBooking: (state, action: PayloadAction<any>) => {
      state.diningBookings.push(action.payload);
    },
    clearBookings: (state) => {
      state.roomBookings = [];
      state.diningBookings = [];
    },
    removeRoomBooking: (state, action: PayloadAction<number>) => {
  state.roomBookings = state.roomBookings.filter(item => item.id !== action.payload);
},
removeDiningBooking: (state, action: PayloadAction<number>) => {
      state.diningBookings = state.diningBookings.filter(
        (dining) => dining.id !== action.payload
      );
    },
  },
});

export const { addRoomBooking, addDiningBooking, clearBookings,removeRoomBooking,removeDiningBooking } = bookingSlice.actions;
export default bookingSlice.reducer;