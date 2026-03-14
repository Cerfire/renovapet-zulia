import React, { useState, useEffect } from 'react';
import { Printer, Check, Clock, Package, Download, Edit2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

const OrderEditModal = ({ order, isOpen, onClose, onSave }) => {
    if (!isOpen || !order) return null;

    const [formData, setFormData] = useState({
        client_name: '',
        total: '',
        dispatch_info: { direccion: '', telefono: '', metodo_pago: '' },
        status: ''
    });

    useEffect(() => {
        if (order) {
            let parsedDispatch = { direccion: '', telefono: '', metodo_pago: '' };
            try {
                parsedDispatch = typeof order.dispatch_info === 'string'
                    ? JSON.parse(order.dispatch_info)
                    : order.dispatch_info || parsedDispatch;
            } catch (e) { console.error(e); }

            setFormData({
                client_name: order.client_name,
                total: order.total,
                dispatch_info: parsedDispatch,
                status: order.status
            });
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('dispatch_')) {
            const field = name.replace('dispatch_', '');
            setFormData(prev => ({
                ...prev,
                dispatch_info: { ...prev.dispatch_info, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(order.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Editar Orden #{order.id}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                        <input
                            type="text"
                            name="client_name"
                            required
                            value={formData.client_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light outline-none text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total</label>
                            <input
                                type="number"
                                name="total"
                                required
                                min="0.01"
                                step="0.01"
                                value={formData.total}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light outline-none text-gray-900 dark:text-white"
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Despachado">Despachado</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white">Datos de Despacho</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                            <input
                                type="text"
                                name="dispatch_direccion"
                                required
                                value={formData.dispatch_info.direccion || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    name="dispatch_telefono"
                                    required
                                    value={formData.dispatch_info.telefono || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light outline-none text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Método Pago</label>
                                <input
                                    type="text"
                                    name="dispatch_metodo_pago"
                                    value={formData.dispatch_info.metodo_pago || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light outline-none text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-green-dark text-white font-medium rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Pendiente'); // 'Pendiente' | 'Despachado'
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/api/orders`);
            if (!response.ok) throw new Error('Error al cargar órdenes');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error('No se pudieron cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDispatch = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/orders/${id}/dispatch`, {
                method: 'PUT'
            });
            if (!response.ok) throw new Error('Error al despachar');

            toast.success('Orden marcada como despachada');
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Despachado' } : o));
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar estado');
        }
    };

    const handleEditClick = (order) => {
        setCurrentOrder(order);
        setEditModalOpen(true);
    };

    const handleSaveOrder = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Error al actualizar');

            toast.success('Orden actualizada correctamente');

            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
            setEditModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar cambios');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const exportToCSV = () => {
        if (orders.length === 0) {
            toast.error('No hay pedidos para exportar');
            return;
        }

        // BOM for UTF-8 in Excel
        const BOM = "\uFEFF";
        const headers = ["ID", "Cliente", "Fecha", "Total", "Estado", "Usuario"];

        // Use semicolon for Spanish Excel compatibility
        const csvRows = [headers.join(';')];

        orders.forEach(o => {
            const row = [
                o.id,
                `"${o.client_name}"`, // Quote strings
                `"${new Date(o.created_at).toLocaleString()}"`,
                o.total,
                `"${o.status}"`,
                `"${o.username || 'Invitado'}"`
            ];
            csvRows.push(row.join(';'));
        });

        const csvContent = BOM + csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `RENOVAPET_ORDENES_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Pedidos exportados en formato Excel');
    };

    const filteredOrders = orders.filter(order => order.status === activeTab);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando pedidos...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos y Despachos</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={exportToCSV}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors print:hidden"
                    >
                        <Printer className="w-4 h-4" />
                        Imprimir
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 print:hidden">
                <button
                    onClick={() => setActiveTab('Pendiente')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'Pendiente'
                        ? 'text-brand-green-dark dark:text-brand-green-light'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                >
                    Pendientes
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                        {orders.filter(o => o.status === 'Pendiente').length}
                    </span>
                    {activeTab === 'Pendiente' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green-dark dark:bg-brand-green-light rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('Despachado')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'Despachado'
                        ? 'text-brand-green-dark dark:text-brand-green-light'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                >
                    Despachados
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {orders.filter(o => o.status === 'Despachado').length}
                    </span>
                    {activeTab === 'Despachado' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green-dark dark:bg-brand-green-light rounded-t-full" />
                    )}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden print:shadow-none print:border-0">
                {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center">
                        <Package className="w-12 h-12 mb-4 opacity-50" />
                        <p>No hay pedidos {activeTab.toLowerCase()}s.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 print:bg-white print:border-black">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">ID</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Cliente</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Fecha</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Total</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Estado</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm text-right print:hidden">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors print:hover:bg-transparent">
                                        <td className="p-4 text-sm text-gray-900 dark:text-white">#{order.id}</td>
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-200 font-medium">
                                            {order.client_name}
                                            <div className="text-xs text-gray-400">{order.username ? `(User: ${order.username})` : '(Invitado)'}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">${parseFloat(order.total).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Despachado'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {order.status === 'Despachado' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right print:hidden">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(order)}
                                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {order.status !== 'Despachado' && (
                                                    <button
                                                        onClick={() => handleDispatch(order.id)}
                                                        className="px-3 py-1.5 bg-brand-green-dark text-white text-xs font-medium rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
                                                    >
                                                        Despachar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <OrderEditModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                order={currentOrder}
                onSave={handleSaveOrder}
            />

            {/* Print Footer */}
            <div className="hidden print:block mt-8 text-center text-sm text-gray-500 border-t pt-4">
                <p>Renovapet Zulia - Reporte de Pedidos</p>
                <p>Generado el {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default Orders;
