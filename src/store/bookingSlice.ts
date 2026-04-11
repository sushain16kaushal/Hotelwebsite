import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface BookingState {
  roomBookings: any[];
  diningBookings: any[];
  offerBookings: any[];
}

const initialState: BookingState = {
  roomBookings: [],
  diningBookings: [],
  offerBookings: [],
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
    addOfferBooking: (state, action: PayloadAction<any>) => {
    // Check karo ki offer pehle se toh nahi hai (Duplicate handle)
    const exists = state.offerBookings.find(item => item.id === action.payload.id);
    if (!exists) {
      state.offerBookings.push(action.payload);
    }
  },
  removeOfferBooking: (state, action: PayloadAction<number>) => {
    state.offerBookings = state.offerBookings.filter(
      (offer) => offer.id !== action.payload
    );
  },
  },
});

export const { addRoomBooking, addDiningBooking, clearBookings,removeRoomBooking,removeDiningBooking,addOfferBooking, 
  removeOfferBooking } = bookingSlice.actions;
export default bookingSlice.reducer;