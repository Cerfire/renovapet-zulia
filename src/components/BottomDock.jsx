import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, DollarSign, User, Activity, ShoppingBag, Users, Database } from 'lucide-react';
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
        { id: 'catalog', icon: DollarSign, label: 'Catálogo', path: '/catalog' },
        { id: 'orders', icon: ShoppingBag, label: 'Pedidos', path: '/orders' },
        { id: 'dashboard', icon: User, label: 'Dashboard', path: '/dashboard' },
    ];

    if (user?.role === 'Gerente') {
        navItems.push({ id: 'users', icon: Users, label: 'Personal', path: '/users' });
        navItems.push({ id: 'entities', icon: Database, label: 'Registros', path: '/entities' });
        navItems.push({ id: 'bitacora', icon: Activity, label: 'Bitácora', path: '/bitacora' });
    }


    const handleNavigation = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-md">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-gray-700 shadow-2xl rounded-2xl px-4 py-3 flex items-center justify-start gap-6 overflow-x-auto snap-x ring-1 ring-black/5 dark:ring-white/10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`min-w-fit snap-center relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? 'text-brand-green-dark dark:text-brand-green-light -translate-y-2' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <div
                                className={`p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-green-light/20 shadow-lg shadow-brand-green-light/10 ring-1 ring-brand-green-light/30' : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}`}
                            >

                                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            </div>

                            {isActive && (
                                <span className="absolute -bottom-6 text-[10px] font-bold text-brand-green-dark dark:text-brand-green-light tracking-wide animate-fade-in whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}

                            {/* Active Indicator underneath */}
                            {isActive && (
                                <span className="absolute -bottom-2 w-1 h-1 bg-brand-green-dark dark:bg-brand-green-light rounded-full animate-pulse"></span>
                            )}

                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomDock;
