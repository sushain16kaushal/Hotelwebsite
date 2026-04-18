import { createContext, useState, useEffect, useContext } from 'react';

// 1. Context Create Karo
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    const initializeAuth = () => {
        const storedUser = localStorage.getItem('customerDetails');
        // Dono tokens mein se koi bhi ek mil jaye
        const token = localStorage.getItem('customerToken') || localStorage.getItem('adminToken');
        
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Auth initialization failed", error);
            }
        }
        setLoading(false);
    };

    initializeAuth();
}, []);

    const logout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('customerDetails');
        setUser(null);
        window.location.href = '/'; // Seedha home page par
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {/* Jab tak check ho raha hai, tab tak loading screen dikha sakte ho */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 2. Custom Hook (Yahi hai useAuth)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};