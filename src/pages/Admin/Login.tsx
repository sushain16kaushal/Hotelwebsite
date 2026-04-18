import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const handleLogin = async (e:React.SubmitEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://hotelapp-tiof.onrender.com/api/admin-login', credentials);
            localStorage.setItem('adminToken', res.data.token); // Token save kar liya
            localStorage.setItem('customerDetails', JSON.stringify(res.data.details));
            setUser(res.data.details);
            navigate('/admin/dashboard');
        } catch (err:any) {
            const error=err as Error
            alert("Login Failed: " + error.message);
        }
    };

    return (
        <div className="login-container" style={{ backgroundColor: '#1a1a1a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleLogin} style={{ background: '#2a2a2a', padding: '40px', borderRadius: '12px', border: '1px solid #c5a059' }}>
                <h2 style={{ color: '#c5a059', marginBottom: '20px', textAlign: 'center' }}>Euphoria Admin</h2>
                <input 
                    type="email" 
                    placeholder="Emailaddress" 
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '10px', background: 'transparent', border: '1px solid #444', color: '#fff' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    style={{ display: 'block', width: '100%', marginBottom: '20px', padding: '10px', background: 'transparent', border: '1px solid #444', color: '#fff' }}
                />
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#c5a059', color: '#1a1a1a', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    ENTER DASHBOARD
                </button>
            </form>
        </div>
    );
};

export default Login;