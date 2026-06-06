// src/pages/PaymentPage.tsx

import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearBookings } from '../store/bookingSlice'; // Import the new action

// WARNING: Replace this with your actual Stripe Publishable Key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphd7Vu'); 

const PaymentForm = ({ amount, type }: { amount: number, type: 'FULL' | 'PARTIAL' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- SIMULATION LOGIC ---
    // In a real app, you would call your backend here to create a PaymentIntent
    // await stripe.confirmCardPayment(clientSecret, { card: elements.getElement(CardElement) })
    
    // Dummy delay to simulate network request
    setTimeout(() => {
      setLoading(false);
      
      // 1. Clear Cart (Redux)
      dispatch(clearBookings());
      
      // 2. Simulate Email Send (Check Console)
      console.log(`Confirmation Email sent to user for ₹${amount}`);
      toast.success("Booking Confirmed! Please check your email.");

      // 3. Redirect to Home/Success
      navigate('/');
    }, 2000);
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#dcd0c0] shadow-sm">
        <label className="block text-xs font-bold text-[#4a3f35] uppercase tracking-widest mb-3">
          Credit / Debit Card
        </label>
        <div className="p-4 bg-[#f9f9f9] rounded-xl border border-[#eaddca]">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#4a3f35',
                fontFamily: '"Serif", Georgia, "Times New Roman", serif',
                '::placeholder': { color: '#bc9a7c' },
              },
              invalid: { color: '#fa755a' },
            },
          }} />
        </div>
      </div>

      <button 
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-5 bg-[#bc9a7c] text-white rounded-2xl font-bold uppercase tracking-[3px] text-[12px] shadow-xl hover:bg-[#a88969] transition-all active:scale-95 flex justify-center items-center gap-3"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          `Pay Securely ₹${amount.toLocaleString('en-IN')}`
        )}
      </button>
      
      <p className="text-center text-[10px] text-[#8c7e6d]">
        🔒 Powered by Stripe Test Environment
      </p>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve data passed from BookingPage
  // Default fallback if someone tries to access this page directly without cart
  const totalAmount = location.state?.total || 7500; 
  const [paymentType, setPaymentType] = useState<'FULL' | 'PARTIAL'>('FULL');

  const calculatedAmount = useMemo(() => {
    return paymentType === 'PARTIAL' 
      ? Math.round(totalAmount * 0.30) // 30% Advance
      : totalAmount;
  }, [paymentType, totalAmount]);

  return (
    <div className="min-h-screen bg-[#f5f1ea] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#faf9f6] rounded-[3rem] shadow-2xl overflow-hidden border border-[#dcd0c0]"
      >
        {/* Header */}
        <div className="bg-[#4a3f35] p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white">Secure Checkout</h2>
          <p className="text-[10px] text-[#bc9a7c] uppercase tracking-widest mt-1">Euphoria, Shimla</p>
        </div>

        {/* Payment Selector */}
        <div className="p-8">
            <label className="block text-xs font-bold text-[#4a3f35] mb-4 uppercase tracking-widest">Select Payment Mode</label>
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setPaymentType('FULL')}
                    className={`flex-1 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                        paymentType === 'FULL' 
                        ? 'bg-[#4a3f35] text-white border-[#4a3f35]' 
                        : 'bg-white text-[#8c7e6d] border-[#eaddca]'
                    }`}
                >
                    Full Payment
                    <span className="block text-[10px] font-normal opacity-70 mt-1">₹{totalAmount.toLocaleString('en-IN')}</span>
                </button>
                <button 
                    onClick={() => setPaymentType('PARTIAL')}
                    className={`flex-1 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                        paymentType === 'PARTIAL' 
                        ? 'bg-[#4a3f35] text-white border-[#4a3f35]' 
                        : 'bg-white text-[#8c7e6d] border-[#eaddca]'
                    }`}
                >
                    Partial (30%)
                    <span className="block text-[10px] font-normal opacity-70 mt-1">Pay ₹{Math.round(totalAmount*0.3).toLocaleString('en-IN')} Now</span>
                </button>
            </div>

            <div className="border-t border-[#eaddca] my-6"></div>

            {/* Stripe Form */}
            <Elements stripe={stripePromise}>
                <PaymentForm amount={calculatedAmount} type={paymentType} />
            </Elements>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;