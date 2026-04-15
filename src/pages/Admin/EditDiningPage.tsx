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

    if (loading) return <div className="h-screen bg-[#121212] flex items-center justify-center text-[#c5a059]">Fetching Menu...</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-gray-500 mb-4">← Back</button>
                <h1 className="text-3xl font-serif text-[#c5a059] mb-2">{venue.name}</h1>
                <p className="text-gray-400 mb-10 text-sm">Update prices and dishes in the full menu.</p>

                {/* ADD NEW ITEM SECTION */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="col-span-1">
                        <label className="text-[10px] uppercase text-gray-500 block mb-2">Item Name</label>
                        <input 
                            type="text" value={newItem.item}
                            onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 p-2 rounded outline-none focus:border-[#c5a059]"
                            placeholder="e.g. Siddu"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-[10px] uppercase text-gray-500 block mb-2">Price (₹)</label>
                        <input 
                            type="number" value={newItem.price}
                            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 p-2 rounded outline-none focus:border-[#c5a059]"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-[10px] uppercase text-gray-500 block mb-2">Category</label>
                        <select 
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 p-2 rounded outline-none"
                        >
                            <option value="Himachali Special">Himachali Special</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Desserts">Desserts</option>
                        </select>
                    </div>
                    <button onClick={handleAddItem} className="bg-[#c5a059] text-black font-bold py-2 rounded shadow-lg">+</button>
                </div>

                {/* MENU LIST */}
                <div className="space-y-3">
                    {venue.fullMenu.map((m: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5">
                            <div>
                                <h4 className="font-bold">{m.item}</h4>
                                <p className="text-xs text-gray-500">{m.category} • ₹{m.price}</p>
                            </div>
                            <button onClick={() => handleRemoveItem(idx)} className="text-red-500 text-xl font-bold px-2">✕</button>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="w-full mt-10 bg-[#c5a059] text-black py-4 rounded-xl font-bold uppercase tracking-widest shadow-2xl"
                >
                    {isUpdating ? 'Saving Menu...' : 'Save Full Menu'}
                </button>
            </div>
        </div>
    );
};

export default EditDiningPage;