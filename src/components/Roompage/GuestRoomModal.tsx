import { motion } from "framer-motion";
export const GuestRoomModal = ({ rooms, setRooms }: any) => {
    const addRoom = () => {
        setRooms([...rooms, { id: rooms.length + 1, adults: 1, children: 0 }]);
    };

    const updateCount = (index: number, type: 'adults' | 'children', val: number) => {
        const newRooms = [...rooms];
        newRooms[index][type] = Math.max(0, newRooms[index][type] + val);
        setRooms(newRooms);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 w-full min-w-[320px] bg-[#2a2a2a] border border-white/10 rounded-2xl p-6 shadow-3xl z-50"
            onClick={(e) => e.stopPropagation()} // Modal click par band na ho
        >
            <div className="max-h-75 overflow-y-auto custom-scrollbar pr-2">
                {rooms.map((room: any, index: number) => (
                    <div key={room.id} className="mb-6 pb-4 border-b border-white/5 last:border-0">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[#c5a059] uppercase tracking-widest text-[11px] font-bold">Room {index + 1}</h4>
                            {index > 0 && (
                                <button onClick={() => setRooms(rooms.filter((_:any, i:any) => i !== index))} className="text-red-400 text-[10px] uppercase">Remove</button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Adult Counter */}
                            <div className="flex flex-col gap-2">
                                <span className="text-gray-400 text-[10px] uppercase">Adults</span>
                                <div className="flex items-center justify-between bg-white/5 rounded-lg border border-white/10 p-2">
                                    <button onClick={() => updateCount(index, 'adults', -1)} className="hover:text-[#c5a059] w-8">-</button>
                                    <span className="text-sm font-bold">{room.adults}</span>
                                    <button onClick={() => updateCount(index, 'adults', 1)} className="hover:text-[#c5a059] w-8">+</button>
                                </div>
                            </div>
                            {/* Child Counter */}
                            <div className="flex flex-col gap-2">
                                <span className="text-gray-400 text-[10px] uppercase">Children</span>
                                <div className="flex items-center justify-between bg-white/5 rounded-lg border border-white/10 p-2">
                                    <button onClick={() => updateCount(index, 'children', -1)} className="hover:text-[#c5a059] w-8">-</button>
                                    <span className="text-sm font-bold">{room.children}</span>
                                    <button onClick={() => updateCount(index, 'children', 1)} className="hover:text-[#c5a059] w-8">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={addRoom}
                className="w-full mt-4 border border-[#c5a059]/30 text-[#c5a059] py-2 rounded-lg text-[10px] uppercase tracking-tighter font-bold hover:bg-[#c5a059]/10 transition-all"
            >
                + Add Another Room
            </button>
        </motion.div>
    );
};