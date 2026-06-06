import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../store/store';
import { removeDiningBooking, removeRoomBooking, removeOfferBooking } from '../store/bookingSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
const BookingPage = () => {
  const { roomBookings, diningBookings, offerBookings } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewingDetails, setViewingDetails] = useState<any>(null);

  // --- 1. DYNAMIC COMBINED CALCULATIONS FOR ORDER SUMMARY ---
  const roomsSubtotal = roomBookings.reduce((acc, item) => acc + (item.price || 0), 0);
 
// Dining cost based on table count (1500 per table)
  const diningSubtotal = diningBookings.reduce((acc, item) => {
    const tableCount = item.tables || 1; 
    return acc + (tableCount * 1500);
  }, 0);
  const offersSubtotal = offerBookings.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  const overallSubtotal = roomsSubtotal + diningSubtotal + offersSubtotal;
  
  // Luxury Slab Rule: If subtotal > 7500, GST is 18%, else 12%
  const gstRate = overallSubtotal > 7500 ? 0.18 : 0.12;
  const totalGST = overallSubtotal * gstRate;
  const serviceCharge = overallSubtotal * 0.05;
  const grandTotal = overallSubtotal + totalGST + serviceCharge;

  const handleProceedToPayment = () => {
    if (overallSubtotal === 0) {
      toast.error("Your experience itinerary is empty!");
      return;
    }
    toast.loading("Initiating secure checkout for Euphoria, Shimla...", { duration: 2000 });
    
    // Yahan aap apna backend payment processing link map kar sakte ho future mein
    setTimeout(() => {
      toast.success("Redirecting to payment gateway...");
    }, 2000);
  };

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
// Component ke andar:
const groupedDining = useMemo(() => {
  return diningBookings.reduce((acc: any, curr: any) => {
    const existing = acc.find((item: any) => item.name === curr.name);
    if (existing) {
      existing.tables = (existing.tables || 1) + (curr.tables || 1);
      // Optional: Agar aap saari original IDs rakhna chahte hain
      existing.allIds = [...(existing.allIds || [existing.id]), curr.id]; 
    } else {
      acc.push({ ...curr, allIds: [curr.id] });
    }
    return acc;
  }, []);
}, [diningBookings]);
  return (
    <div className="min-h-screen bg-[#f5f1ea] p-4 md:p-12 pb-32 relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <span className="text-[10px] uppercase tracking-[5px] text-[#bc9a7c] font-bold">Review Your Selection</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4a3f35] mt-2">Booking Summary</h1>
        </header>

        {/* Outer Layout Grid to split items and Summary sticky block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT 2 COLUMNS: ALL ACTIVE SECTIONS */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* --- ROOMS SECTION --- */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-sm font-bold text-[#4a3f35] uppercase tracking-[3px]">Reserved Rooms</h2>
                <div className="h-px bg-[#eaddca] grow"></div>
                <span className="bg-[#bc9a7c] text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">{roomBookings.length}</span>
              </div>
              {roomBookings.length > 0 ? (
                <div className="grid gap-6">
                  <AnimatePresence mode='popLayout'>
                    {roomBookings.map((item) => (
                      <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="group bg-[#faf9f6] border border-[#dcd0c0] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-500">
                        <div className="w-full md:w-52 h-40 md:h-auto shrink-0 overflow-hidden">
                          <img src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-500,h-400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div className="p-6 flex flex-col justify-between grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] bg-[#4a3f35] text-white px-2 py-0.5 rounded-full uppercase tracking-widest mb-1.5 inline-block">{item.plan || "EP Plan"}</span>
                              <p className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-widest">{item.roomCategory}</p>
                              <h3 className="text-xl font-serif font-bold text-[#4a3f35]">{item.hotelName}</h3>
                              {item.nights && (
                                <p className="text-[11px] text-[#8c7e6d] mt-1">Duration: <span className="font-bold text-[#bc9a7c]">{item.nights} Night(s)</span></p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-medium text-[#4a3f35]">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center pt-4 border-t border-[#eaddca]/40">
                            <div className="flex gap-4">
                              <button onClick={() => dispatch(removeRoomBooking(item.id))} className="text-[10px] font-bold text-red-400 uppercase tracking-widest cursor-pointer hover:text-red-600">Remove</button>
                              <button onClick={() => setViewingDetails(item)} className="text-[10px] font-bold text-[#8c7e6d] uppercase tracking-widest cursor-pointer hover:text-[#4a3f35]">Details</button>
                            </div>
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
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-sm font-bold text-[#4a3f35] uppercase tracking-[3px]">Table Reservations</h2>
                <div className="h-px bg-[#eaddca] grow"></div>
                <span className="bg-[#bc9a7c] text-white text-[10px] px-3 py-1 rounded-full font-bold">{diningBookings.length}</span>
              </div>
              {groupedDining.length > 0 ? (
                <div className="grid gap-6">
                  <AnimatePresence mode='popLayout'>
                    {groupedDining.map((item:any) => (
                      <motion.div layout key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.4 }} className="group relative bg-[#faf9f6] border border-[#dcd0c0] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-500">
                        <div className="w-full md:w-52 h-40 md:h-auto shrink-0 overflow-hidden">
                          <img src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-500,h-400,fo-auto`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="p-6 flex flex-col justify-between grow">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] uppercase tracking-widest text-[#bc9a7c] font-bold">{item.cuisine}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#eaddca]"></span>
                                <span className="text-[10px] uppercase tracking-widest text-[#8c7e6d] font-bold">Table Slot</span>
                              </div>
                              <h3 className="text-xl font-serif font-bold text-[#4a3f35]">{item.name}</h3>
                              <p className="text-[11px] text-[#8c7e6d] mt-1 line-clamp-1 italic">{item.address}</p>
                            </div>
                            <div className="bg-[#4a3f35]/5 px-4 py-2 rounded-2xl border border-[#4a3f35]/10 text-right">
                              <p className="text-[8px] uppercase text-[#bc9a7c] font-extrabold tracking-tighter">ID</p>
                              <p className="text-[10px] font-bold text-[#4a3f35] font-mono">#EPH-{item.id.toString().slice(-4)}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#eaddca]/40">
                            <button onClick={() => item.allIds.forEach((id: any) => dispatch(removeDiningBooking(id)))} className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-1.5">
                              Cancel All ({item.tables} Tables)
                            </button>
              {/* Add Time and Tables display */}
 {/* PRICE DISPLAY SECTION */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#8c7e6d] font-bold">
                {item.tables} Table(s)
              </span>
              <span className="text-sm font-bold text-[#4a3f35]">
                {/* 1500 is the rate per table */}
                ₹{( (item.tables || 1) ).toLocaleString('en-IN')}
              </span>
            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : <EmptyState title="No Tables Booked" type="dining" />}
            </section>

            {/* --- SPECIAL OFFERS SECTION --- */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-sm font-bold text-[#4a3f35] uppercase tracking-[3px]">Special Packages</h2>
                <div className="h-px bg-[#eaddca] grow"></div>
                <span className="bg-amber-700 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">{offerBookings.length}</span>
              </div>
              {offerBookings.length > 0 ? (
                <div className="grid gap-6">
                  <AnimatePresence mode='popLayout'>
                    {offerBookings.map((offer) => (
                      <motion.div layout key={offer.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 100 }} className="group bg-[#faf9f6] border border-[#dcd0c0] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-500">
                        <div className="w-full md:w-52 h-40 md:h-auto shrink-0 overflow-hidden">
                          <img src={`https://ik.imagekit.io/y4ytihgqk/${offer.image}?tr=w-500,h-400`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={offer.title} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Experience'; }} />
                        </div>
                        <div className="p-6 flex flex-col justify-between grow">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[9px] uppercase tracking-[2px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Special Experience</span>
                              <h3 className="text-xl font-serif font-bold text-[#4a3f35] mt-1">{offer.title}</h3>
                              <p className="text-[11px] text-[#8c7e6d] mt-1 line-clamp-2 italic">{offer.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#4a3f35]">₹{offer.price}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center pt-4 border-t border-[#eaddca]/40">
                            <button onClick={() => dispatch(removeOfferBooking(offer.id))} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 cursor-pointer">
                              Remove Package
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

          {/* --- RIGHT COLUMN: STICKY DYNAMIC MASTER CART BILL DETAILS --- */}
          <div className="bg-[#4a3f35] text-white p-8 rounded-[35px] shadow-2xl h-fit lg:sticky lg:top-24 border border-[#bc9a7c]/20">
            <h3 className="text-xl font-serif mb-6 border-b border-white/10 pb-4 italic text-[#bc9a7c] tracking-wider">Itinerary Bill Details</h3>
            
            <div className="space-y-4 text-xs font-light">
              <div className="flex justify-between">
                <span className="opacity-70">Rooms Segment Subtotal</span>
                <span className="font-mono">₹{roomsSubtotal.toLocaleString('en-IN')}</span>
              </div>
              
          {diningSubtotal > 0 && (
  <div className="flex justify-between">
    <span className="opacity-70">
      Dining 
      <span className="ml-1 text-[9px] bg-white/10 px-1.5 py-0.5 rounded">
        ({diningBookings.reduce((sum, item) => sum + (item.tables || 1), 0)} Tables)
      </span>
    </span>
    <span className="font-mono">₹{diningSubtotal.toLocaleString('en-IN')}</span>
  </div>
)}

              {offersSubtotal > 0 && (
                <div className="flex justify-between">
                  <span className="opacity-70">Experiences & Packages</span>
                  <span className="font-mono">₹{offersSubtotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="h-px bg-white/10 my-2"></div>

              <div className="flex justify-between text-[#bc9a7c]">
                <span>Base Subtotal</span>
                <span className="font-mono font-medium">₹{overallSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-70">Luxury GST & Hotel Taxes ({Math.round(gstRate * 100)}%)</span>
                <span className="font-mono">₹{Math.round(totalGST).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="opacity-70">Resort Service Charge (5%)</span>
                <span className="font-mono">₹{Math.round(serviceCharge).toLocaleString('en-IN')}</span>
              </div>
              
              {/* Grand Total Execution */}
              <div className="pt-6 mt-6 border-t border-white/20 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">Total Amount Payable</span>
                <span className="text-3xl font-serif text-[#bc9a7c] font-bold">
                  ₹{Math.round(grandTotal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleProceedToPayment}
              disabled={overallSubtotal === 0}
              className={`w-full mt-8 py-4 rounded-2xl font-bold uppercase tracking-[3px] text-[11px] transition-all shadow-lg active:scale-95 text-center ${
                overallSubtotal === 0 
                ? "bg-white/10 text-white/40 cursor-not-allowed" 
                : "bg-[#bc9a7c] text-white hover:bg-white hover:text-[#4a3f35] cursor-pointer"
              }`}
            >
              Proceed With Payment Securely
            </button>
          </div>

        </div>
      </div>

      {/* --- DETAILS MODAL WINDOW --- */}
      <AnimatePresence>
        {viewingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                    <li className="flex items-center gap-2"><span className="text-[#bc9a7c]">✓</span> {viewingDetails.plan || "Selected Plan Inclusions"}</li>
                    <li className="flex items-center gap-2"><span className="text-[#bc9a7c]">✓</span> Access to Euphoria Heritage Club & Wi-Fi</li>
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