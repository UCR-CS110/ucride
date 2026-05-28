import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users/profile');
            setUser(response.data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.user);
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

