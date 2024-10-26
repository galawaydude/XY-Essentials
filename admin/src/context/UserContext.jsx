import React, { createContext, useState } from 'react';

// Create a User Context
export const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
