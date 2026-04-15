import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditHotelPage = () => {
  const { id } = useParams(); // URL se Mongo _id uthayega
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHotel = async () => {
      try {
        const res = await axios.get(`https://hotelapp-tiof.onrender.com/api/hotel/${id}`);
        console.log(res.data)
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
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://hotelapp-tiof.onrender.com/api/update-prices/${hotel.hotelId}`, 
        { roomCategories: hotel.roomCategories },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Shimla Database Updated! 🏔️✨");
      navigate('/admin/dashboard');
    } catch (err) {
      alert("Update Failed!");
    }
  };

  // Dynamic input handler for nested price
  const updatePrice = (catIdx: number, optIdx: number, val: number) => {
    const updated = { ...hotel };
    updated.roomCategories[catIdx].options[optIdx].pricePerNight = val;
    setHotel(updated);
  };

  if (loading) return <div className="h-screen bg-[#121212] flex items-center justify-center text-[#c5a059]">Loading Details...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-sans">
      {/* Header Area */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white mb-2 text-sm">← Back to Dashboard</button>
          <h1 className="text-4xl font-serif text-[#c5a059]">{hotel?.hotelName}</h1>
          <p className="text-gray-400 italic">{hotel?.address}</p>
        </div>
        <button 
          onClick={handleUpdate}
          className="bg-[#c5a059] text-black px-10 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-105 transition"
        >
          SAVE CHANGES
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid gap-8">
        {hotel?.roomCategories.map((cat: any, catIdx: number) => (
          <div key={catIdx} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between">
              <span className="font-serif text-xl text-[#c5a059]">{cat.categoryName}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{cat.guests}</span>
            </div>

            <div className="p-6 space-y-4">
              {cat.options.map((opt: any, optIdx: number) => (
                <div key={optIdx} className="grid grid-cols-12 gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="col-span-3">
                    <span className="text-sm font-bold uppercase text-gray-400">{opt.type}</span>
                  </div>
                  
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-[#c5a059]">₹</span>
                    <input 
                      type="number"
                      value={opt.pricePerNight}
                      onChange={(e) => updatePrice(catIdx, optIdx, Number(e.target.value))}
                      className="bg-[#121212] border border-white/10 p-2 rounded w-full focus:border-[#c5a059] outline-none text-center"
                    />
                  </div>

                  <div className="col-span-6">
                    <p className="text-[10px] text-gray-600 uppercase mb-1">Features Summary</p>
                    <div className="flex flex-wrap gap-2">
                      {opt.features.map((f: string, i: number) => (
                        <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                          {f}
                        </span>
                      ))}
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