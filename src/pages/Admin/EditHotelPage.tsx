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
if (loading) return (
        <div className="h-screen bg-[#f5f1ea] flex flex-col items-center justify-center text-[#4a3f35] font-serif">
            <div className="text-2xl italic animate-pulse">Loading Details...</div>
            <div className="text-[10px] uppercase tracking-[3px] mt-2 opacity-60">Euphoria Shimla</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f1ea] text-[#4a3f35] p-4 md:p-10 font-sans">
            {/* Header Area */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="w-full md:w-auto">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-[#8c7e6d] hover:text-[#4a3f35] mb-4 transition-colors font-bold text-xs uppercase tracking-widest"
                    >
                        <span className="text-lg">←</span> Back to Dashboard
                    </button>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4a3f35] leading-tight">{hotel?.hotelName}</h1>
                    <p className="text-[#8c7e6d] italic mt-2 text-sm md:text-base">{hotel?.address}</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
                        isUpdating ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#4a3f35] text-white hover:bg-[#bc9a7c]'
                    }`}
                >
                    {isUpdating ? 'Updating...' : 'SAVE ALL CHANGES'}
                </button>
            </div>

            <div className="max-w-5xl mx-auto grid gap-8 md:gap-12">
                {hotel?.roomCategories.map((cat: any, catIdx: number) => (
                    <div key={catIdx} className="bg-white border border-[#eaddca] rounded-[35px] overflow-hidden shadow-xl shadow-[#4a3f35]/5">
                        
                        {/* Category Header - Soft Gradient or Solid Cream */}
                        <div className="bg-[#fcfaf7] p-6 border-b border-[#eaddca] flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-[2px] mb-1">Room Category</span>
                                <h2 className="font-serif text-2xl font-bold text-[#4a3f35]">{cat.categoryName}</h2>
                            </div>
                            <span className="text-[10px] bg-white border border-[#eaddca] px-4 py-2 rounded-full text-[#8c7e6d] uppercase font-bold tracking-widest">
                                {cat.guests}
                            </span>
                        </div>

                        <div className="p-6 md:p-8 space-y-8">
                            {cat.options.map((opt: any, optIdx: number) => (
                                <div key={optIdx} className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start bg-[#fcfaf7]/50 p-6 rounded-2xl border border-[#eaddca]/40">
                                    
                                    {/* Plan Type & Price (Left Side) */}
                                    <div className="w-full md:col-span-4 space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase text-[#bc9a7c] tracking-widest mb-3">{opt.type} Plan Price</span>
                                            <div className="relative flex items-center group">
                                                <span className="absolute left-4 text-[#bc9a7c] font-bold text-lg">₹</span>
                                                <input
                                                    type="number"
                                                    value={opt.pricePerNight}
                                                    onChange={(e) => updatePrice(catIdx, optIdx, Number(e.target.value))}
                                                    className="w-full bg-white border border-[#eaddca] p-4 pl-10 rounded-xl outline-none focus:border-[#bc9a7c] focus:ring-4 focus:ring-[#bc9a7c]/5 text-[#4a3f35] text-xl font-bold transition-all shadow-inner"
                                                />
                                            </div>
                                            <p className="text-[10px] text-[#8c7e6d] mt-2 italic px-1 text-center">Base rate per night</p>
                                        </div>
                                    </div>

                                    {/* Features Section (Right Side) */}
                                    <div className="w-full md:col-span-8">
                                        <span className="text-[10px] text-[#bc9a7c] uppercase mb-4 tracking-widest font-bold block">Edit Amenities List</span>
                                        
                                        {/* Tag List */}
                                        <div className="flex flex-wrap gap-2.5 mb-6">
                                            {opt.features.map((f: string, fIdx: number) => (
                                                <span key={fIdx} className="flex items-center gap-2 text-[11px] bg-white border border-[#eaddca] px-4 py-2 rounded-xl text-[#4a3f35] font-medium hover:border-[#bc9a7c] transition-all shadow-sm">
                                                    {f}
                                                    <button 
                                                        onClick={() => {
                                                            const newF = opt.features.filter((_: any, i: number) => i !== fIdx);
                                                            handleFeatureChange(catIdx, optIdx, newF);
                                                        }}
                                                        className="text-red-300 hover:text-red-500 font-bold ml-1 transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Input to Add Feature */}
                                        <div className="relative flex items-center gap-3">
                                            <input
                                                type="text"
                                                id={`input-${catIdx}-${optIdx}`}
                                                placeholder="Add a new amenity (e.g., Free Wi-Fi)..."
                                                className="flex-1 bg-white border border-[#eaddca] rounded-xl px-5 py-3.5 text-sm focus:border-[#bc9a7c] focus:ring-4 focus:ring-[#bc9a7c]/5 outline-none transition-all placeholder:text-[#8c7e6d]/40 shadow-inner"
                                                onKeyDown={(e: any) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        handleFeatureChange(catIdx, optIdx, [...opt.features, e.target.value.trim()]);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const inputEl = document.getElementById(`input-${catIdx}-${optIdx}`) as HTMLInputElement;
                                                    if (inputEl.value.trim()) {
                                                        handleFeatureChange(catIdx, optIdx, [...opt.features, inputEl.value.trim()]);
                                                        inputEl.value = '';
                                                    }
                                                }}
                                                className="bg-[#bc9a7c] text-white w-12 h-12 rounded-xl font-bold text-2xl flex items-center justify-center shadow-lg hover:bg-[#4a3f35] transition-all active:scale-90"
                                            >
                                                +
                                            </button>
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