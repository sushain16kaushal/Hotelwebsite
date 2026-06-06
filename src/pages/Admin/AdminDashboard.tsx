import  { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';

// --- TYPES ---
interface Option {
  type: string;
  pricePerNight: number;
  features: string[];
}

interface RoomCategory {
  categoryName: string;
  options: Option[];
}

interface HotelData {
  _id?: string;
  hotelId: number;
  hotelName: string;
  address?: string;
  roomCategories: RoomCategory[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<{ hotels: HotelData[], dinings: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  // ADDED 'analytics' TAB
  const [activeTab, setActiveTab] = useState<'hotels' | 'dining' | 'analytics'>('hotels'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const res = await axios.get('https://hotelapp-tiof.onrender.com/api/all-content');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Data fetch failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.key]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleDeleteHotel = async (id: any, name: string) => {
    if (window.confirm(`Delete Hotel "${name}"?`)) {
      try {
        await axios.delete(`https://hotelapp-tiof.onrender.com/api/delete-hotel/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setData((prev: any) => ({ ...prev, hotels: prev.hotels.filter((h: any) => h._id !== id) }));
      } catch (err) { alert("Delete Failed"); }
    }
  };

  const handleDeleteDining = async (id: any, name: string) => {
    if (window.confirm(`Delete Dining Venue "${name}"?`)) {
      try {
        await axios.delete(`https://hotelapp-tiof.onrender.com/api/delete-dining/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setData((prev: any) => ({ ...prev, dinings: prev.dinings.filter((d: any) => d._id !== id) }));
      } catch (err) { alert("Delete Failed"); }
    }
  };

  // --- ANALYTICS DATA PREPARATION ---
  const analyticsData = useMemo(() => {
    if (!data?.hotels || data.hotels.length === 0) return [];

    return data.hotels.map((hotel) => {
      let minPrice = 0;
      let maxPrice = 0;
      let totalFeatures = 0;
      let roomOptionsCount = 0;

      hotel.roomCategories.forEach((cat) => {
        cat.options.forEach((opt) => {
          roomOptionsCount++;
          totalFeatures += opt.features.length;
          if (minPrice === 0 || opt.pricePerNight < minPrice) minPrice = opt.pricePerNight;
          if (opt.pricePerNight > maxPrice) maxPrice = opt.pricePerNight;
        });
      });

      return {
        name: hotel.hotelName.length > 15 ? hotel.hotelName.substring(0, 15) + '...' : hotel.hotelName,
        // Main Price Metrics
        minPrice,
        maxPrice,
        // Feature Metrics
        amenities: totalFeatures,
        optionVariety: roomOptionsCount,
      };
    });
  }, [data]);

  if (loading) return (
    <div className="bg-[#f5f1ea] text-[#4a3f35] h-screen flex flex-col justify-center items-center font-serif">
      <div className="text-3xl italic animate-pulse">Euphoria Admin</div>
      <div className="text-[10px] uppercase tracking-[4px] mt-4 opacity-50">Loading Insights...</div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f5f1ea] text-[#4a3f35] font-sans">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white p-4 flex justify-between items-center border-b border-[#eaddca] sticky top-0 z-50">
        <h2 className="text-[#bc9a7c] text-xl font-serif font-bold">Euphoria</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#4a3f35] text-2xl">☰</button>
      </header>

      {/* SIDEBAR - Soft White with Delicate Borders */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative md:translate-x-0 z-40
        w-64 h-full bg-white border-r border-[#eaddca] p-6 
        flex flex-col justify-between transition-transform duration-300 shadow-sm
      `}>
        <div>
          <h2 className="hidden md:block text-[#4a3f35] text-2xl font-serif mb-10 font-bold border-b border-[#f5f1ea] pb-4">
            Euphoria <span className="text-[#bc9a7c]">Admin</span>
          </h2>
          <nav className="space-y-3">
            <div 
              onClick={() => { setActiveTab('hotels'); setIsSidebarOpen(false); }}
              className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${activeTab === 'hotels' ? 'bg-[#4a3f35] text-white shadow-lg' : 'hover:bg-[#f5f1ea] text-[#8c7e6d]'}`}
            >
              🏨 Manage Hotels
            </div>
            <div 
              onClick={() => { setActiveTab('dining'); setIsSidebarOpen(false); }}
              className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${activeTab === 'dining' ? 'bg-[#4a3f35] text-white shadow-lg' : 'hover:bg-[#f5f1ea] text-[#8c7e6d]'}`}
            >
              🥘 Dining Venues
            </div>
            {/* NEW ANALYTICS TAB BUTTON */}
            <div 
              onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
              className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${activeTab === 'analytics' ? 'bg-[#4a3f35] text-white shadow-lg' : 'hover:bg-[#f5f1ea] text-[#8c7e6d]'}`}
            >
              📊 Analytics & Charts
            </div>
          </nav>
        </div>
        
        <button onClick={handleLogout} className="w-full p-4 border border-red-200 text-red-400 hover:bg-red-50 hover:text-white rounded-2xl transition-all text-[10px] font-bold uppercase tracking-[2px]">
          Logout Session 🔒
        </button>
      </aside>

      {/* MAIN CONTENT - Clean & Spacious */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4a3f35]">
            {activeTab === 'hotels' ? 'Hotel Properties' : activeTab === 'dining' ? 'Dining Venues' : 'Performance Analytics'}
          </h1>
          <div className="hidden sm:block text-[10px] text-[#bc9a7c] bg-white px-4 py-2 rounded-full border border-[#eaddca] font-bold uppercase tracking-[2px] shadow-sm">
            Shimla Central • {activeTab}
          </div>
        </div>

        {/* --- CONDITIONAL RENDERING BASED ON TAB --- */}
        
        {activeTab === 'analytics' ? (
            /* --- ANALYTICS CHARTS VIEW --- */
            <div className="space-y-10 animate-in fade-in duration-500">
                {analyticsData.length > 0 ? (
                    <>
                        {/* Chart 1: Price Comparison */}
                        <div className="bg-white p-8 rounded-[30px] border border-[#eaddca] shadow-xl">
                            <h2 className="text-xl font-serif font-bold text-[#4a3f35] mb-6">Price Range Comparison (INR)</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analyticsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eaddca" />
                                        <XAxis type="number" tick={{fill: '#4a3f35'}} />
                                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#4a3f35'}} />
                                        <Tooltip 
                                            cursor={{fill: '#f5f1ea'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="minPrice" name="Base Price" fill="#bc9a7c" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar dataKey="maxPrice" name="Peak Price" fill="#4a3f35" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 2: Features vs Options Count */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[30px] border border-[#eaddca] shadow-xl">
                                <h2 className="text-xl font-serif font-bold text-[#4a3f35] mb-6">Amenities Richness</h2>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analyticsData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaddca" />
                                            <XAxis dataKey="name" tick={{fill: '#4a3f35', fontSize: 10}} />
                                            <YAxis tick={{fill: '#4a3f35'}} />
                                            <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                            <Bar dataKey="amenities" name="Total Amenities" fill="#bc9a7c" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[30px] border border-[#eaddca] shadow-xl">
                                <h2 className="text-xl font-serif font-bold text-[#4a3f35] mb-6">Room Variety Options</h2>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analyticsData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaddca" />
                                            <XAxis dataKey="name" tick={{fill: '#4a3f35', fontSize: 10}} />
                                            <YAxis tick={{fill: '#4a3f35'}} />
                                            <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                            <Line type="monotone" dataKey="optionVariety" stroke="#4a3f35" strokeWidth={3} dot={{fill: '#bc9a7c', r: 4}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-10 font-serif text-xl opacity-50">No Hotel Data available to generate charts.</div>
                )}
            </div>
        ) : (
            /* --- DYNAMIC TABLE VIEW (HOTELS & DINING) --- */
            <div className="bg-white rounded-[30px] border border-[#eaddca] overflow-hidden shadow-xl shadow-[#4a3f35]/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfaf7] text-[#bc9a7c] uppercase text-[10px] tracking-[2px]">
                  <th className="p-6 border-b border-[#eaddca] font-bold">{activeTab === 'hotels' ? 'Property Name' : 'Restaurant Name'}</th>
                  <th className="p-6 border-b border-[#eaddca] font-bold">{activeTab === 'hotels' ? 'Location' : 'Cuisine Type'}</th>
                  <th className="p-6 border-b border-[#eaddca] text-right font-bold">Management</th>
                </tr>
              </thead>
              <tbody className="text-[#4a3f35]">
                {activeTab === 'hotels' ? (
                  data?.hotels.map((hotel: any) => (
                    <tr key={hotel._id} className="hover:bg-[#fcfaf7] transition border-b border-[#f5f1ea] last:border-0">
                      <td className="p-6 font-serif text-lg">{hotel.hotelName}</td>
                      <td className="p-6 text-[#8c7e6d] text-sm font-light italic">{hotel.address?.substring(0, 40)}...</td>
                      <td className="p-6 text-right">
                        <button onClick={() => navigate(`/admin/edit-hotel/${hotel._id}`)} className="bg-[#bc9a7c]/10 text-[#bc9a7c] px-4 py-2 rounded-xl font-bold text-[10px] uppercase hover:bg-[#bc9a7c] hover:text-white transition-all mr-3">Edit Details</button>
                        <button onClick={() => handleDeleteHotel(hotel._id, hotel.hotelName)} className="text-red-300 hover:text-red-500 transition-colors text-[10px] uppercase font-bold tracking-tighter">Remove</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  data?.dinings.map((venue: any) => (
                    <tr key={venue._id} className="hover:bg-[#fcfaf7] transition border-b border-[#f5f1ea] last:border-0">
                      <td className="p-6 font-serif text-lg">{venue.name}</td>
                      <td className="p-6 text-[#8c7e6d] text-sm font-light italic">{venue.cuisine}</td>
                      <td className="p-6 text-right">
                        <button onClick={() => navigate(`/admin/edit-dining/${venue._id}`)} className="bg-[#bc9a7c]/10 text-[#bc9a7c] px-4 py-2 rounded-xl font-bold text-[10px] uppercase hover:bg-[#bc9a7c] hover:text-white transition-all mr-3">Edit Menu</button>
                        <button onClick={() => handleDeleteDining(venue._id, venue.name)} className="text-red-300 hover:text-red-500 transition-colors text-[10px] uppercase font-bold tracking-tighter">Remove</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          
            {/* Empty State Check */}
            {((activeTab === 'hotels' && data?.hotels.length === 0) || (activeTab === 'dining' && data?.dinings.length === 0)) && (
              <div className="p-20 text-center text-[#8c7e6d] italic font-serif">
                No {activeTab} listed yet. Add your first property to begin.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="fixed inset-0 bg-[#4a3f35]/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;