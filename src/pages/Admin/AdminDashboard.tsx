import  { useEffect, useState } from 'react';
import axios from 'axios';


const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const handleDelete = async (id: any, name: string) => { // id ko any ya string rakho for mongo compatibility
  const confirmDelete = window.confirm(`Are you Sure you want to delete "${name}"?`);
  
  if (confirmDelete) {
    try {
      const token = localStorage.getItem('adminToken');
      console.log("Token being sent:", token); // Debugging ke liye

   await axios.delete(`https://hotelapp-tiof.onrender.com/api/delete-hotel/${id}`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  }
});
      // UI update logic (filter based on the ID sent)
      setData((prev: any) => ({
        ...prev,
        hotels: prev.hotels.filter((hotel: any) => hotel._id !== id)
      }));

      alert("Success! Hotel has been removed.");
    } catch (err: any) {
      console.error("Delete Error:", err.response?.data); // Isse asli wajah pata chalegi
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

  if (loading) return <div className="text-black p-10">Data Incoming 🏔️</div>;

  return (
    <div className="flex h-screen mt-3 bg-[#121212] text-white font-sans">
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#c5a059]/30 p-6">
        <h2 className="text-[#c5a059] text-2xl font-serif mb-10">Euphoria Admin</h2>
        <nav className="space-y-2">
          <div className="p-3 bg-[#c5a059] text-black rounded font-medium cursor-pointer">Manage Hotels</div>
          <div className="p-3 hover:bg-white/5 rounded cursor-pointer transition">Dining Venues</div>
          <div className="p-3 hover:bg-white/5 rounded cursor-pointer transition">Site Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Smart Hotel Management System</h1>
        </div>

        {/* Hotels Table */}
        <div className="bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[#c5a059] uppercase text-xs tracking-widest">
                <th className="p-4 border-b border-white/10">Property Name</th>
                <th className="p-4 border-b border-white/10">Location</th>
                <th className="p-4 border-b border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.hotels.map((hotel:any) => (
                <tr key={hotel.hotelId} className="hover:bg-white/5 transition border-b border-white/5">
                  <td className="p-4 font-light">{hotel.hotelName}</td>
                  <td className="p-4 text-gray-400 text-sm">{hotel.address || "Shimla"}</td>
                  <td className="p-4 text-right">
                    <button className="text-blue-400 hover:text-blue-300 mr-4 text-sm">Edit</button>
                    <button 
                      className="text-red-500 hover:text-red-400 text-sm"
                      onClick={() => handleDelete(hotel._id, hotel.hotelName)}
                    >
                      Delete
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
