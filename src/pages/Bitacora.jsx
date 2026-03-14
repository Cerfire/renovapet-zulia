import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Trash2, Database, Activity, User, Clock, ArrowRight, Settings } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');


const Bitacora = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [showDangerZone, setShowDangerZone] = useState(false);

    // Filters
    const [filterDate, setFilterDate] = useState('');
    const [filterUser, setFilterUser] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState(null);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        if (user?.role === 'Gerente') {
            fetchLogs();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_URL}/api/audit`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            toast.error('Error al cargar la bitácora');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (type) => {
        if (confirmText !== 'CONFIRMAR') {
            toast.error('Debe escribir CONFIRMAR exactamente para proceder');
            return;
        }

        setActionLoading(type);
        try {
            const res = await fetch(`${API_URL}/api/admin/reset`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                if (type === 'audit' || type === 'all') {
                    setLogs([]);
                }
            } else {
                toast.error(data.error || 'Error al limpiar los datos');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setActionLoading(null);
            closeModal();
            if (type === 'orders' || type === 'all') {
                // Pequeño timeout para que el usuario lea el toast antes de recargar
                setTimeout(() => {
                    if (type === 'all') window.location.reload();
                }, 1500);
            }
        }
    };

    const openModal = (type, title, description) => {
        setModalConfig({ type, title, description });
        setShowModal(true);
        setConfirmText('');
    };

    const closeModal = () => {
        setShowModal(false);
        setModalConfig(null);
        setConfirmText('');
    };

    if (loading) {
        return <div className="min-h-screen py-24 flex items-center justify-center text-brand-green-dark font-medium animate-pulse">Cargando bitácora...</div>;
    }

    if (user?.role !== 'Gerente') {
        return (
            <div className="min-h-screen py-24 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <ShieldAlert className="w-24 h-24 text-red-500 mb-6 drop-shadow-md" />
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Acceso Denegado</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium text-center px-4 max-w-md">Esta sección es de seguridad avanzada y es exclusiva para el rol <span className="font-bold text-gray-800 dark:text-gray-200">Gerente</span>.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <Activity className="w-10 h-10 text-brand-green-dark" />
                        Bitácora del Sistema
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 font-medium text-center md:text-left">
                        Registro de auditoría y gestión avanzada de base de datos.
                    </p>
                </div>
                <button
                    onClick={() => setShowDangerZone(!showDangerZone)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 ${showDangerZone ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                    <Settings className={`w-5 h-5 ${showDangerZone ? 'animate-spin-slow text-red-500' : 'text-gray-500'}`} />
                    {showDangerZone ? 'Ocultar Ajustes' : 'Ajustes del Sistema'}
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${showDangerZone ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6 transition-all duration-300`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-brand-green-light" />
                            Historial de Actividad
                        </h2>

                        {logs.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                <Database className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="font-medium text-lg text-gray-400">No hay registros en la bitácora.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                    <input 
                                        type="date" 
                                        value={filterDate} 
                                        onChange={(e) => setFilterDate(e.target.value)} 
                                        className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-brand-green-light outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Filtrar por usuario..." 
                                        value={filterUser} 
                                        onChange={(e) => setFilterUser(e.target.value)} 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-brand-green-light outline-none"
                                    />
                                </div>
                                <div className="relative border-l-2 border-brand-green-light/30 ml-5 space-y-10 pb-4">
                                    {logs.filter(log => {
                                        const dateMatch = filterDate ? new Date(log.timestamp).toISOString().split('T')[0] === filterDate : true;
                                        const userMatch = filterUser ? (log.username || 'Sistema').toLowerCase().includes(filterUser.toLowerCase()) : true;
                                        return dateMatch && userMatch;
                                    }).map((log, index) => {
                                    // Determinar color e icono por acción
                                    let ActionIcon = Activity;
                                    let bgColor = "bg-gray-100 dark:bg-gray-700";
                                    let textColor = "text-gray-600 dark:text-gray-300";

                                    if (log.action === 'CREATE') {
                                        ActionIcon = Database;
                                        bgColor = "bg-green-100 dark:bg-green-900/30";
                                        textColor = "text-green-600 dark:text-green-400";
                                    } else if (log.action === 'UPDATE' || log.action === 'DISPATCH') {
                                        ActionIcon = Activity;
                                        bgColor = "bg-blue-100 dark:bg-blue-900/30";
                                        textColor = "text-blue-600 dark:text-blue-400";
                                    } else if (log.action === 'DELETE') {
                                        ActionIcon = Trash2;
                                        bgColor = "bg-red-100 dark:bg-red-900/30";
                                        textColor = "text-red-600 dark:text-red-400";
                                    }

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={log.id}
                                            className="relative pl-8"
                                        >
                                            <span className={`absolute -left-6 top-1 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md ${bgColor} ${textColor}`}>
                                                <ActionIcon className="w-5 h-5" />
                                            </span>

                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${bgColor} ${textColor}`}>
                                                            {log.action}
                                                        </span>
                                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2.5 py-1 rounded-md tracking-wider">
                                                            TABLA: {log.table_affected}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-800 dark:text-gray-200 font-medium text-base mb-3 leading-relaxed">
                                                    {log.details}
                                                </p>
                                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700/50 flex items-center gap-2 text-sm text-gray-500">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                                                    </div>
                                                    <span>Realizado por: <strong className="text-gray-800 dark:text-white">{log.username || 'Sistema'}</strong></span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <AnimatePresence>
                    {showDangerZone && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 rounded-3xl border border-red-200 dark:border-red-900/50 p-6 md:p-8 sticky top-24 shadow-sm">
                                <div className="flex items-center gap-3 mb-6 relative">
                                    <div className="relative">
                                        <AlertTriangle className="w-10 h-10 text-red-500 relative z-10" />
                                        <div className="absolute inset-0 bg-red-400 blur-xl opacity-30 animate-pulse"></div>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-red-700 dark:text-red-400 uppercase">Danger Zone</h2>
                                </div>
                                <p className="text-sm text-red-700/80 dark:text-red-300/80 mb-8 font-medium bg-red-100/50 dark:bg-red-900/20 p-4 rounded-xl">
                                    Esta área permite limpieza destructiva sobre la base de datos. Ninguna de estas acciones tiene capacidad de reversión (Deshacer).
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => openModal('audit', 'Limpiar Bitácora', 'Esta acción eliminará permanentemente todo el historial de auditoría de (audit_logs).')}
                                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-2xl border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-red-400" />
                                            Limpiar Historial Bitácora
                                        </span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70" />
                                    </button>

                                    <button
                                        onClick={() => openModal('orders', 'Limpiar Pedidos', 'Se eliminarán todas las órdenes de compra y el historial de ventas. Los productos (catálogo) e inventario se mantendrán.')}
                                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-2xl border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Database className="w-5 h-5 text-red-400" />
                                            Limpiar Pedidos y Ventas
                                        </span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70" />
                                    </button>

                                    <button
                                        onClick={() => openModal('all', 'Factory Reset', 'ESTADO CRÍTICO: Se limpiarán pedidos, ventas y toda la bitácora. Solo sobrevivirá el catálogo base y los usuarios. El sistema regresará al Día 1.')}
                                        className="mt-6 w-full flex items-center justify-between p-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black uppercase tracking-wide transition-all group/btn shadow-lg shadow-red-500/40 hover:scale-[1.02]"
                                    >
                                        Factory Reset Total
                                        <Trash2 className="w-6 h-6 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal de Confirmación Ultra-Restrictivo */}
            {
                showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-red-500/10 border border-red-100 dark:border-red-900/50"
                        >
                            <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center gap-4">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <AlertTriangle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">
                                        {modalConfig?.title}
                                    </h3>
                                    <p className="text-red-100 text-xs font-semibold">ACCIÓN IRREVERSIBLE</p>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium text-lg leading-relaxed">
                                    {modalConfig?.description}
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                                        Para confirmar y proceder, escriba <span className="text-red-600 dark:text-red-400 font-extrabold select-all tracking-wider ml-1">CONFIRMAR</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        className="w-full px-5 py-4 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-0 focus:border-red-500 outline-none text-gray-900 dark:text-white font-bold text-center uppercase text-xl placeholder-gray-300 dark:placeholder-gray-700 transition-colors"
                                        placeholder="ESCRÍBELO AQUÍ"
                                    />
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 dark:bg-gray-900 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={closeModal}
                                    className="w-full sm:w-auto px-6 py-3 font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all"
                                >
                                    Cancelar Misión
                                </button>
                                <button
                                    onClick={() => handleReset(modalConfig.type)}
                                    disabled={confirmText !== 'CONFIRMAR' || actionLoading}
                                    className={`w-full sm:w-auto px-8 py-3 font-bold text-white rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2 ${confirmText === 'CONFIRMAR' ? 'bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95' : 'bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {actionLoading ? (
                                        <span className="animate-pulse">DESTRUYENDO...</span>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            <span>Proceder</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default Bitacora;
