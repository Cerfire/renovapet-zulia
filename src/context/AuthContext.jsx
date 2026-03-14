import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

import { toast } from 'sonner';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage
        const storedUser = localStorage.getItem('renovapet_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data", e);
                localStorage.removeItem('renovapet_user');
            }
        }
        setLoading(false);
    }, []);

    // En desarrollo (localhost) usa el puerto 5000, en producción (Vercel) usa rutas relativas ('')
    const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Determine error message
                throw new Error(data.error || 'Error de autenticación');
            }

            // Success: Save user info returned by backend (id, username, role, avatar)
            setUser(data);
            localStorage.setItem('renovapet_user', JSON.stringify(data));
            toast.success(`Bienvenido, ${data.username}`);
            return data;

        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.message || 'Error de conexión');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('renovapet_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
