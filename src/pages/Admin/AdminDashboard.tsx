

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#252525] border-r border-[#c5a059] p-6">
        <h2 className="text-[#c5a059] text-2xl font-bold mb-10">Euphoria Admin</h2>
        <nav className="space-y-4">
          <div className="p-3 bg-[#c5a059] text-black rounded cursor-pointer font-semibold">Hotels</div>
          <div className="p-3 hover:bg-[#333] rounded cursor-pointer transition">Dining</div>
          <div className="p-3 hover:bg-[#333] rounded cursor-pointer transition">Settings</div>
          <div 
            className="p-3 mt-20 text-red-500 hover:bg-red-900/20 rounded cursor-pointer"
            onClick={() => { localStorage.removeItem('adminToken'); window.location.reload(); }}
          >
            Logout
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-light">Management Dashboard</h1>
          <button className="bg-[#c5a059] text-black px-6 py-2 rounded-full hover:bg-[#b08d4a] transition">
            + Add New Hotel
          </button>
        </header>

        {/* Data Grid / Table yahan aayegi */}
        <div className="bg-[#252525] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400">Yahan hum saare hotels ki list render karenge...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
