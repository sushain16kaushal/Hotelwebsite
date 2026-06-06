import { useState, type JSX } from "react";
import { useOutletContext } from "react-router-dom";
import type { ContentData, Dining } from "../types/content";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux"; // 1. Redux Dispatch
import { addDiningBooking } from "../store/bookingSlice"; // 2. Action Import
import toast, { Toaster } from "react-hot-toast"; // 3. Notification

const DiningComponent = (): JSX.Element => {
  const data = useOutletContext<ContentData>();
  const [selectedMenu, setSelectedMenu] = useState<Dining | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{
    restaurant: Dining | null;
    date: string;
    time: string;
    tables: number;
  }>({
    restaurant: null,
    date: "",
    time: "",
    tables: 1,
  });

  const dispatch = useDispatch();

  const handleConfirmBooking = () => {
    const { restaurant, date, time, tables } = bookingDetails;
    
    if (!date || !time) {
      toast.error("Please select Date and Time!");
      return;
    }
    if (!restaurant) return;

    const diningData = {
      id: Date.now(),
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      image: restaurant.image,
      price: 1500 * tables,
      meta: { date, time, tables }
    };

    dispatch(addDiningBooking(diningData));
    toast.success(`${restaurant.name} added to bookings!`);
    
    // RESET: Modal band karne ke liye restaurant ko null kiya
    setBookingDetails({ restaurant: null, date: "", time: "", tables: 1 });
  };

  return (
    <div className="mt-2 flex flex-wrap bg-[#f5f1ea] p-2 md:p-6 min-h-screen relative">
      <Toaster />
      
      {data.dinings.map((item, index) => (
        <div key={index} className="w-full md:w-1/2 p-3">
          {/* ... (apka existing card code) */}
          <button 
            onClick={() => setBookingDetails({ ...bookingDetails, restaurant: item })}
            className="flex-[1.5] py-3 bg-[#4a3f35] text-white rounded-2xl transition-all duration-300 hover:bg-[#bc9a7c] hover:shadow-xl active:scale-95 text-[11px] font-bold uppercase cursor-pointer tracking-widest"
          >
            Book Table
          </button>
        </div>
      ))}

      {/* --- FIXED BOOKING MODAL --- */}
      <AnimatePresence>
        {bookingDetails.restaurant && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setBookingDetails({ restaurant: null, date: "", time: "", tables: 1 })}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#faf9f6] rounded-[2.5rem] shadow-2xl z-[201] p-8 border border-[#dcd0c0]"
            >
              <h3 className="text-xl font-serif font-bold text-[#4a3f35] mb-6">Table Reservation</h3>
              
              <div className="space-y-4">
                <input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDetails.date}
                  className="w-full p-3 bg-white border border-[#eaddca] rounded-xl text-sm" 
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} 
                />
                
                <input 
                  type="time" 
                  value={bookingDetails.time}
                  className="w-full p-3 bg-white border border-[#eaddca] rounded-xl text-sm" 
                  onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})} 
                />
                
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-[#8c7e6d]">Tables:</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={bookingDetails.tables}
                    className="w-20 p-3 bg-white border border-[#eaddca] rounded-xl text-sm" 
                    onChange={(e) => setBookingDetails({...bookingDetails, tables: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setBookingDetails({ restaurant: null, date: "", time: "", tables: 1 })} 
                  className="flex-1 py-3 text-xs font-bold text-[#8c7e6d] hover:text-[#4a3f35]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmBooking} 
                  className="flex-1 py-3 bg-[#4a3f35] text-white rounded-2xl text-xs font-bold hover:bg-[#bc9a7c]"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default DiningComponent;