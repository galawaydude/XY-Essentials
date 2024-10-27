// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // console.log('ProtectedRoute - Is Authenticated:', isAuthenticated); 

    return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;
