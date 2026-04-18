import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence } from 'framer-motion';
import { GuestRoomModal } from './GuestRoomModal';
export const BookingBar = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showGuestModal, setShowGuestModal] = useState(false);
    
    // Mock state for display
    const [rooms, setRooms] = useState([{ id: 1, adults: 1, children: 0 }]);

    return (
        <div className="sticky top-0 z-40 w-full bg-[#1c1c1c] border-b border-white/10 py-4 px-6 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                
                {/* Date Picker Section */}
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[#c5a059] text-[10px] uppercase font-bold px-2">Dates</span>
                    <DatePicker
                        selected={startDate}
                        onChange={(date:unknown) => setStartDate(date as Date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="bg-transparent text-white text-sm outline-none w-24 cursor-pointer"
                        placeholderText="Check In"
                    />
                    <span className="text-gray-600">|</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date:unknown) => setEndDate(date as Date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="bg-transparent text-white text-sm outline-none w-24 cursor-pointer"
                        placeholderText="Check Out"
                    />
                </div>

                {/* Guest & Room Selector */}
                <div 
                    className="relative flex-1 min-w-50 cursor-pointer"
                    onClick={() => setShowGuestModal(!showGuestModal)}
                >
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                            <span className="text-[#c5a059] text-[10px] uppercase font-bold block">Accommodation</span>
                            <span className="text-white text-sm">{rooms.length} Room, {rooms.reduce((a, b) => a + b.adults, 0)} Adults</span>
                        </div>
                        <i className={`transition-transform ${showGuestModal ? 'rotate-180' : ''}`}>▼</i>
                    </div>

                    {/* Guest Modal Call */}
                    <AnimatePresence>
                        {showGuestModal && (
                            <GuestRoomModal rooms={rooms} setRooms={setRooms} />
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Button */}
                <button className="bg-[#c5a059] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#d4b57a] transition-all">
                    Check Availability
                </button>
            </div>
        </div>
    );
};