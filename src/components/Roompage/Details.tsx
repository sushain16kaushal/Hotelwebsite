import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useOutletContext } from "react-router-dom";
import type { ContentData } from "../../types/content";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addRoomBooking } from "../../store/bookingSlice";
import toast, { Toaster } from 'react-hot-toast';
import { BookingBar } from "./BookingBar";

// Types for Cart
interface CartItem {
  cartId: number;
  hotelName: string;
  categoryName: string;
  planType: string;
  pricePerNight: number;
  roomsData: any[];
  nights: number;
  totalBase: number;
  image: string;
  checkIn: Date | string;
  checkOut: Date | string;
}

const Details = () => {
  const data = useOutletContext<ContentData>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const hotelData = data?.hotels ?? [];
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // BookingBar States (Assuming these are managed here to pass to BookingBar)
  const [bookingDates, setBookingDates] = useState({ 
    startDate: new Date(), 
    endDate: new Date(Date.now() + 86400000) 
  });
  const [rooms, setRooms] = useState<any[]>([{ id: 1, adults: 1, children: 0, type: 'Double Bed' }]);

  const hotel = hotelData.find((h) => h.hotelId === Number(id));

  useEffect(() => {
    setActiveImgIndex(0);
  }, [selectedCatIndex]);

  if (!hotel) return (
    <div className="h-screen flex items-center justify-center bg-[#f5f1ea]">
      <h2 className="text-2xl font-serif text-[#4a3f35]">Hotel not found!</h2>
    </div>
  );

  const category = hotel.roomCategories[selectedCatIndex];

  // --- LOGIC: CART & CALCULATIONS ---
 
const handleReserve = (planType: string, price: number) => {
    if (!rooms || rooms.length === 0) {
        toast.error("Please select rooms from the booking bar first!");
        return;
    }

    // 1. MODAL INVENTORY: Modal mein is category ke kitne rooms hain?
    const matchingRoomsInModal = rooms.filter(r => 
        category.categoryName.toLowerCase().includes(r.type.toLowerCase()) ||
        r.type.toLowerCase().includes(category.categoryName.toLowerCase())
    );

    const modalCount = matchingRoomsInModal.length;

    if (modalCount === 0) {
        toast.error(`you have not selected ${category.categoryName} in the booking slot`);
        return;
    }

    // 2. CART CHECK: Cart mein is category ke kitne rooms pehle se hain?
    const existingInCart = cart.find(item => item.categoryName === category.categoryName);
    const cartCount = existingInCart ? existingInCart.roomsData.length : 0;

    // 3. QUANTITY SAFETY LOCK
    // Agar user ne modal mein 2 rooms rakhe hain aur cart mein pehle se 2 hain, toh aur add nahi karne dena
    if (cartCount >= modalCount) {
        toast.error(`Limit Reached!  ${modalCount} ${category.categoryName} `, {
            icon: '🚫',
            style: { background: '#4a3f35', color: '#fff' }
        });
        return;
    }

    // 4. LOGIC: Nayi quantity aur dates ka snapshot
    
    // --- DYNAMIC DATE CALCULATION FIX ---
    // Yahan hum fresh dates le rahe hain taaki agar user ne modal mein change kiya ho toh wo turant calculate ho
const start = new Date(bookingDates.startDate).getTime();
    const end = new Date(bookingDates.endDate).getTime();
    
    // Difference in days calculation
    const diffInMs = end - start;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    // Safety check: Agar same date hai toh 1 night, warna calculated nights
    const finalNights = diffInDays > 0 ? diffInDays : 1;
    const roomsSnapshot = JSON.parse(JSON.stringify(matchingRoomsInModal));

    setCart(prevCart => {
        // Purani entry delete karo taaki updated selections (agar user ne modal badla ho) refresh ho jayein
        const otherItems = prevCart.filter(item => item.categoryName !== category.categoryName);
        
        const newBooking = {
            cartId: Date.now(),
            hotelName: hotel.hotelName,
            categoryName: category.categoryName,
            planType: planType,
            pricePerNight: price,
            roomsData: roomsSnapshot, // Exact matching rooms from modal
            nights: finalNights,
            totalBase: price * finalNights * roomsSnapshot.length,
            image: category.categoryImages[0],
            checkIn: new Date(start).toISOString(),
            checkOut: new Date(end).toISOString()
        };

        return [...otherItems, newBooking];
    });

    toast.success(`Reserved: ${roomsSnapshot.length} ${category.categoryName}`, {
        icon: '🏨'
    });
};

  // Tax Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalBase, 0);
  const gstRate = subtotal > 7500 ? 0.18 : 0.12;
  const totalGST = subtotal * gstRate;
  const serviceCharge = subtotal * 0.05;
  const grandTotal = subtotal + totalGST + serviceCharge;

  const handleFinalBooking = () => {
  const token = localStorage.getItem("token");

  // 1. Auth Check
  if (!token) {
    toast.error("Please sign in first!", {
      style: { borderRadius: '15px', background: '#4a3f35', color: '#fff' }
    });
    navigate('/auth');
    return;
  }

  // 2. Check if cart is empty
  if (cart.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  // 3. PUSH DATA TO REDUX (Booking Summary Page ke liye)
  // Hum cart ke saare items ko bari-bari Redux mein bhej rahe hain
  cart.forEach((item) => {
    dispatch(addRoomBooking({
      id: item.cartId,           // Unique ID
      hotelName: item.hotelName, // Euphoria Hotel, Shimla
      roomCategory: item.categoryName,
      image: item.image,
      price: item.totalBase,     // Total price including nights and room count
      plan: item.planType,
      nights: item.nights,
      checkIn: item.checkIn,
      checkOut: item.checkOut
    }));
  });

  // 4. Success Toast
  toast.success("Added to Booking Summary!", {
    icon: '🏔️',
    style: { borderRadius: '20px', border: '1px solid #eaddca' }
  });

  // 5. Redirect to Booking Page
  setTimeout(() => {
    navigate('/booking'); // Is route ko apne hisab se check kar lena
  }, 1000);
};

  const nextSlide = () => setActiveImgIndex((prev) => (prev + 1) % category.categoryImages.length);
  const prevSlide = () => setActiveImgIndex((prev) => (prev - 1 + category.categoryImages.length) % category.categoryImages.length);

  return (
    <div className="min-h-screen bg-[#f5f1ea] pb-20">
      <Toaster />
      
      <section className="px-4 pt-6">
        <div className="relative w-full h-[70vh] md:h-[80vh] min-h-125 max-h-212.5 rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-[#eaddca] bg-[#1a1a1a] group">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${selectedCatIndex}-${activeImgIndex}`}
              src={`https://ik.imagekit.io/y4ytihgqk/${category.categoryImages[activeImgIndex]}?tr=w-1200,h-800,fo-auto,q-60,f-auto`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover" 
            />
          </AnimatePresence>
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">❮</button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">❯</button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {category.categoryImages.map((_, idx) => (
              <button key={idx} onClick={() => setActiveImgIndex(idx)} className={`h-2 transition-all duration-300 rounded-full ${activeImgIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Bar with Props */}
      <BookingBar rooms={rooms} setRooms={setRooms} bookingDates={bookingDates} setBookingDates={setBookingDates} />

      <div className="max-w-6xl mx-auto px-6 mt-10">
        <header className="mb-12">
          <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-[#4a3f35]">{hotel.hotelName}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#8c7e6d] italic mt-3 text-lg">{hotel.address}</motion.p>
        </header>

        <section className="mb-12">
          <h3 className="text-[#4a3f35] font-semibold mb-6 uppercase tracking-widest text-sm">Select Room Category</h3>
          <div className="flex flex-wrap gap-4">
            {hotel.roomCategories.map((cat, idx) => (
              <button key={idx} onClick={() => setSelectedCatIndex(idx)} className={`px-8 py-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 text-left min-w-40 ${selectedCatIndex === idx ? "bg-[#bc9a7c] border-[#bc9a7c] text-white shadow-lg scale-105" : "bg-white border-[#eaddca] text-[#4a3f35] hover:border-[#bc9a7c]"}`}>
                <span className="block font-bold text-lg">{cat.categoryName}</span>
                <span className={`text-xs ${selectedCatIndex === idx ? "text-[#f5f1ea]" : "text-[#8c7e6d]"}`}>{cat.guests}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <AnimatePresence mode="popLayout">
              {category?.options.map((opt, idx) => (
                <motion.div layout key={opt.type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white/90 backdrop-blur-sm p-7 rounded-[35px] border shadow-sm flex flex-col h-full hover:shadow-xl hover:border-[#bc9a7c]/50 transition-all duration-300 border-t-[5px] border-[#bc9a7c]">
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-[2px] text-[#bc9a7c] font-bold block mb-1">Select Plan</span>
                    <h3 className="text-2xl font-serif font-bold text-[#4a3f35] leading-tight">{opt.type}</h3>
                  </div>
                  <div className="mb-6 pb-6 border-b border-[#eaddca]/50">
                    <p className="text-[10px] tracking-[2px] uppercase text-[#bc9a7c] font-bold mb-1">Best Available Rate</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-medium text-[#4a3f35]">₹{opt.pricePerNight.toLocaleString('en-IN')}</span>
                      <span className="text-base text-[#8c7e6d]/50 line-through font-light">₹{Math.round(opt.pricePerNight * 1.1)}</span>
                    </div>
                    <p className="text-[12px] text-[#8c7e6d] mt-1 font-light">per night / excluding taxes</p>
                  </div>
                  <ul className="space-y-3 mb-8 grow">
                    {opt.features.map((f, i) => (
                      <li key={i} className="flex items-start text-[#6d5f53] text-[13.5px] leading-snug"><span className="text-[#bc9a7c] mr-3 font-bold mt-0.5">✓</span>{f}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleReserve(opt.type, opt.pricePerNight)} className="w-full py-4 bg-[#4a3f35] text-white rounded-2xl cursor-pointer text-sm font-bold hover:bg-[#bc9a7c] transition-all shadow-md active:scale-95 mt-auto">
                    Reserve {opt.type}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

       {/* --- DYNAMIC ORDER SUMMARY (CART) --- */}
{cart.length > 0 && (
  <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-20 pt-12 border-t border-[#eaddca]">
    <h2 className="text-3xl font-serif text-[#4a3f35] mb-8 italic">Your Selection Summary</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <div key={item.cartId} className="bg-white border border-[#eaddca] p-6 rounded-[25px] flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
            <div className="flex gap-4 items-center">
              <img src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-200,h-200`} className="w-20 h-20 rounded-xl object-cover" alt="room" />
              <div>
                <span className="text-[10px] bg-[#4a3f35] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter mb-1 inline-block">{item.planType}</span>
                <h4 className="font-serif text-lg font-bold text-[#4a3f35]">{item.categoryName}</h4>
                
                {/* --- IMPROVED: DATES & NIGHTS DISPLAY --- */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                 
                  <p className="text-[11px] text-[#8c7e6d] flex items-center gap-1">
    <span className="opacity-60">📅</span> 
    {new Date(item.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - 
    {new Date(item.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
</p>
<p className="text-[11px] font-bold text-[#bc9a7c]">
      {item.nights} {item.nights > 1 ? 'Nights' : 'Night'}
    </p>

    <p className="text-[11px] text-[#8c7e6d]">
      {item.roomsData.length} Room(s)
    </p>
                </div>
              </div>
            </div>

            <div className="text-right w-full md:w-auto border-t md:border-0 pt-4 md:pt-0">
              <p className="text-xs text-[#8c7e6d] mb-1">
                ₹{item.pricePerNight.toLocaleString()} x {item.nights} Nights
              </p>
              <p className="font-bold text-xl text-[#4a3f35]">
                ₹{item.totalBase.toLocaleString('en-IN')}
              </p>
              <button 
                onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} 
                className="text-[10px] uppercase text-red-400 font-bold mt-2 hover:underline cursor-pointer"
              >
                Remove Selection
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Details Card (Grand Total Calculation) */}
      <div className="bg-[#4a3f35] text-white p-8 rounded-[35px] shadow-2xl h-fit lg:sticky lg:top-24">
        <h3 className="text-xl font-serif mb-6 border-b border-white/10 pb-4 italic text-[#bc9a7c]">Final Bill Details</h3>
        <div className="space-y-4 text-sm font-light">
          <div className="flex justify-between">
            <span className="opacity-70">Room Subtotal ({cart.reduce((acc, i) => acc + i.nights, 0)} Nights)</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Taxes & GST</span>
            <span>₹{totalGST.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Service Charge (5%)</span>
            <span>₹{serviceCharge.toLocaleString()}</span>
          </div>
          
          <div className="pt-6 mt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block">Payable Amount</span>
              <span className="text-3xl font-serif text-[#bc9a7c]">₹{Math.round(grandTotal).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleFinalBooking} 
          className="w-full mt-8 bg-[#bc9a7c] hover:bg-white hover:text-[#4a3f35] text-white py-4 rounded-2xl font-bold uppercase tracking-[3px] text-[11px] transition-all shadow-lg active:scale-95"
        >
          Confirm & Pay Securely
        </button>
      </div>
    </div>
  </motion.section>
)}
        
      </div>
    </div>
  );
};

export default Details;
