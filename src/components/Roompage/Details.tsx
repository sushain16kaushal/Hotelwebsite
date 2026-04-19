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
}

const Details = () => {
  const data = useOutletContext<ContentData>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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
  const nights = Math.ceil((bookingDates.endDate.getTime() - bookingDates.startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const handleReserve = (planType: string, price: number) => {
    const nightCount = nights > 0 ? nights : 1;
    
    const newBooking: CartItem = {
      cartId: Date.now(),
      hotelName: hotel.hotelName,
      categoryName: category.categoryName,
      planType: planType,
      pricePerNight: price,
      roomsData: [...rooms],
      nights: nightCount,
      totalBase: price * nightCount * rooms.length,
      image: category.categoryImages[0]
    };

    setCart([...cart, newBooking]);
    toast.success(`Added ${category.categoryName} to selection`, {
      style: { background: '#4a3f35', color: '#fff', borderRadius: '15px' }
    });
  };

  // Tax Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalBase, 0);
  const gstRate = subtotal > 7500 ? 0.18 : 0.12;
  const totalGST = subtotal * gstRate;
  const serviceCharge = subtotal * 0.05;
  const grandTotal = subtotal + totalGST + serviceCharge;

  const handleFinalBooking = () => {
    const isAuthenticated = localStorage.getItem("token"); // Aapka auth logic

    if (!isAuthenticated) {
      toast.error("Sign-in required to confirm booking", { icon: '🔒' });
      // Redirecting to login with state to return back
      navigate('/auth', { state: { from: location.pathname, pendingCart: cart } });
    } else {
      // Dispatch to Redux and Move to Bookings Page
      cart.forEach(item => dispatch(addRoomBooking(item)));
      navigate('/bookings');
    }
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
                  <div key={item.cartId} className="bg-white border border-[#eaddca] p-6 rounded-[25px] flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] bg-[#4a3f35] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter mb-2 inline-block">{item.planType}</span>
                      <h4 className="font-serif text-lg font-bold text-[#4a3f35]">{item.categoryName}</h4>
                      <p className="text-xs text-[#8c7e6d]">
                        {item.roomsData.length} Room(s) • {item.nights} Night(s) • 
                        {item.roomsData.reduce((acc, r) => acc + r.adults, 0)} Adults
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#4a3f35]">₹{item.totalBase.toLocaleString('en-IN')}</p>
                      <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="text-[10px] uppercase text-red-400 font-bold mt-2">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details Card */}
              <div className="bg-[#4a3f35] text-white p-8 rounded-[35px] shadow-2xl h-fit sticky top-24">
                <h3 className="text-xl font-serif mb-6 border-b border-white/10 pb-4 italic text-[#bc9a7c]">Bill Details</h3>
                <div className="space-y-4 text-sm font-light">
                  <div className="flex justify-between"><span className="opacity-70">Room Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="opacity-70">GST (Shimla {gstRate * 100}%)</span><span>₹{totalGST.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="opacity-70">Service Charge (5%)</span><span>₹{serviceCharge.toLocaleString()}</span></div>
                  <div className="pt-6 mt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-xs uppercase tracking-widest font-bold">Total Amount</span>
                    <span className="text-3xl font-serif text-[#bc9a7c]">₹{Math.round(grandTotal).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={handleFinalBooking} className="w-full mt-8 bg-[#bc9a7c] hover:bg-white hover:text-[#4a3f35] text-white py-4 rounded-2xl font-bold uppercase tracking-[3px] text-[11px] transition-all shadow-lg active:scale-95">
                  Add to Booking & Proceed 🔒
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
