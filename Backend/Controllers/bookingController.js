// controllers/bookingController.js

import Booking from '../Models/Booking.js'
import Customer from '../Models/Customer.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service:'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Process Payment
export const processPayment = async (req, res) => {
  
     console.log('📥 Payment request received:', req.body); 
  const { userId, amount, paymentType, bookingDetails } = req.body;
  // UserId validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID"
    });
  }
  try {
    // 1. Save Booking to Database ✅
    console.log("STEP 1 - Booking Save Start");
   const newBooking = await Booking.create({
  userId,
  bookingDetails: {
    hotels: bookingDetails.hotels || [],
    dining: bookingDetails.dining || [],
    offers: bookingDetails.offers || []
  },
  paymentInfo: {
    amount,
    paymentType,
    status: 'PAID',
    transactionId: `TXN-${Date.now()}`,
    paidAt: new Date() // Date.now() ki jagah new Date() use karein standard formatting ke liye
  }
});
console.log("STEP 2 - Booking Saved");
    // 2. Get User Details for Email ✅
    const customer = await Customer.findById(userId);
    console.log("STEP 3 - Customer Found");
    if (!customer) throw new Error("User not found");

    // 3. Send Confirmation Email ✅
    const htmlContent = `
      <div style="font-family: 'Georgia', serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eaddca; border-radius: 15px; background: #faf9f6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4a3f35; margin: 0;">🌟 Euphoria, Shimla</h1>
          <p style="color: #bc9a7c; margin: 5px 0;">Booking Confirmation</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #eaddca;">
          <h3 style="color: #4a3f35; margin-top: 0;">Hi ${customer.name},</h3>
          <p style="color: #6d5f53; line-height: 1.6;">
            Thank you for choosing <strong>Euphoria Heritage</strong>. Your payment of 
            <strong style="color: #bc9a7c; font-size: 18px;">₹${amount}</strong> has been successfully processed!
          </p>
          
          <div style="margin: 25px 0; padding: 15px; background: #f5f1ea; border-radius: 8px;">
            <p style="margin: 5px 0; color: #4a3f35;"><strong>Booking ID:</strong> #EPH-${newBooking._id.toString().slice(-6)}</p>
            <p style="margin: 5px 0; color: #4a3f35;"><strong>Payment Type:</strong> ${paymentType}</p>
          </div>
        </div>

        <p style="text-align: center; color: #8c7e6d; font-size: 14px;">
          We look forward to welcoming you!<br/>
          <strong>- The Euphoria Team</strong>
        </p>
      </div>
    `;
console.log("STEP 4 - Sending Email");
  transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: customer.email,
  subject: '🎉 Booking Confirmed! - Euphoria, Shimla',
  html: htmlContent
})
.then(() => console.log("Email sent"))
.catch(err => console.error("Mail Error:", err));
    // 4. Return Success Response ✅
  return res.status(200).json({ 
      success: true, 
      message: "Booking confirmed & email sent!",
      bookingId: newBooking._id
    });

  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};