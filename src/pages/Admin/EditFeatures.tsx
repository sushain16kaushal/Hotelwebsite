import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditFeatures = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<any>(null);
    const [newFeature, setNewFeature] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. Data Fetch Karo
    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await axios.get(`https://hotelapp-tiof.onrender.com/api/hotel/${id}`);
                setHotel(res.data);
            } catch (err) {
                console.error("Fetch error", err);
            }
        };
        fetchHotel();
    }, [id]);

    // 2. Local State mein Feature Add Karo
    const handleAddFeature = () => {
        if (newFeature.trim() && !hotel.features.includes(newFeature)) {
            setHotel({
                ...hotel,
                features: [...hotel.features, newFeature.trim()]
            });
            setNewFeature("");
        }
    };

    // 3. Local State se Remove Karo
    const handleRemoveFeature = (text: string) => {
        setHotel({
            ...hotel,
            features: hotel.features.filter((f: string) => f !== text)
        });
    };

    // 4. Final Save to Database
    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`https://hotelapp-tiof.onrender.com/api/update-features/${id}`, 
                { features: hotel.features },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Features Updated Successfully! 🏔️");
            window.location.href = '/admin/dashboard';
        } catch (err) {
            alert("Update Failed!");
            setIsUpdating(false);
        }
    };

    if (!hotel) return <div className="p-10 text-center text-white">Loading Hotel Data...</div>;

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 text-white font-sans">
            <div className="max-w-2xl mx-auto bg-[#242424] p-8 rounded-xl shadow-2xl border border-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-[#C5A059]">Edit Amenities - {hotel.hotelName}</h2>

                {/* Input Section */}
                <div className="flex gap-2 mb-8">
                    <input 
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add new (e.g. Free WiFi, Parking)"
                        className="flex-1 bg-[#2d2d2d] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-[#C5A059]"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    />
                    <button 
                        onClick={handleAddFeature}
                        className="bg-[#C5A059] px-6 py-3 rounded-lg font-bold hover:bg-[#a38446] transition-all"
                    >
                        ADD
                    </button>
                </div>

                {/* Tags Section */}
                <div className="mb-10">
                    <p className="text-gray-400 mb-4 text-sm uppercase tracking-widest font-semibold">Current Features:</p>
                    <div className="flex flex-wrap gap-3">
                        {hotel.features.map((feature: string, index: number) => (
                            <div 
                                key={index} 
                                className="flex items-center gap-2 bg-[#2d2d2d] border border-[#C5A059]/30 px-4 py-2 rounded-full group hover:border-[#C5A059] transition-all"
                            >
                                <span className="text-gray-200">{feature}</span>
                                <button 
                                    onClick={() => handleRemoveFeature(feature)}
                                    className="text-gray-500 hover:text-red-500 font-bold ml-1 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Buttons */}
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex-1 border border-gray-600 p-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        CANCEL
                    </button>
                    <button 
                        disabled={isUpdating}
                        onClick={handleSave}
                        className={`flex-2 p-4 rounded-xl font-bold shadow-lg transition-all ${
                            isUpdating ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#C5A059] hover:bg-[#a38446] text-[#1a1a1a]'
                        }`}
                    >
                        {isUpdating ? 'SAVING TO DATABASE...' : 'SAVE ALL FEATURES'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFeatures;