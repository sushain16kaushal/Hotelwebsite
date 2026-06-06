import { motion } from "framer-motion";

export const GuestRoomModal = ({ rooms, setRooms }: any) => {
    
    // Limits definition as per your requirement
    const limits: any = {
        'Single Bed': { maxAdults: 2, maxChildren: 0 },
        'Double Bed': { maxAdults: 3, maxChildren: 2 },
        'Family Size': { maxAdults: 5, maxChildren: 3 },
    };

    const addRoom = () => {
        // Default naya room 'Double Bed' type ka hoga
        setRooms([...rooms, { id: Date.now(), adults: 1, children: 0, type: 'Double Bed' }]);
    };

    const updateCount = (index: number, field: 'adults' | 'children', val: number) => {
        const newRooms = [...rooms];
        const room = newRooms[index];
        const roomType = room.type || 'Double Bed'; // Fallback
        
        const currentCount = room[field];
        const newCount = currentCount + val;
        const typeLimits = limits[roomType];

        // Limits validation
        if (field === 'adults') {
            if (newCount >= 1 && newCount <= typeLimits.maxAdults) {
                newRooms[index].adults = newCount;
            }
        } else {
            if (newCount >= 0 && newCount <= typeLimits.maxChildren) {
                newRooms[index].children = newCount;
            }
        }
        setRooms(newRooms);
    };

    const handleTypeChange = (index: number, newType: string) => {
        const newRooms = [...rooms];
        const limit = limits[newType];

        // Type change hote hi agar guests limit se bahar hain toh unhe auto-adjust karo
        newRooms[index].type = newType;
        if (newRooms[index].adults > limit.maxAdults) newRooms[index].adults = limit.maxAdults;
        if (newRooms[index].children > limit.maxChildren) newRooms[index].children = limit.maxChildren;
        
        setRooms(newRooms);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 w-full min-w-[320px] bg-[#2a2a2a] border border-white/10 rounded-2xl p-6 shadow-3xl z-50"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="max-h-87.5 overflow-y-auto custom-scrollbar pr-2">
                {rooms.map((room: any, index: number) => (
                    <div key={room.id} className="mb-6 pb-4 border-b border-white/5 last:border-0">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-[#c5a059] uppercase tracking-widest text-[11px] font-bold">Room {index + 1}</h4>
                                {/* Room Type Selector */}
                                <select 
                                    value={room.type || 'Double Bed'}
                                    onChange={(e) => handleTypeChange(index, e.target.value)}
                                    className="bg-transparent text-gray-400 text-[10px] uppercase outline-none focus:text-[#c5a059] cursor-pointer"
                                >
                                    <option value="Single Bed" className="bg-[#2a2a2a]">Single Bed</option>
                                    <option value="Double Bed" className="bg-[#2a2a2a]">Double Bed</option>
                                    <option value="Family Size" className="bg-[#2a2a2a]">Family Size</option>
                                </select>
                            </div>
                            {index > 0 && (
                                <button onClick={() => setRooms(rooms.filter((_:any, i:any) => i !== index))} className="text-red-400/50 hover:text-red-400 text-[10px] uppercase transition-colors">Remove</button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Adult Counter */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-[10px] uppercase font-medium">Adults</span>
                                    <span className="text-[9px] text-gray-600 italic">Max {limits[room.type || 'Double Bed'].maxAdults}</span>
                                </div>
                                <div className="flex items-center justify-between bg-white/5 rounded-lg border border-white/10 p-2 group hover:border-[#c5a059]/30 transition-all">
                                    <button onClick={() => updateCount(index, 'adults', -1)} className="hover:text-[#c5a059] w-8 text-lg">-</button>
                                    <span className="text-sm font-bold text-white">{room.adults}</span>
                                    <button onClick={() => updateCount(index, 'adults', 1)} className="hover:text-[#c5a059] w-8 text-lg">+</button>
                                </div>
                            </div>

                            {/* Child Counter */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-[10px] uppercase font-medium">Children</span>
                                    <span className="text-[9px] text-gray-600 italic">Max {limits[room.type || 'Double Bed'].maxChildren}</span>
                                </div>
                                <div className="flex items-center justify-between bg-white/5 rounded-lg border border-white/10 p-2 group hover:border-[#c5a059]/30 transition-all">
                                    <button onClick={() => updateCount(index, 'children', -1)} className="hover:text-[#c5a059] w-8 text-lg">-</button>
                                    <span className="text-sm font-bold text-white">{room.children}</span>
                                    <button onClick={() => updateCount(index, 'children', 1)} className="hover:text-[#c5a059] w-8 text-lg">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={addRoom}
                className="w-full mt-4 border border-[#c5a059]/30 text-[#c5a059] py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-[#c5a059]/10 transition-all active:scale-[0.98]"
            >
                + Add Another Room
            </button>
        </motion.div>
    );
};