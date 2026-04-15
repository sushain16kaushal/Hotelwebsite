import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu toggle
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
    alert("Logged out successfully! 🛡️");
    navigate('/login');
  };

  const handleDelete = async (id: any, name: string) => {
    const confirmDelete = window.confirm(`Delete "${name}"?`);
    if (confirmDelete) {
      try {
        await axios.delete(`https://hotelapp-tiof.onrender.com/api/delete-hotel/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setData((prev: any) => ({
          ...prev,
          hotels: prev.hotels.filter((hotel: any) => hotel._id !== id)
        }));
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="bg-[#121212] text-[#c5a059] h-screen flex justify-center items-center font-serif text-xl sm:text-2xl italic">Data Incoming 🏔️</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#121212] text-white font-sans">
      
      {/* --- MOBILE HEADER --- */}
     <header className="md:hidden bg-[#1a1a1a] p-4 flex justify-between items-center border-b border-[#c5a059]/20 sticky top-0 z-50">
  <h2 className="text-[#c5a059] text-xl font-serif">Euphoria Admin</h2>
  <div className="flex gap-4 items-center">
    <button onClick={handleLogout} className="text-red-500 text-sm font-bold">LOGOUT</button>
    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#c5a059] text-2xl">
      {isSidebarOpen ? '✕' : '☰'}
    </button>
  </div>
</header>

      {/* --- SIDEBAR (Hidden on mobile unless toggled) --- */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative md:translate-x-0 z-40
        w-64 h-full bg-[#1a1a1a] border-r border-[#c5a059]/30 p-6 
        flex flex-col justify-between transition-transform duration-300
      `}>
        <div>
          <h2 className="hidden md:block text-[#c5a059] text-2xl font-serif mb-10">Euphoria Admin</h2>
          <nav className="space-y-2">
            <div className="p-3 bg-[#c5a059] text-black rounded font-medium cursor-pointer text-center md:text-left">Manage Hotels</div>
            <div className="p-3 hover:bg-white/5 rounded cursor-pointer transition text-center md:text-left">Dining Venues</div>
            <div className="p-3 hover:bg-white/5 rounded cursor-pointer transition text-center md:text-left">Site Settings</div>
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full p-3 mt-10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded transition text-xs font-bold uppercase"
        >
          Logout Session 🔒
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-serif">Management System</h1>
          <div className="text-[10px] md:text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Shimla Central Online
          </div>
        </div>

        {/* --- DESKTOP TABLE VIEW (Visible on tablets and up) --- */}
        <div className="hidden sm:block bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[#c5a059] uppercase text-[10px] tracking-widest">
                <th className="p-4 border-b border-white/10">Property</th>
                <th className="p-4 border-b border-white/10">Location</th>
                <th className="p-4 border-b border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.hotels.map((hotel: any) => (
                <tr key={hotel._id} className="hover:bg-white/5 transition border-b border-white/5">
                  <td className="p-4 font-light">{hotel.hotelName}</td>
                  <td className="p-4 text-gray-400 text-sm">{hotel.address || "Shimla"}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => navigate(`/admin/edit-hotel/${hotel._id}`)}
                      className="text-[#c5a059] hover:underline mr-4 text-[10px] font-bold uppercase"
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-500/70 hover:text-red-500 text-[10px] uppercase"
                      onClick={() => handleDelete(hotel._id, hotel.hotelName)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE CARD VIEW (Only visible on small screens) --- */}
        <div className="sm:hidden space-y-4">
          {data?.hotels.map((hotel: any) => (
            <div key={hotel._id} className="bg-[#1a1a1a] p-5 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-[#c5a059] font-serif text-lg mb-1">{hotel.hotelName}</h3>
              <p className="text-gray-500 text-xs mb-4">{hotel.address || "Shimla"}</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/admin/edit-hotel/${hotel._id}`)}
                  className="flex-1 bg-[#c5a059] text-black text-center py-2 rounded-lg text-xs font-bold uppercase"
                >
                  Edit Plans
                </button>
                <button 
                  onClick={() => handleDelete(hotel._id, hotel.hotelName)}
                  className="flex-1 border border-red-500/50 text-red-500 py-2 rounded-lg text-xs font-bold uppercase"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;