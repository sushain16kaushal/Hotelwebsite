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

 if (loading) return (
    <div className="bg-[#f5f1ea] text-[#4a3f35] h-screen flex flex-col justify-center items-center font-serif">
      <div className="text-3xl italic animate-pulse">Euphoria Admin</div>
      <div className="text-[10px] uppercase tracking-[4px] mt-4 opacity-50">Fetching Shimla Properties...</div>
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
            {activeTab === 'hotels' ? 'Hotel Properties' : 'Dining Venues'}
          </h1>
          <div className="hidden sm:block text-[10px] text-[#bc9a7c] bg-white px-4 py-2 rounded-full border border-[#eaddca] font-bold uppercase tracking-[2px] shadow-sm">
            Shimla Central • {activeTab}
          </div>
        </div>

        {/* --- DYNAMIC TABLE VIEW --- */}
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
                    <td className="p-6 text-[#8c7e6d] text-sm font-light italic">{hotel.address.substring(0, 40)}...</td>
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
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="fixed inset-0 bg-[#4a3f35]/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;