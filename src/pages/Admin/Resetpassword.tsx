import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`https://hotelapp-tiof.onrender.com/api/reset-password/${token}`, { password });
            setMessage("Password Reset Successful! Redirecting...");
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            setMessage("Link expired or invalid.");
        }
    };

    return (
        <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center p-4 text-center">
            <div className="w-full max-w-[400px] bg-[#2a2a2a] border border-white/10 p-8 rounded-3xl">
                <h2 className="text-[#c5a059] text-2xl font-serif tracking-widest mb-4">NEW PASSWORD</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Enter new password" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="w-full bg-[#c5a059] text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#d4b57a] transition-all">
                        Update Password
                    </button>
                </form>
                {message && <p className="mt-4 text-[#c5a059] text-[10px] uppercase">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;