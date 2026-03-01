import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, DollarSign, User, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomDock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('home');

    // Sync active state with URL
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setActiveTab('home');
        else if (path.includes('inventory')) setActiveTab('inventory');
        else if (path.includes('catalog')) setActiveTab('sales');
        else if (path.includes('dashboard')) setActiveTab('profile');
        else if (path.includes('bitacora')) setActiveTab('bitacora');
    }, [location]);

    const navItems = [
        { id: 'home', icon: Home, label: 'Inicio', path: '/' },
        { id: 'inventory', icon: Package, label: 'Inventario', path: '/inventory' },
        { id: 'sales', icon: DollarSign, label: 'Catálogo', path: '/catalog' },
        { id: 'profile', icon: User, label: 'Dashboard', path: '/dashboard' },
    ];

    if (user?.role === 'Gerente') {
        navItems.push({ id: 'bitacora', icon: Activity, label: 'Bitácora', path: '/bitacora' });
    }

    const handleNavigation = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl px-6 py-3 flex items-center justify-between ring-1 ring-black/5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? 'text-brand-green-dark -translate-y-2' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div
                                className={`p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-green-light/20 shadow-lg shadow-brand-green-light/10 ring-1 ring-brand-green-light/30' : 'hover:bg-gray-100/50'}`}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            </div>

                            {isActive && (
                                <span className="absolute -bottom-6 text-[10px] font-bold text-brand-green-dark tracking-wide animate-fade-in whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}

                            {/* Active Indicator underneath */}
                            {isActive && (
                                <span className="absolute -bottom-2 w-1 h-1 bg-brand-green-dark rounded-full animate-pulse"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomDock;
