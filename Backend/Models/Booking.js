import mongoose from 'mongoose';
const BookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true 
  },
  bookingDetails: {
    hotels: [{
      hotelName: String,
      roomCategory: String,
      checkIn: String,
      checkOut: String,
      nights: Number,
      price: Number
    }],
    dining: [{
      restaurantName: String,
      tables: Number,
      date: String
    }],
    offers: [{
      title: String,
      price: Number
    }]
  },
  paymentInfo: {
    amount: { type: Number, required: true },
    paymentType: { type: String, enum: ['FULL', 'PARTIAL'], default: 'FULL' },
    transactionId: { type: String }, // Stripe Transaction ID
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    paidAt: { type: Date, default: Date.now }
  },
  status: { 
    type: String, 
    enum: ['CONFIRMED', 'CANCELLED'], 
    default: 'CONFIRMED' 
  },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Booking', BookingSchema);