import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
    children: React.ReactNode;
    roleRequired?: 'admin' | 'customer'; // Optional role check
}

const ProtectedRoute = ({ children, roleRequired }: Props) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Pehle Loading check karo
    if (loading) {
        return (
            <div className="h-screen bg-[#1c1c1c] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 2. Agar user logged in hi nahi hai
    if (!user) {
        // Agar admin page try kar raha tha toh /login pe bhejo, warna /auth pe
        const loginPath = location.pathname.startsWith('/admin') ? '/login' : '/auth';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // 3. Agar logged in hai, toh Role check karo (The Khichdi Fixer)
    if (roleRequired) {
        // Maan lo user ka data req.user.role se aa raha hai ('admin' ya 'customer')
        if (user.role !== roleRequired) {
            // Agar customer admin page pe jaane ki koshish kare
            return <Navigate to="/" replace />; 
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;