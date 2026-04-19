import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
const LoginSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const detailsStr = searchParams.get('details');

        if (token && detailsStr) {
            const userData = JSON.parse(decodeURIComponent(detailsStr));
            
            // Local Storage mein save karo
            localStorage.setItem('customerToken', token);
            localStorage.setItem('customerDetails', JSON.stringify(userData));
            
            // Global State update karo
            setUser(userData);
            
            // Redirect to home or booking
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
            navigate(redirectTo);
        }else if (!token) {
    // Jahan se user bhaga hai, wahi wapas aaye login ke baad
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname); 
    
    toast.error("Please sign in first!");
    navigate('/auth');
    return;
}
    }, [searchParams, navigate, setUser]);

    return (
        <div className="h-screen bg-[#1c1c1c] flex flex-col items-center justify-center text-[#c5a059]">
            <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-serif tracking-widest uppercase text-sm">Authenticating your retreat...</p>
        </div>
    );
};

export default LoginSuccess;