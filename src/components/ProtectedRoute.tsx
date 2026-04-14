import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // LocalStorage se token check karo
    const token = localStorage.getItem('adminToken');

    if (!token) {
        // Agar token nahi hai, toh seedha login page pe bhej do
        return <Navigate to="/login" replace />;
    }

    // Agar token hai, toh jo page maanga hai wo dikhao
    return <>{children}</>;
};

export default ProtectedRoute;