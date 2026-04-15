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

    const handleFeatureChange = (categoryIndex: number, optionIndex: number, newFeaturesArray: string[]) => {
        const updated = { ...hotel };
        updated.roomCategories[categoryIndex].options[optionIndex].features = newFeaturesArray;
        setHotel(updated);
    };

    if (loading) return <div className="h-screen bg-[#121212] flex items-center justify-center text-[#c5a059]">Loading Details...</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8 font-sans">
            {/* Header Area */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="w-full md:w-auto">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white mb-2 text-sm">← Back to Dashboard</button>
                    <h1 className="text-2xl md:text-4xl font-serif text-[#c5a059] leading-tight">{hotel?.hotelName}</h1>
                    <p className="text-gray-400 italic text-sm md:text-base">{hotel?.address}</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold transition-all shadow-lg ${
                        isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C5A059] hover:bg-[#A38446] text-black'
                    }`}
                >
                    {isUpdating ? 'Updating...' : 'SAVE CHANGES'}
                </button>
            </div>

            <div className="max-w-5xl mx-auto grid gap-6 md:gap-8">
                {hotel?.roomCategories.map((cat: any, catIdx: number) => (
                    <div key={catIdx} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                        {/* Category Header */}
                        <div className="bg-white/5 p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-2">
                            <span className="font-serif text-lg md:text-xl text-[#c5a059]">{cat.categoryName}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">{cat.guests}</span>
                        </div>

                        <div className="p-4 md:p-6 space-y-6">
                            {cat.options.map((opt: any, optIdx: number) => (
                                <div key={optIdx} className="flex flex-col md:grid md:grid-cols-12 gap-6 items-start bg-black/20 p-4 md:p-5 rounded-xl border border-white/5">
                                    
                                    {/* Plan Type & Price (Left Side) */}
                                    <div className="w-full md:col-span-4 lg:col-span-3 space-y-3">
                                        <span className="text-xs font-bold uppercase text-[#c5a059]/70 tracking-widest block">{opt.type} Plan</span>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-[#c5a059] font-bold">₹</span>
                                            <input
                                                type="number"
                                                value={opt.pricePerNight}
                                                onChange={(e) => updatePrice(catIdx, optIdx, Number(e.target.value))}
                                                className="bg-[#121212] border border-white/10 p-2 pl-7 rounded-lg w-full focus:border-[#c5a059] outline-none text-left md:text-center text-lg font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Features Section (Right Side) */}
                                    <div className="w-full md:col-span-8 lg:col-span-9">
                                        <p className="text-[10px] text-gray-600 uppercase mb-3 tracking-widest font-bold">Edit Amenities</p>
                                        
                                        {/* Tag List */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {opt.features.map((f: string, fIdx: number) => (
                                                <span key={fIdx} className="flex items-center gap-2 text-[10px] md:text-[11px] bg-[#c5a059]/5 border border-[#c5a059]/20 px-3 py-1.5 rounded-full text-gray-300 hover:border-[#c5a059] transition-all">
                                                    {f}
                                                    <button 
                                                        onClick={() => {
                                                            const newF = opt.features.filter((_: any, i: number) => i !== fIdx);
                                                            handleFeatureChange(catIdx, optIdx, newF);
                                                        }}
                                                        className="text-red-500/50 hover:text-red-500 font-bold ml-1 text-xs"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Input to Add Feature */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Add feature and press Enter..."
                                                className="w-full bg-transparent border-b border-white/10 text-sm py-2 focus:border-[#c5a059] outline-none transition-all placeholder:text-gray-700"
                                                onKeyDown={(e: any) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        handleFeatureChange(catIdx, optIdx, [...opt.features, e.target.value.trim()]);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
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