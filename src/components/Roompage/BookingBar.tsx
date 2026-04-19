import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence } from 'framer-motion';
import { GuestRoomModal } from './GuestRoomModal';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

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
  bookingDates, // Parent se aa rahi state
  setBookingDates // Parent ka setter function
}: BookingBarProps) => {
    const [showGuestModal, setShowGuestModal] = useState(false);

    return (
        <div className="sticky top-0 z-40 w-full bg-[#f5f1ea] border-b border-[#eaddca]/50 py-4 px-6 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                
                {/* --- DATE PICKER SECTION --- */}
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#eaddca] shadow-inner">
                    <span className="text-[#bc9a7c] text-[10px] uppercase font-bold px-2">Dates</span>
                    <DatePicker
                        selected={bookingDates.startDate} // LOCAL NAI, PARENT USE KARO
                        onChange={(date: Date | null) => {
                          if(date) setBookingDates(prev => ({ ...prev, startDate: date }));
                        }}
                        selectsStart
                        startDate={bookingDates.startDate}
                        endDate={bookingDates.endDate}
                        dateFormat="dd MMM yyyy"
                        className="bg-transparent text-[#4a3f35] text-sm outline-none w-28 cursor-pointer font-medium"
                        placeholderText="Check In"
                    />
                    <span className="text-[#eaddca]">|</span>
                    <DatePicker
                        selected={bookingDates.endDate} // LOCAL NAI, PARENT USE KARO
                        onChange={(date: Date | null) => {
                          if(date) setBookingDates(prev => ({ ...prev, endDate: date }));
                        }}
                        selectsEnd
                        startDate={bookingDates.startDate}
                        endDate={bookingDates.endDate}
                        minDate={bookingDates.startDate}
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
                            <span className="text-[#bc9a7c] text-[10px] uppercase font-bold block">Accommodation</span>
                            <span className="text-[#4a3f35] text-sm font-medium">
                                {rooms.length} Room, {rooms.reduce((a, b) => a + b.adults, 0)} Adults
                            </span>
                        </div>
                        <i className={`transition-transform text-[#bc9a7c] ${showGuestModal ? 'rotate-180' : ''}`}>▼</i>
                    </div>

                    <AnimatePresence>
                        {showGuestModal && (
                            <GuestRoomModal rooms={rooms} setRooms={setRooms} />
                        )}
                    </AnimatePresence>
                </div>

                <button className="bg-[#4a3f35] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#bc9a7c] transition-all shadow-md active:scale-95">
                    Check Availability
                </button>
            </div>
        </div>
    );
};