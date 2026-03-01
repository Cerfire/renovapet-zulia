import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido a Renovapet <span className="text-brand-green-light">Zulia</span></h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                    Sistema integral para la gestión de inventario y ventas. Selecciona una opción del menú para comenzar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats / Shortcuts */}
                <div
                    onClick={() => navigate('/inventory')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Inventario</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gestionar productos y stock</p>
                </div>

                <div
                    onClick={() => navigate('/catalog')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                        <svg className="w-6 h-6 text-brand-green-dark dark:text-brand-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Nueva Venta</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Ir al Catálogo</p>
                </div>

                <div
                    onClick={() => navigate('/dashboard')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Reportes</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Ver Dashboard</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
