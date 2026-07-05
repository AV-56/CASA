import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Yahan Context ko import kiya
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            // Context ke through login call karo (ye localstorage bhi apne aap sambhal lega)
            login(response.data);

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login me kuch problem aayi!');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-casa-slate/20 w-full max-w-md">
                <h2 className="text-3xl font-bold text-casa-dark mb-6 text-center">Welcome Back</h2>

                {error && <div className="bg-red-100 text-casa-darkred p-3 rounded mb-4 text-sm font-medium">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-casa-slate/40 rounded-lg p-3 focus:outline-none focus:border-casa-red focus:ring-1 focus:ring-casa-red transition-colors bg-casa-light/30 text-casa-dark"
                            value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-casa-slate/40 rounded-lg p-3 focus:outline-none focus:border-casa-red focus:ring-1 focus:ring-casa-red transition-colors bg-casa-light/30 text-casa-dark"
                            value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>
                    <button type="submit" className="w-full bg-casa-red hover:bg-casa-darkred text-white font-bold py-3 rounded-lg transition-colors shadow-sm">
                        Login
                    </button>
                </form>

                <p className="mt-4 text-center text-casa-slate">
                    Don't have an account? <Link to="/register" className="text-casa-red hover:underline font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
