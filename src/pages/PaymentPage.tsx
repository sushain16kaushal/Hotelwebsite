// src/pages/PaymentPage.tsx - Debug Version

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearBookings } from '../store/bookingSlice';
import { FaLock, FaCreditCard, FaSpinner } from 'react-icons/fa';
import type { RootState } from '../store/store';
import type { User } from '../types/content';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphd7Vu');

const PaymentForm = ({ amount, paymentType }: { amount: number; paymentType: 'FULL' | 'PARTIAL' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.auth?.user as User | null);
  const token = useSelector((state: RootState) => state.auth?.token as string | null);
  
  const roomBookings = useSelector((state: RootState) => state.booking?.roomBookings || []);
  const diningBookings = useSelector((state: RootState) => state.booking?.diningBookings || []);
  const offerBookings = useSelector((state: RootState) => state.booking?.offerBookings || []);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Debug: Check stripe status
  useEffect(() => {
    console.log('Stripe initialized:', !!stripe);
    console.log('Elements initialized:', !!elements);
    console.log('User:', user);
    console.log('Token exists:', !!token);
  }, [stripe, elements, user, token]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Button clicked!');
    console.log('Stripe:', stripe);
    console.log('Elements:', elements);
    console.log('Amount:', amount);
    
    if (!stripe || !elements) {
      const err = "Payment system not loaded. Please refresh.";
      setError(err);
      toast.error(err);
      return;
    }
    
    // Check login (simplified - just show error)
    if (!user || !token) {
      toast.error("Please login first!");
      return;
    }
    
    setLoading(true);
    setError(null);
    console.log('Starting payment process...');

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card details not entered");
      }

      // Create payment method (this validates the card)
      console.log('Validating card...');
      
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        console.error('Stripe Error:', stripeError);
        throw new Error(stripeError.message);
      }

      console.log('Payment Method Created:', paymentMethod?.id);

      // Simulate server processing
      console.log('Processing payment on server...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call Backend API
      console.log('Calling backend API...');
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
      console.log('API Response:', data);

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
          <CardElement 
            onChange={(e) => setCardComplete(e.complete)}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#4a3f35',
                  fontFamily: '"Serif", serif',
                },
              },
            }} 
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className="w-full py-5 bg-[#bc9a7c] text-white rounded-2xl font-bold uppercase tracking-[3px] text-[12px] shadow-xl hover:bg-[#a88969] transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            <FaLock className="text-xs" /> Pay ₹{amount.toLocaleString('en-IN')}
          </span>
        )}
      </button>
      
      {!cardComplete && !loading && (
        <p className="text-center text-[10px] text-orange-500">
          ⚠️ Please enter complete card details
        </p>
      )}
      
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

  const user = useSelector((state: RootState) => state.auth?.user as User | null);

  useEffect(() => {
    console.log('Total Amount:', totalAmount);
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
          
          {user && (
            <p className="text-[10px] text-white/70 mt-2">
              Paying as: {user.email}
            </p>
          )}
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