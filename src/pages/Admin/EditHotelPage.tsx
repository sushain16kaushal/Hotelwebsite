import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditHotelPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const getHotel = async () => {
            try {
                const res = await axios.get(`https://hotelapp-tiof.onrender.com/api/hotel/${id}`);
                setHotel(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        getHotel();
    }, [id]);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`https://hotelapp-tiof.onrender.com/api/update-prices/${hotel._id}`,
                { roomCategories: hotel.roomCategories },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Shimla Database Updated! 🏔️✨");
            window.location.href = '/admin/dashboard';
        } catch (err: any) {
            console.error("Update Error:", err.response?.data);
            alert("Update Failed!");
            setIsUpdating(false);
        }
    };

    const updatePrice = (catIdx: number, optIdx: number, val: number) => {
        const updated = { ...hotel };
        updated.roomCategories[catIdx].options[optIdx].pricePerNight = val;
        setHotel(updated);
    };

    // Features ko update karne wala logic
    const handleFeatureChange = (categoryIndex: number, optionIndex: number, newFeaturesArray: string[]) => {
        const updated = { ...hotel };
        updated.roomCategories[categoryIndex].options[optionIndex].features = newFeaturesArray;
        setHotel(updated);
    };

    if (loading) return <div className="h-screen bg-[#121212] flex items-center justify-center text-[#c5a059]">Loading Details...</div>;

    return (
        <div className="min-h-screen bg-[#121212] mt-3 text-white p-8 font-sans">
            {/* Header Area */}
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
                <div>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white mb-2 text-sm">← Back to Dashboard</button>
                    <h1 className="text-4xl font-serif text-[#c5a059]">{hotel?.hotelName}</h1>
                    <p className="text-gray-400 italic">{hotel?.address}</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C5A059] hover:bg-[#A38446] text-black'
                        }`}
                >
                    {isUpdating ? 'Updating...' : 'SAVE CHANGES'}
                </button>
            </div>

            <div className="max-w-5xl mx-auto grid gap-8">
                {hotel?.roomCategories.map((cat: any, catIdx: number) => (
                    <div key={catIdx} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between">
                            <span className="font-serif text-xl text-[#c5a059]">{cat.categoryName}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{cat.guests}</span>
                        </div>

                        <div className="p-6 space-y-6">
                            {cat.options.map((opt: any, optIdx: number) => (
                                <div key={optIdx} className="grid grid-cols-12 gap-6 items-start bg-black/20 p-5 rounded-xl border border-white/5">
                                    
                                    {/* Plan Type & Price */}
                                    <div className="col-span-3 space-y-3">
                                        <span className="text-sm font-bold uppercase text-gray-400 block">{opt.type}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#c5a059]">₹</span>
                                            <input
                                                type="number"
                                                value={opt.pricePerNight}
                                                onChange={(e) => updatePrice(catIdx, optIdx, Number(e.target.value))}
                                                className="bg-[#121212] border border-white/10 p-2 rounded w-full focus:border-[#c5a059] outline-none text-center"
                                            />
                                        </div>
                                    </div>

                                    {/* Features Section (Yahan hai Step 2) */}
                                    <div className="col-span-9">
                                        <p className="text-[10px] text-gray-600 uppercase mb-2 tracking-widest">Edit Plan Amenities</p>
                                        
                                        {/* Tag List */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {opt.features.map((f: string, fIdx: number) => (
                                                <span key={fIdx} className="flex items-center gap-2 text-[11px] bg-[#c5a059]/10 border border-[#c5a059]/20 px-3 py-1 rounded-full text-gray-300">
                                                    {f}
                                                    <button 
                                                        onClick={() => {
                                                            const newF = opt.features.filter((_: any, i: number) => i !== fIdx);
                                                            handleFeatureChange(catIdx, optIdx, newF);
                                                        }}
                                                        className="text-red-500 hover:text-red-400 font-bold ml-1"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Input to Add Feature */}
                                        <input
                                            type="text"
                                            placeholder="Type and press Enter to add feature..."
                                            className="w-full bg-transparent border-b border-white/10 text-sm py-1 focus:border-[#c5a059] outline-none transition-colors"
                                            onKeyDown={(e: any) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    handleFeatureChange(catIdx, optIdx, [...opt.features, e.target.value.trim()]);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditHotelPage;