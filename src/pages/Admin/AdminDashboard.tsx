import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hotels' | 'dining'>('hotels'); // TAB STATE
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

  // Delete Hotel Logic
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

  // Delete Dining Logic
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

  if (loading) return <div className="bg-[#121212] text-[#c5a059] h-screen flex justify-center items-center font-serif text-2xl italic">Data Incoming 🏔️</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#121212] text-white font-sans">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-[#1a1a1a] p-4 flex justify-between items-center border-b border-[#c5a059]/20 sticky top-0 z-50">
        <h2 className="text-[#c5a059] text-xl font-serif">Euphoria Admin</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#c5a059] text-2xl">☰</button>
      </header>

      {/* SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative md:translate-x-0 z-40
        w-64 h-full bg-[#1a1a1a] border-r border-[#c5a059]/30 p-6 
        flex flex-col justify-between transition-transform duration-300
      `}>
        <div>
          <h2 className="hidden md:block text-[#c5a059] text-2xl font-serif mb-10">Euphoria Admin</h2>
          <nav className="space-y-2">
            <div 
              onClick={() => { setActiveTab('hotels'); setIsSidebarOpen(false); }}
              className={`p-3 rounded font-medium cursor-pointer transition ${activeTab === 'hotels' ? 'bg-[#c5a059] text-black' : 'hover:bg-white/5 text-gray-400'}`}
            >
              🏨 Manage Hotels
            </div>
            <div 
              onClick={() => { setActiveTab('dining'); setIsSidebarOpen(false); }}
              className={`p-3 rounded font-medium cursor-pointer transition ${activeTab === 'dining' ? 'bg-[#c5a059] text-black' : 'hover:bg-white/5 text-gray-400'}`}
            >
              🥘 Dining Venues
            </div>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full p-3 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded transition text-xs font-bold uppercase tracking-widest">
          Logout Session 🔒
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-serif">
            {activeTab === 'hotels' ? 'Hotel Properties' : 'Dining Venues'}
          </h1>
          <div className="hidden sm:block text-[10px] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
            Shimla Central • {activeTab}
          </div>
        </div>

        {/* --- DYNAMIC VIEW --- */}
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[#c5a059] uppercase text-[10px] tracking-widest">
                <th className="p-4 border-b border-white/10">{activeTab === 'hotels' ? 'Property' : 'Restaurant'}</th>
                <th className="p-4 border-b border-white/10">{activeTab === 'hotels' ? 'Location' : 'Cuisine'}</th>
                <th className="p-4 border-b border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'hotels' ? (
                // HOTELS DATA
                data?.hotels.map((hotel: any) => (
                  <tr key={hotel._id} className="hover:bg-white/5 transition border-b border-white/5">
                    <td className="p-4 font-light">{hotel.hotelName}</td>
                    <td className="p-4 text-gray-400 text-sm">{hotel.address.substring(0, 30)}...</td>
                    <td className="p-4 text-right">
                      <button onClick={() => navigate(`/admin/edit-hotel/${hotel._id}`)} className="text-[#c5a059] font-bold text-[10px] uppercase mr-4">Edit Plans</button>
                      <button onClick={() => handleDeleteHotel(hotel._id, hotel.hotelName)} className="text-red-500/50 text-[10px] uppercase">Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                // DINING DATA
                data?.dinings.map((venue: any) => (
                  <tr key={venue._id} className="hover:bg-white/5 transition border-b border-white/5">
                    <td className="p-4 font-light">{venue.name}</td>
                    <td className="p-4 text-gray-400 text-sm">{venue.cuisine}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => navigate(`/admin/edit-dining/${venue._id}`)} className="text-[#c5a059] font-bold text-[10px] uppercase mr-4">Edit Menu</button>
                      <button onClick={() => handleDeleteDining(venue._id, venue.name)} className="text-red-500/50 text-[10px] uppercase">Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;