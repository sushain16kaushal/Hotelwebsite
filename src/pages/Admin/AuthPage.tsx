import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    const backendUrl = 'https://hotelapp-tiof.onrender.com';
const { setUser } = useAuth();
    const handleGoogleLogin = () => {
        // Direct backend OAuth route par redirect
        window.location.href = `${backendUrl}/api/google`;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // --- LOGIN LOGIC ---
                const res = await axios.post(`${backendUrl}/api/cust-login`, {
                    email: formData.email,
                    password: formData.password
                });
                
                localStorage.setItem('customerToken', res.data.token);
                localStorage.setItem('customerDetails', JSON.stringify(res.data.details));
                setUser(res.data.details);
                navigate('/'); // Login ke baad home page
            } else {
                // --- SIGNUP LOGIC ---
                await axios.post(`${backendUrl}/api/signup`, formData);
                alert("Registration Successful! Please Sign In.");
                setIsLogin(true); // Signup ke baad login screen par bhej do
            }
        } catch (err: any) {
            alert(err.response?.data?.msg || err.response?.data || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center p-4 font-serif">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#c5a059] blur-[150px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#8e7b54] blur-[150px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-112.5 bg-[#2a2a2a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <h2 className="text-[#c5a059] text-3xl tracking-[0.2em] uppercase mb-2">Euphoria</h2>
                    <p className="text-gray-400 text-xs tracking-widest uppercase">
                        {isLogin ? "Welcome Back to Shimla" : "Join the Luxury Retreat"}
                    </p>
                </div>

                {/* Social Login */}
                <button 
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-sans font-bold hover:bg-gray-200 transition-all mb-6"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
                    Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-xs">OR</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Form Logic */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label className="text-gray-400 text-[10px] uppercase tracking-widest ml-1">Full Name</label>
                            <input type="text" required
  value={formData.name}
  onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter your Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none transition" />
                        </div>
                    )}
                    <div>
                        <label className="text-gray-400 text-[10px] uppercase tracking-widest ml-1">Email Address</label>
                        <input type="email" value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none transition" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-[10px] uppercase tracking-widest ml-1">Password</label>
                        <input type="password" required
  value={formData.password}
  onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none transition" />
                        {isLogin && (
                            <button 
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-[#c5a059] text-[10px] mt-2 block hover:underline"
                            >
                                Forgot Password?
                            </button>
                        )}
                    </div>

                    <button className="w-full bg-[#c5a059] text-black py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#d4b57a] transition-all shadow-lg shadow-[#c5a059]/20">
                        {isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                {/* Toggle Link */}
                <p className="text-center text-gray-500 text-xs mt-8">
                    {isLogin ? "Don't have an account?" : "Already a member?"} 
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#c5a059] ml-2 font-bold hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default AuthPage;