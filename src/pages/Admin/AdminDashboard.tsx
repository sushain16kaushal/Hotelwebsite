import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Navigation ke liye
import { useLocation } from 'react-router-dom';
const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location =useLocation();
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
  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Token clear
    alert("Logged out successfully. Security first! 🛡️");
    navigate('/login'); // Login page par bhej do
  };

  const handleDelete = async (id: any, name: string) => {
    const confirmDelete = window.confirm(`Are you Sure you want to delete "${name}"?`);
    if (confirmDelete) {
      try {
        await axios.delete(`https://hotelapp-tiof.onrender.com/api/delete-hotel/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setData((prev: any) => ({
          ...prev,
          hotels: prev.hotels.filter((hotel: any) => hotel._id !== id)
        }));
        alert("Success! Hotel has been removed.");
      } catch (err: any) {
        alert(`Unable to Remove: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  useEffect(() => {
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
    fetchData();
  }, []);

  if (loading) return <div className="bg-[#121212] text-[#c5a059] h-screen flex justify-center items-center font-serif text-2xl">Data Incoming 🏔️</div>;

  return (
    <div className="flex h-screen bg-[#121212] mt-3 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#c5a059]/30 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-[#c5a059] text-2xl font-serif mb-10">Euphoria Admin</h2>
          <nav className="space-y-2">
            <div className="p-3 bg-[#c5a059] text-black rounded font-medium cursor-pointer">Manage Hotels</div>
            <div className="p-3 hover:bg-white/5 rounded cursor-pointer transition">Dining Venues</div>
            <div className="p-3 hover:bg-white/5 rounded cursor-pointer transition">Site Settings</div>
          </nav>
        </div>
        
        {/* Logout Button at Bottom */}
        <button 
          onClick={handleLogout}
          className="w-full p-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded transition text-sm font-bold uppercase tracking-widest"
        >
          Logout Session 🔒
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Smart Hotel Management System</h1>
          <div className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            System Online: Shimla Central
          </div>
        </div>

        {/* Hotels Table */}
        <div className="bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[#c5a059] uppercase text-[10px] tracking-[0.2em]">
                <th className="p-4 border-b border-white/10">Property Name</th>
                <th className="p-4 border-b border-white/10">Location</th>
                <th className="p-4 border-b border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.hotels.map((hotel: any) => (
                <tr key={hotel.hotelId} className="hover:bg-white/5 transition border-b border-white/5">
                  <td className="p-4 font-light tracking-wide">{hotel.hotelName}</td>
                  <td className="p-4 text-gray-400 text-sm">{hotel.address || "Shimla"}</td>
                  <td className="p-4 text-right">
                    {/* EDIT BUTTON: Navigates to Edit Page */}
                    <button 
                      onClick={() => navigate(`/admin/edit-hotel/${hotel._id}`)}
                      className="text-[#c5a059] hover:underline mr-6 text-xs uppercase tracking-widest font-bold"
                    >
                      Edit Plans
                    </button>
                    <button 
                      className="text-red-500/70 hover:text-red-500 text-xs uppercase tracking-widest"
                      onClick={() => handleDelete(hotel._id, hotel.hotelName)}
                    >
                      Remove
                    </button>
                    {/* Naya Features Edit Button */}
  <button 
    onClick={() => navigate(`/admin/edit-features/${hotel._id}`)}
    className="bg-[#C5A059] p-2 rounded text-sm text-black font-bold"
  >
    Edit Features
  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
