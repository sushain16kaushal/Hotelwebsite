import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence } from 'framer-motion';
import { GuestRoomModal } from './GuestRoomModal';
import type{ Dispatch,SetStateAction } from 'react';
interface BookingBarProps {
  rooms: any[];
  setRooms: Dispatch<SetStateAction<any[]>>;
  bookingDates: {
    startDate: Date;
    endDate: Date;
  };
  setBookingDates: Dispatch<SetStateAction<{
    startDate: Date;
    endDate: Date;
  }>>;
}
export const BookingBar = ({ 
  rooms, 
  setRooms,  
}: BookingBarProps) => {
    // Dates default range: Aaj se Kal tak
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [showGuestModal, setShowGuestModal] = useState(false);
    
  

    return (
        // --- MATCHING: Background ab Cream (#f5f1ea) hai, Black nahi ---
        <div className="sticky top-0 z-40 w-full bg-[#f5f1ea] border-b border-[#eaddca]/50 py-4 px-6 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                
                {/* --- DATE PICKER SECTION --- */}
                {/* Background ab White hai, borders matching cream se hain */}
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#eaddca] shadow-inner">
                    {/* Label color is matching #bc9a7c (Gold/Tan) */}
                    <span className="text-[#bc9a7c] text-[10px] uppercase font-bold px-2">Dates</span>
                    <DatePicker
                        selected={startDate}
                        onChange={(date:unknown) => setStartDate(date as Date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="dd MMM yyyy"
                        // Text color is now Dark Brown (#4a3f35)
                        className="bg-transparent text-[#4a3f35] text-sm outline-none w-28 cursor-pointer font-medium"
                        placeholderText="Check In"
                    />
                    <span className="text-[#eaddca]">|</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date:unknown) => setEndDate(date as Date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="dd MMM yyyy"
                        className="bg-transparent text-[#4a3f35] text-sm outline-none w-28 cursor-pointer font-medium"
                        placeholderText="Check Out"
                    />
                </div>

                {/* --- GUEST & ROOM SELECTOR --- */}
                <div 
                    className="relative flex-1 min-w-50 cursor-pointer"
                    onClick={() => setShowGuestModal(!showGuestModal)}
                >
                    <div className="bg-white p-3 rounded-xl border border-[#eaddca] flex justify-between items-center shadow-inner">
                        <div>
                            {/* Matching Gold/Tan #bc9a7c */}
                            <span className="text-[#bc9a7c] text-[10px] uppercase font-bold block">Accommodation</span>
                            {/* Matching Dark Brown #4a3f35 */}
                            <span className="text-[#4a3f35] text-sm font-medium">
                                {rooms.length} Room, {rooms.reduce((a, b) => a + b.adults, 0)} Adults
                            </span>
                        </div>
                        {/* Down Arrow color matching */}
                        <i className={`transition-transform text-[#bc9a7c] ${showGuestModal ? 'rotate-180' : ''}`}>▼</i>
                    </div>

                    {/* Guest Modal Call */}
                    <AnimatePresence>
                        {showGuestModal && (
                            <GuestRoomModal rooms={rooms} setRooms={setRooms} />
                        )}
                    </AnimatePresence>
                </div>

                {/* --- SEARCH BUTTON: Perfect Match --- */}
                {/* Background is Dark Brown (#4a3f35), Text is White */}
                <button className="bg-[#4a3f35] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#bc9a7c] transition-all shadow-md active:scale-95">
                    Check Availability
                </button>
            </div>
        </div>
    );
};