import { Navigate } from 'react-router-dom';
import {  useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // LocalStorage se token check karo
    const { user, loading } = useAuth();
    const token = localStorage.getItem('adminToken');
const location = useLocation();
if (loading) {
        return (
            <div className="h-screen bg-[#1c1c1c] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    if (!user) {
        // location.pathname save karne se login ke baad user wapas wahi aayega jahan wo ja raha tha
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    if (!token) {
        // Agar token nahi hai, toh seedha login page pe bhej do
        return <Navigate to="/login" replace />;
    }

    // Agar token hai, toh jo page maanga hai wo dikhao
    return <>{children}</>;
};

export default ProtectedRoute;