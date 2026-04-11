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
  const dispatch = useDispatch();

  // Booking Handler for Dining
  const handleBookTable = (restaurant: Dining) => {
    const diningData = {
      id: Date.now(),
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      image: restaurant.image, // Summary page par dikhane ke liye
    };

    // Dispatch to Redux
    dispatch(addDiningBooking(diningData));

    // Ecommerce style toast
    toast.success(`${restaurant.name} added to bookings!`, {
      duration: 2000,
      position: 'bottom-right',
      style: {
        background: '#4a3f35',
        color: '#fff',
        borderRadius: '15px',
        fontSize: '13px',
        fontWeight: 'bold'
      },
    });
  };

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="mt-2 flex flex-wrap bg-[#f5f1ea] p-2 md:p-6 min-h-screen relative">
      <Toaster /> {/* Toast Container */}
      
      {data.dinings.map((item, index) => (
        <div key={index} className="w-full md:w-1/2 p-3">
          <div className="group relative flex flex-col lg:flex-row border border-[#dcd0c0] p-6 rounded-[2.5rem] bg-[#faf9f6] shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#bc9a7c]/40 hover:-translate-y-1 h-full overflow-hidden">
            
            {/* Image Box */}
            <div className="w-full lg:w-64 lg:h-88 h-72 shrink-0 rounded-4xl bg-[#fdfcfb] overflow-hidden relative shadow-md">
              <img
                src={item.image ? `https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-500,h-800,fo-auto,q-80` : 'https://via.placeholder.com/500x800?text=Euphoria+Dining'}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-[#4a3f35] text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[2px] shadow-sm border border-[#eaddca]">
                  {item.timing}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between grow ml-0 lg:ml-10 mt-6 lg:mt-0 w-full">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[3px] text-[#bc9a7c] font-extrabold">
                  {item.cuisine}
                </span>

                <h2 className="text-2xl font-serif font-bold text-[#4a3f35] leading-tight group-hover:text-[#bc9a7c] transition-colors duration-300">
                  {item.name}
                </h2>
                
                <a 
                  href={getGoogleMapsUrl(item.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group/addr cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#bc9a7c] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <p className="text-[11px] font-medium text-[#8c7e6d] group-hover/addr:text-[#bc9a7c] transition-colors leading-snug">
                    {item.address}
                  </p>
                </a>

                <p className="text-xs md:text-[13px] text-[#8c7e6d] leading-relaxed font-medium line-clamp-2 italic">
                  "{item.description}"
                </p>

                <div className="py-3 border-y border-[#eaddca]/50 my-3">
                  <p className="text-[10px] uppercase text-[#bc9a7c] font-bold mb-2 tracking-wider">Chef's Specials</p>
                  <div className="flex flex-wrap gap-2">
                    {item.topItems.slice(0, 3).map((dish, i) => (
                      <span key={i} className="text-[11px] font-semibold text-[#4a3f35] bg-[#eaddca]/30 px-2 py-1 rounded-md">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-auto flex items-center gap-3 pt-4">
                <button 
                  onClick={() => setSelectedMenu(item)}
                  className="flex-1 py-3 border border-[#bc9a7c] text-[#bc9a7c] rounded-2xl transition-all duration-300 hover:bg-[#bc9a7c] hover:text-white text-[11px] font-bold uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  Menu
                </button>
                <button 
                  onClick={() => handleBookTable(item)} // Dispatch action on click
                  className="flex-[1.5] py-3 bg-[#4a3f35] text-white rounded-2xl transition-all duration-300 hover:bg-[#bc9a7c] hover:shadow-xl active:scale-95 text-[11px] font-bold uppercase cursor-pointer tracking-widest"
                >
                  Book Table
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* --- MENU MODAL (No changes here, keeping it clean) --- */}
      <AnimatePresence>
        {selectedMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMenu(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#faf9f6] rounded-[2.5rem] shadow-2xl z-101 overflow-hidden border border-[#dcd0c0]"
            >
              <div className="p-6 border-b border-[#eaddca] flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#4a3f35]">{selectedMenu.name}</h3>
                  <p className="text-[10px] uppercase tracking-[3px] text-[#bc9a7c] font-bold">{selectedMenu.cuisine}</p>
                </div>
                <button onClick={() => setSelectedMenu(null)} className="p-2 hover:bg-[#f5f1ea] rounded-full transition-colors">
                  <svg width="24" height="24" fill="none" stroke="#4a3f35" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  {selectedMenu.fullMenu.map((dish, i) => (
                    <div key={i} className="flex justify-between items-baseline group">
                      <div className="flex-1 text-[#4a3f35]">
                        <p className="font-bold text-base">{dish.item}</p>
                        <span className="text-[10px] uppercase text-[#8c7e6d] font-semibold">{dish.category}</span>
                      </div>
                      <div className="flex-1 border-b border-dotted border-[#eaddca] mx-4 mb-1.5"></div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#4a3f35]">₹{dish.price}</p>
                        <p className="text-[10px] text-[#8c7e6d]/60 line-through font-medium">₹{Math.round(dish.price * 1.15)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 bg-[#f5f1ea] text-center">
                <p className="text-[11px] text-[#8c7e6d] font-bold uppercase tracking-widest leading-none">Prices exclusive of taxes</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiningComponent;