// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setIsAuthenticated(true); // Set authentication status
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setIsAuthenticated(false);
            }
        };

        fetchUser();
    }, []);

    // console.log('User:', user);
    // console.log('Is Authenticated:', isAuthenticated);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
