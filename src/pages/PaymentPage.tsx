// src/pages/PaymentPage.tsx - Simple Version (Login Check Removed)

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearBookings } from '../store/bookingSlice';
import { FaLock, FaCreditCard } from 'react-icons/fa';
import type { RootState } from '../store/store';
import type { User } from '../types/content';

const stripePromise = loadStripe('pk_test_51TfRtM9Or23fsXSkUgO7kUe5UfHxfHadTrWZWlmV5m4eBUrejcmIAQZkNAQd3y19C40iG1oLztS6sAn3Lyr9skT800HhfBSB6v');

const PaymentForm = ({ amount, paymentType }: { amount: number; paymentType: 'FULL' | 'PARTIAL' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // User & Token directly from Redux
  const user = useSelector((state: RootState) => state.auth?.user as User | null);
  const token = useSelector((state: RootState) => state.auth?.token as string | null);
  
  const roomBookings = useSelector((state: RootState) => state.booking?.roomBookings || []);
  const diningBookings = useSelector((state: RootState) => state.booking?.diningBookings || []);
  const offerBookings = useSelector((state: RootState) => state.booking?.offerBookings || []);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    if (!user || !token) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Get Card Element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Please enter card details");
      }

      // 2. Create Payment Method (Card Validation)
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // 3. Call Backend API
      const response = await fetch('https://hotelapp-tiof.onrender.com/api/process-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          amount: amount,
          paymentType: paymentType,
          paymentMethodId: paymentMethod?.id,
          bookingDetails: {
            hotels: roomBookings,
            dining: diningBookings,
            offers: offerBookings
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        dispatch(clearBookings());
        
        if (paymentType === 'PARTIAL') {
          toast.success("🎉 Partial Payment Done! Balance to pay at check-in.");
        } else {
          toast.success("🎉 Full Payment Confirmed! Check your email.");
        }
        
        navigate('/');
      } else {
        throw new Error(data.message || "Payment failed");
      }

    } catch (err: any) {
      console.error('Payment Error:', err);
      setError(err.message || "Payment failed");
      toast.error(err.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs text-center border border-red-100">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-2xl border border-[#dcd0c0] shadow-sm">
        <label className=" text-xs font-bold text-[#4a3f35] uppercase tracking-widest mb-3 flex items-center gap-2">
          <FaCreditCard className="text-[#bc9a7c]" /> Card Details
        </label>
        <div className="p-4 bg-[#f9f9f9] rounded-xl border border-[#eaddca]">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#4a3f35',
                fontFamily: '"Serif", serif',
              },
            },
          }} />
        </div>
      </div>

      <button 
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-5 bg-[#bc9a7c] text-white rounded-2xl font-bold uppercase tracking-[3px] text-[12px] shadow-xl hover:bg-[#a88969] transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Processing...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            <FaLock className="text-xs" /> Pay ₹{amount.toLocaleString('en-IN')}
          </span>
        )}
      </button>
      
      <p className="text-center text-[10px] text-[#8c7e6d]">
        🔒 Secured by Stripe Test Mode
      </p>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const totalAmount = location.state?.total || 0; 
  const [paymentType, setPaymentType] = useState<'FULL' | 'PARTIAL'>('FULL');

  useEffect(() => {
    if (!totalAmount || totalAmount === 0) {
      toast.error("Your cart is empty!");
      navigate('/booking-summary');
    }
  }, [totalAmount, navigate]);

  const calculatedAmount = useMemo(() => {
    return paymentType === 'PARTIAL' 
      ? Math.round(totalAmount * 0.30) 
      : totalAmount;
  }, [paymentType, totalAmount]);

  return (
    <div className="min-h-screen bg-[#f5f1ea] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#faf9f6] rounded-[3rem] shadow-2xl overflow-hidden border border-[#dcd0c0]"
      >
        <div className="bg-[#4a3f35] p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white">Secure Checkout</h2>
          <p className="text-[10px] text-[#bc9a7c] uppercase tracking-widest mt-1">Euphoria, Shimla</p>
        </div>

        <div className="p-8">
          <label className="block text-xs font-bold text-[#4a3f35] mb-4 uppercase tracking-widest">
            Select Payment Mode
          </label>
          
          <div className="flex gap-4 mb-8">
            <button 
              type="button"
              onClick={() => setPaymentType('FULL')}
              className={`flex-1 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                paymentType === 'FULL' 
                ? 'bg-[#4a3f35] text-white border-[#4a3f35]' 
                : 'bg-white text-[#8c7e6d] border-[#eaddca]'
              }`}
            >
              Full Payment
              <span className="block text-[10px] font-normal opacity-70 mt-1">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </button>
            
            <button 
              type="button"
              onClick={() => setPaymentType('PARTIAL')}
              className={`flex-1 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                paymentType === 'PARTIAL' 
                ? 'bg-[#4a3f35] text-white border-[#4a3f35]' 
                : 'bg-white text-[#8c7e6d] border-[#eaddca]'
              }`}
            >
              Partial (30%)
              <span className="block text-[10px] font-normal opacity-70 mt-1">
                Pay ₹{Math.round(totalAmount * 0.3).toLocaleString('en-IN')}
              </span>
            </button>
          </div>

          <div className="border-t border-[#eaddca] my-6"></div>

          <Elements stripe={stripePromise}>
            <PaymentForm amount={calculatedAmount} paymentType={paymentType} />
          </Elements>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;