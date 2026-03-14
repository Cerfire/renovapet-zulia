import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && allowedRoles && !allowedRoles.includes(user.role)) {
            toast.error('Acceso denegado: No tienes permisos para esta área');
            navigate('/', { replace: true });
        }
    }, [user, allowedRoles, navigate]);

    if (!user) {
        return <Navigate to="/login" state={{ from: location, accessDenied: true }} replace />;
    }

    // Wait for redirect to happen if role is not allowed, avoid rendering
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null; 
    }

    return <Outlet />;
};

export default ProtectedRoute;
