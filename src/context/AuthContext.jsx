import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

import { toast } from 'sonner';

// Standalone helper to get auth headers (accessible without hook)
export const getAuthHeaders = () => {
    const token = localStorage.getItem('renovapet_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Standalone helper to get auth token for custom header configs
export const getAuthToken = () => {
    return localStorage.getItem('renovapet_token');
};

// Helper to check if a token is expired by decoding the JWT payload
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearSession = useCallback(() => {
        setUser(null);
        localStorage.removeItem('renovapet_user');
        localStorage.removeItem('renovapet_token');
    }, []);

    useEffect(() => {
        // Restore session from localStorage
        const storedUser = localStorage.getItem('renovapet_user');
        const storedToken = localStorage.getItem('renovapet_token');

        if (storedUser && storedToken) {
            // Validate token is not expired
            if (isTokenExpired(storedToken)) {
                console.warn('Stored token is expired, clearing session.');
                clearSession();
            } else {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Error parsing user data", e);
                    clearSession();
                }
            }
        } else {
            // Incomplete session data, clear
            localStorage.removeItem('renovapet_user');
            localStorage.removeItem('renovapet_token');
        }
        setLoading(false);
    }, [clearSession]);

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

            // Success: Save user info and token
            setUser(data.user);
            localStorage.setItem('renovapet_user', JSON.stringify(data.user));
            localStorage.setItem('renovapet_token', data.token);
            toast.success(`Bienvenido, ${data.user.username}`);
            return data.user;

        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.message || 'Error de conexión');
            throw error;
        }
    };

    const logout = () => {
        clearSession();
    };

    // Handle 401 responses — to be called by any component on unauthorized response
    const handleUnauthorized = useCallback(() => {
        clearSession();
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Navigation will be handled by ProtectedRoute detecting user === null
    }, [clearSession]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, handleUnauthorized }}>
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
