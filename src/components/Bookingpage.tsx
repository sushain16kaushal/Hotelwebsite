
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../store/store';
import { removeDiningBooking, removeRoomBooking } from '../store/bookingSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { removeOfferBooking } from '../store/bookingSlice';
import toast from 'react-hot-toast';
const BookingPage = () => {
  const { roomBookings, diningBookings,offerBookings } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewingDetails, setViewingDetails] = useState<any>(null);

  const EmptyState = ({ title, type }: { title: string, type: 'room' | 'dining' }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 border-2 border-dashed border-[#eaddca] rounded-[3rem] py-16 px-6 text-center"
    >
      <div className="w-16 h-16 bg-[#f5f1ea] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#eaddca]">
        {type === 'room' ? (
          <svg className="w-8 h-8 text-[#bc9a7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        ) : (
          <svg className="w-8 h-8 text-[#bc9a7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.586.477 5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        )}
      </div>
      <h3 className="text-xl font-serif font-bold text-[#4a3f35] mb-2">{title}</h3>
      <p className="text-[#8c7e6d] text-sm mb-6 max-w-xs mx-auto">Your Shimla escape is just a few clicks away.</p>
      <button onClick={() => navigate(type === 'room' ? '/room' : '/Dining')} className="text-[11px] font-bold text-[#bc9a7c] uppercase tracking-widest hover:underline cursor-pointer">
        Browse {type === 'room' ? 'Rooms' : 'Restaurants'} →
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#f5f1ea] p-4 md:p-12 pb-32 relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <span className="text-[10px] uppercase tracking-[5px] text-[#bc9a7c] font-bold">Review Your Selection</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4a3f35] mt-2">Booking Summary</h1>
        </header>

        <div className="space-y-20">
          {/* --- ROOMS SECTION --- */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xl font-bold text-[#4a3f35] uppercase tracking-[3px]">Reserved Rooms</h2>
              <div className="h-px bg-[#eaddca] grow"></div>
              <span className="bg-[#bc9a7c] text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">{roomBookings.length}</span>
            </div>
            {roomBookings.length > 0 ? (
              <div className="grid gap-6">
                <AnimatePresence mode='popLayout'>
                  {roomBookings.map((item) => (
                    <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="group bg-[#faf9f6] border border-[#dcd0c0] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
                        <img src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-600,h-400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      </div>
                      <div className="p-8 flex flex-col justify-between grow">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-widest">{item.roomCategory}</p>
                            <h3 className="text-2xl font-serif font-bold text-[#4a3f35]">{item.hotelName}</h3>
                          </div>
                          <div className="mt-4 md:mt-0 md:text-right">
                            <p className="text-2xl font-medium text-[#4a3f35]">₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-[#eaddca]/40">
                          <div className="flex gap-6">
                            <button onClick={() => dispatch(removeRoomBooking(item.id))} className="text-[10px] font-bold text-red-400 uppercase tracking-widest cursor-pointer hover:text-red-600">Remove</button>
                            <button onClick={() => setViewingDetails(item)} className="text-[10px] font-bold text-[#8c7e6d] uppercase tracking-widest cursor-pointer hover:text-[#4a3f35]">Details</button>
                          </div>
                          <button className="px-8 py-3 bg-[#4a3f35] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#bc9a7c]">Pay Now</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : <EmptyState title="No Rooms Reserved" type="room" />}
          </section>

          {/* --- DINING SECTION --- */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xl font-bold text-[#4a3f35] uppercase tracking-[3px]">Table Reservations</h2>
              <div className="h-px bg-[#eaddca] grow"></div>
              <span className="bg-[#bc9a7c] text-white text-[10px] px-3 py-1 rounded-full font-bold">{diningBookings.length}</span>
            </div>
            {diningBookings.length > 0 ? (
              <div className="grid gap-6">
                <AnimatePresence mode='popLayout'>
                  {diningBookings.map((item) => (
                    <motion.div layout key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.4 }} className="group relative bg-[#faf9f6] border border-[#dcd0c0] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
                        <img src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-600,h-400,fo-auto`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <div className="p-8 flex flex-col justify-between grow">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] uppercase tracking-widest text-[#bc9a7c] font-bold">{item.cuisine}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#eaddca]"></span>
                              <span className="text-[10px] uppercase tracking-widest text-[#8c7e6d] font-bold">Confirmed Table</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#4a3f35]">{item.name}</h3>
                            <p className="text-[11px] text-[#8c7e6d] mt-2 italic flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#bc9a7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                              {item.address}
                            </p>
                          </div>
                          <div className="bg-[#4a3f35]/5 px-5 py-2.5 rounded-2xl border border-[#4a3f35]/10">
                            <p className="text-[9px] uppercase text-[#bc9a7c] font-extrabold text-center tracking-tighter">Booking ID</p>
                            <p className="text-[11px] font-bold text-[#4a3f35] text-center font-mono">#EPH-{item.id.toString().slice(-4)}</p>
                          </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#eaddca]/40">
                          <button onClick={() => dispatch(removeDiningBooking(item.id))} className="text-[11px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest cursor-pointer group/btn flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-400 group-hover/btn:bg-red-600"></span>Cancel Reservation
                          </button>
                          <button className="px-10 py-3 bg-[#4a3f35] text-white rounded-xl text-[10px] font-bold uppercase tracking-[2px] hover:bg-[#bc9a7c] transition-all shadow-lg active:scale-95">Confirm & Finalize</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : <EmptyState title="No Tables Booked" type="dining" />}
          </section>
          {/* --- SPECIAL OFFERS RESERVATIONS --- */}
<section>
  <div className="flex items-center gap-4 mb-10">
    <h2 className="text-xl font-bold text-[#4a3f35] uppercase tracking-[3px]">Special Packages</h2>
    <div className="h-[1px] bg-[#eaddca] grow"></div>
    <span className="bg-amber-700 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">
      {offerBookings.length}
    </span>
  </div>

  {offerBookings.length > 0 ? (
    <div className="grid gap-6">
      <AnimatePresence mode='popLayout'>
        {offerBookings.map((offer) => (
          <motion.div 
            layout 
            key={offer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className="group bg-[#faf9f6] border border-[#dcd0c0] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-500"
          >
            {/* Offer Image Thumbnail */}
            <div className="w-full md:w-48 h-40 md:h-auto shrink-0 overflow-hidden">
             <img 
  src={`https://ik.imagekit.io/y4ytihgqk/${offer.image}?tr=w-400,h-400`} 
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
  alt={offer.title} 
  /* Image load na ho toh fallback ke liye */
  onError={(e) => {
    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Experience';
  }}
/>
            </div>

            {/* Offer Details */}
            <div className="p-6 flex flex-col justify-between grow">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[2px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Special Experience</span>
                  <h3 className="text-xl font-serif font-bold text-[#4a3f35] mt-1">{offer.title}</h3>
                  <p className="text-[11px] text-[#8c7e6d] mt-2 line-clamp-2 italic">{offer.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#4a3f35]">₹{offer.price}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center pt-4 border-t border-[#eaddca]/40">
                <button 
                  onClick={() => {
                    dispatch(removeOfferBooking(offer.id));
                    
                  }}
                  className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors cursor-pointer"
                >
                  Remove Package
                </button>
                
                <button 
                  onClick={() => toast.success(`Proceeding to pay for ${offer.title}`)}
                  className="px-6 py-2.5 bg-amber-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#4a3f35] transition-all shadow-md active:scale-95"
                >
                  Pay For Package
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  ) : (
    <div className="text-center py-10 bg-white/30 rounded-4xl border-2 border-dashed border-[#eaddca]">
       <p className="text-[#8c7e6d] italic text-sm">No special experiences claimed yet.</p>
    </div>
  )}
</section>
        </div>
      </div>

      {/* --- RE-ADDED MODAL WINDOW --- */}
      <AnimatePresence>
        {viewingDetails && (
          <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingDetails(null)} className="absolute inset-0 bg-[#4a3f35]/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-[#faf9f6] rounded-[3rem] shadow-2xl overflow-hidden border border-[#dcd0c0]">
              <div className="relative h-56 bg-[#4a3f35]">
                <img src={`https://ik.imagekit.io/y4ytihgqk/${viewingDetails.image}?tr=w-800,h-500`} className="w-full h-full object-cover opacity-80" alt="" />
                <div className="absolute inset-0 bg-linear-to-t from-[#4a3f35] to-transparent"></div>
                <button onClick={() => setViewingDetails(null)} className="absolute top-6 right-6 bg-white/20 backdrop-blur-lg p-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer"><svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
                <div className="absolute bottom-6 left-8 text-white">
                  <p className="text-[10px] uppercase tracking-[3px] font-bold opacity-80 mb-1">Reservation Detail</p>
                  <h3 className="text-3xl font-serif font-bold">{viewingDetails.hotelName}</h3>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div><p className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-widest mb-1">Room Category</p><p className="text-sm font-bold text-[#4a3f35]">{viewingDetails.roomCategory}</p></div>
                  <div><p className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-widest mb-1">Status</p><p className="text-sm font-bold text-[#4a3f35]">Ready to Pay</p></div>
                </div>
                <div className="bg-[#f5f1ea] p-5 rounded-2xl border border-[#eaddca]/50">
                  <p className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-widest mb-3">Plan Inclusions</p>
                  <ul className="text-[11px] text-[#6d5f53] space-y-2.5 font-medium">
                    <li className="flex items-center gap-2"><span className="text-[#bc9a7c]">✓</span> Complimentary Breakfast & Wi-Fi</li>
                    <li className="flex items-center gap-2"><span className="text-[#bc9a7c]">✓</span> Access to Heritage Lounge</li>
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-[#eaddca]">
                  <div><p className="text-[10px] text-[#8c7e6d] font-bold uppercase tracking-tighter">Total Amount</p><p className="text-2xl font-serif font-bold text-[#4a3f35]">₹{viewingDetails.price.toLocaleString('en-IN')}</p></div>
                  <button onClick={() => setViewingDetails(null)} className="bg-[#4a3f35] text-white px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#bc9a7c] cursor-pointer">Got it</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default BookingPage;