import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('tenant');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });
            // Registration successful hone par seedha login page par bhejo
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed!');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-casa-slate/20 w-full max-w-md">
                <h2 className="text-3xl font-bold text-casa-dark mb-6 text-center">Create Account</h2>

                {error && <div className="bg-red-100 text-casa-darkred p-3 rounded mb-4 text-sm font-medium">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full border border-casa-slate/40 rounded-lg p-3 focus:outline-none focus:border-casa-red focus:ring-1 focus:ring-casa-red bg-casa-light/30 text-casa-dark"
                            value={name} onChange={(e) => setName(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-casa-slate/40 rounded-lg p-3 focus:outline-none focus:border-casa-red focus:ring-1 focus:ring-casa-red bg-casa-light/30 text-casa-dark"
                            value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-casa-slate/40 rounded-lg p-3 focus:outline-none focus:border-casa-red focus:ring-1 focus:ring-casa-red bg-casa-light/30 text-casa-dark"
                            value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">I want to:</label>
                        <select
                            className="w-full border border-casa-slate/40 rounded-lg p-3 focus:outline-none focus:border-casa-red focus:ring-1 focus:ring-casa-red bg-casa-light/30 text-casa-dark"
                            value={role} onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="tenant">Rent a property (Kirayedar)</option>
                            <option value="owner">List my property (Makaan Malik)</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-casa-red hover:bg-casa-darkred text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-sm">
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-casa-slate">
                    Already have an account? <Link to="/login" className="text-casa-red hover:underline font-medium">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
