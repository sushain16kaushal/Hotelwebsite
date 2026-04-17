import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://hotelapp-tiof.onrender.com/api/forgot-password`, { email });
            setMessage(res.data.msg);
        } catch (err) {
            setMessage("Error: User not found or server issue.");
        }
    };

    return (
        <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[400px] bg-[#2a2a2a] border border-white/10 p-8 rounded-3xl text-center">
                <h2 className="text-[#c5a059] text-2xl font-serif tracking-widest mb-4">RESET ACCESS</h2>
                <p className="text-gray-400 text-xs mb-6 tracking-wider">Enter your email to receive a recovery link.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="your-email@example.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="w-full bg-[#c5a059] text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#d4b57a] transition-all">
                        Send Recovery Link
                    </button>
                </form>
                {message && <p className="mt-4 text-[#c5a059] text-[10px] uppercase">{message}</p>}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;