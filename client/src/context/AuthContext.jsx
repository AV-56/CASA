import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Context create karna (Ek global dimaag ban raha hai)
const AuthContext = createContext();

// 2. AuthProvider component banana jo baaki components ko data dega
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Jab website khule, toh check karo ki local memory me user toh nahi hai
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login karne ka function
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    };

    // Logout karne ka function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Poore app me in teeno cheezon (user, login, logout) ki service free kar do
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Ek chota sa aasaan hook banana taaki koi bhi page easily data le sake
export const useAuth = () => {
    return useContext(AuthContext);
};
