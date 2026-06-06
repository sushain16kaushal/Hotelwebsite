// controllers/bookingController.js

import Booking from '../Models/Booking.js';
import Customer from '../Models/Customer.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// --- NODEMAILER SETUP (Existing Transporter Logic) ---
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: { 
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// --- PROCESS PAYMENT & SAVE BOOKING ---
export const processPayment = async (req, res) => {
  const { userId, amount, paymentType, bookingDetails } = req.body;

  try {
    // 1. Save Booking to Database
    const newBooking = await Booking.create({
      userId,
      bookingDetails,
      paymentInfo: {
        amount,
        paymentType,
        status: 'PAID',
        transactionId: `TXN-${Date.now()}`, // Dummy ID (Stripe ID in real app)
        paidAt: Date.now()
      }
    });

    // 2. Get User Email
    const customer = await Customer.findById(userId);
    if (!customer) return res.status(404).json("User not found");

    // 3. Send Confirmation Email
    const transporter = createTransporter();
    
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

    await transporter.sendMail({
      from: '"Euphoria Hotels" <noreply@euphoriahotel.com>',
      to: customer.email,
      subject: '🎉 Booking Confirmed! - Euphoria, Shimla',
      html: htmlContent
    });

    res.status(200).json({ 
      success: true, 
      bookingId: newBooking._id,
      message: "Booking confirmed & email sent!"
    });

  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json("Payment processing failed");
  }
};

// --- GET USER BOOKINGS ---
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};