import React from 'react';
import { DollarSign, Package, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import SalesChart from '../components/SalesChart';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Dashboard = () => {
    const [stats, setStats] = React.useState({
        dailySales: 0,
        itemsSold: 0,
        inventoryValue: 0,
        chartData: [],
        recentActivity: []
    });

    const fetchStats = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`);
            const res = await fetch(`${API_URL}/api/dashboard`);
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchStats();
    }, []);

    const { user } = useAuth();

    const handleResetSystem = async () => {
        if (!window.confirm('⚠ PRECAUCIÓN: ¿Borrar historial de ventas y pedidos? (Los productos NO se borrarán).')) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`);
            const res = await fetch(`${API_URL}/api/admin/reset`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error en el servidor');
            toast.success('Historial reiniciado.');
            fetchStats(); // Update UI without reload
        } catch (e) {
            toast.error('No se pudo reiniciar el sistema');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Gerencial</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Resumen de actividad y métricas clave.</p>
                </div>
                <div className="flex items-center gap-3">
                    {user?.role === 'Gerente' && (
                        <button
                            onClick={handleResetSystem}
                            className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                            ⚠ Reiniciar Historial
                        </button>
                    )}
                    <span className="bg-brand-green-light/10 text-brand-green-dark dark:text-brand-green-light px-3 py-1 rounded-full text-xs font-semibold">
                        En vivo
                    </span>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <KPICard
                        title="Ventas del Día"
                        value={stats.dailySales}
                        prefix="$"
                        trend={0} // To implement trend logic later
                        icon={DollarSign}
                        color="green"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <KPICard
                        title="Valor Inventario"
                        value={stats.inventoryValue}
                        prefix="$"
                        trend={0}
                        icon={Package}
                        color="blue"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <KPICard
                        title="Total Items Vendidos"
                        value={stats.itemsSold}
                        suffix=" u."
                        trend={0}
                        icon={TrendingUp}
                        color="orange"
                    />
                </motion.div>
            </div>

            {/* Sales Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                        <SalesChart data={stats.chartData} />
                    </motion.div>
                </div>

                {/* Recent Activity / Notifications */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Actividad Reciente</h3>
                    <ul className="space-y-4">
                        {stats.recentActivity.length > 0 ? stats.recentActivity.map((order) => (
                            <li key={order.id} className="flex items-start gap-3 border-b border-gray-50 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-600 dark:text-green-400">
                                    VN
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800 dark:text-white font-medium">{order.client_name || 'Cliente'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Hace {Math.floor((new Date() - new Date(order.created_at)) / 60000)} min</p>
                                </div>
                                <span className="ml-auto text-xs font-bold text-brand-green-dark dark:text-brand-green-light">+${Number(order.total).toFixed(2)}</span>
                            </li>
                        )) : (
                            <p className="text-sm text-gray-400 text-center py-4">Sin actividad reciente</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
