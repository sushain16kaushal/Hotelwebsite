import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditDiningPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Naye item ke liye local state
    const [newItem, setNewItem] = useState({ item: '', price: '', category: 'Main Course' });

    useEffect(() => {
        const fetchDining = async () => {
            try {
                const res = await axios.get(`https://hotelapp-tiof.onrender.com/api/dining/${id}`);
                setVenue(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDining();
    }, [id]);

    const handleAddItem = () => {
        if (newItem.item && newItem.price) {
            const updatedMenu = [...venue.fullMenu, { ...newItem, price: Number(newItem.price) }];
            setVenue({ ...venue, fullMenu: updatedMenu });
            setNewItem({ item: '', price: '', category: 'Main Course' });
        }
    };

    const handleRemoveItem = (index: number) => {
        const updatedMenu = venue.fullMenu.filter((_: any, i: number) => i !== index);
        setVenue({ ...venue, fullMenu: updatedMenu });
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`https://hotelapp-tiof.onrender.com/api/update-dining/${id}`, 
                { fullMenu: venue.fullMenu },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Menu Updated Successfully! 🥘");
            navigate('/admin/dashboard');
        } catch (err) {
            alert("Update Failed!");
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-screen bg-[#f5f1ea] flex flex-col items-center justify-center text-[#4a3f35] font-serif">
            <div className="text-2xl italic animate-pulse">Fetching Menu...</div>
            <div className="text-[10px] uppercase tracking-[3px] mt-2 opacity-60">Euphoria Shimla</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f1ea] text-[#4a3f35] p-4 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Back Button matching theme */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-[#8c7e6d] hover:text-[#4a3f35] mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <span className="text-lg">←</span> Back to Dashboard
                </button>

                <header className="mb-10">
                    <h1 className="text-4xl font-serif font-bold text-[#4a3f35] mb-2">{venue.name}</h1>
                    <p className="text-[#8c7e6d] italic text-sm">Update prices and dishes in the professional dining menu.</p>
                </header>

                {/* ADD NEW ITEM SECTION - Refined White Card */}
                <div className="bg-white p-6 rounded-[25px] border border-[#eaddca] mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-xl shadow-[#4a3f35]/5">
                    <div className="col-span-1">
                        <label className="text-[10px] uppercase text-[#bc9a7c] font-bold block mb-2 tracking-widest">Item Name</label>
                        <input 
                            type="text" value={newItem.item}
                            onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                            className="w-full bg-[#fcfaf7] border border-[#eaddca] p-3 rounded-xl outline-none focus:border-[#bc9a7c] text-[#4a3f35] transition-all"
                            placeholder="e.g. Siddu"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-[10px] uppercase text-[#bc9a7c] font-bold block mb-2 tracking-widest">Price (₹)</label>
                        <input 
                            type="number" value={newItem.price}
                            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                            className="w-full bg-[#fcfaf7] border border-[#eaddca] p-3 rounded-xl outline-none focus:border-[#bc9a7c] text-[#4a3f35] transition-all"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-[10px] uppercase text-[#bc9a7c] font-bold block mb-2 tracking-widest">Category</label>
                        <select 
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            className="w-full bg-[#fcfaf7] border border-[#eaddca] p-3 rounded-xl outline-none focus:border-[#bc9a7c] text-[#4a3f35] cursor-pointer"
                        >
                            <option value="Himachali Special">Himachali Special</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Desserts">Desserts</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleAddItem} 
                        className="bg-[#4a3f35] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#bc9a7c] transition-all active:scale-95 text-xl"
                    >
                        +
                    </button>
                </div>

                {/* MENU LIST - Clean & Elegant */}
                <div className="space-y-4">
                    <h3 className="text-[10px] uppercase text-[#bc9a7c] font-bold tracking-[3px] mb-4">Current Menu Selection</h3>
                    {venue.fullMenu.map((m: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-[#eaddca]/60 hover:border-[#bc9a7c]/50 transition-all shadow-sm group">
                            <div>
                                <h4 className="font-serif text-lg font-bold text-[#4a3f35]">{m.item}</h4>
                                <p className="text-[11px] text-[#8c7e6d] font-medium uppercase tracking-wider mt-1">
                                    {m.category} <span className="mx-2 opacity-30">|</span> <span className="text-[#bc9a7c]">₹{m.price}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => handleRemoveItem(idx)} 
                                className="text-red-200 hover:text-red-500 transition-colors p-2 text-sm uppercase font-bold"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* SAVE BUTTON - Matching the Reserve button on Details page */}
                <button 
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="w-full mt-12 bg-[#4a3f35] text-white py-5 rounded-[20px] font-bold uppercase tracking-[3px] text-xs shadow-2xl hover:bg-[#bc9a7c] disabled:bg-gray-300 transition-all active:scale-[0.98]"
                >
                    {isUpdating ? 'Saving Menu Changes...' : 'Save Full Menu'}
                </button>
            </div>
        </div>
    );
};

export default EditDiningPage;