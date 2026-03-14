import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, Database, Layers, Truck, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';

const Entities = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'suppliers', 'customers'
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setData([]); // Reset data first to avoid stale data crash during filter
        fetchData();
        setSearchTerm('');
    }, [activeTab]);


    const getApiEndpoint = () => {
        return `${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}/api/${activeTab}`;

    };

    const fetchData = async () => {
        try {
            const res = await fetch(getApiEndpoint());
            if (res.ok) {
                const list = await res.json();
                setData(list);
            }
        } catch (error) {
            toast.error(`Error al cargar ${activeTab}`);
        }
    };

    const handleOpenModal = (item = null) => {
        setCurrentItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            // Initialize empty form based on tab
            if (activeTab === 'categories') setFormData({ name: '', description: '' });
            if (activeTab === 'suppliers') setFormData({ name: '', contact_name: '', phone: '', email: '', address: '' });
            if (activeTab === 'customers') setFormData({ first_name: '', last_name: '', phone: '', email: '', address: '' });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este registro permanentemente?')) {
            try {
                const res = await fetch(`${getApiEndpoint()}/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Registro eliminado');
                    fetchData();
                } else {
                    const errorData = await res.json();
                    toast.error(errorData.error || 'Error al eliminar');
                }
            } catch (error) {
                toast.error('Error de conexión');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = `${getApiEndpoint()}${currentItem ? `/${currentItem.id}` : ''}`;
        const method = currentItem ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const responseData = await res.json();

            if (res.ok) {
                toast.success(`Registro ${currentItem ? 'actualizado' : 'creado'} exitosamente`);
                setIsModalOpen(false);
                fetchData();
            } else {
                if (responseData.errors) {
                    responseData.errors.forEach(err => toast.error(err.msg));
                } else {
                    toast.error(responseData.error || 'Error al guardar');
                }
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const filteredData = data.filter(item => {
        const searchStr = activeTab === 'customers'
            ? `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase()
            : (item.name || '').toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
    });


    if (user?.role !== 'Gerente') {
        return <div className="p-8 text-center text-red-500 font-bold">Acceso Denegado</div>;
    }

    const tabs = [
        { id: 'categories', label: 'Categorías', icon: <Layers className="w-4 h-4" /> },
        { id: 'suppliers', label: 'Proveedores', icon: <Truck className="w-4 h-4" /> },
        { id: 'customers', label: 'Clientes', icon: <UsersIcon className="w-4 h-4" /> }
    ];

    const getFormFields = () => {
        if (activeTab === 'categories') {
            return (
                <>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                        <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" rows="3"></textarea>
                    </div>
                </>
            );
        }
        if (activeTab === 'suppliers') {
            return (
                <>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Empresa / Nombre *</label><input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Contacto</label><input type="text" value={formData.contact_name || ''} onChange={e => setFormData({...formData, contact_name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label><input type="tel" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                    </div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label><input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                </>
            );
        }
        if (activeTab === 'customers') {
            return (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label><input required type="text" value={formData.first_name || ''} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Apellido *</label><input required type="text" value={formData.last_name || ''} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label><input type="tel" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                    </div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label><input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" /></div>
                </>
            );
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 relative min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registros Maestros</h1>
                    <p className="text-gray-500 text-sm">Administra las entidades principales del sistema.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white text-brand-green-dark shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                 <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder={`Buscar en ${tabs.find(t=>t.id===activeTab).label.toLowerCase()}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green-light/20 outline-none w-full" />
                </div>
                <button onClick={() => handleOpenModal()} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-brand-green-dark text-white rounded-xl shadow-md hover:bg-opacity-90 transition-colors font-medium">
                    <Plus className="w-4 h-4" /> Nuevo Registro
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 text-sm">
                                    {activeTab === 'customers' ? 'Nombre Cliente' : 'Nombre'}
                                </th>
                                <th className="p-4 font-semibold text-gray-600 text-sm hidden md:table-cell">
                                    {activeTab === 'categories' ? 'Descripción' : 'Contacto / Correo'}
                                </th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-400">No hay registros encontrados.</td>
                                </tr>
                            ) : (
                                filteredData.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">
                                            {activeTab === 'customers' ? `${item.first_name} ${item.last_name}` : item.name}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 hidden md:table-cell truncate max-w-xs">
                                            {activeTab === 'categories' ? item.description : (item.email || item.phone || '-')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Database className="w-5 h-5 text-brand-green-dark" />
                                {currentItem ? 'Editar Registro' : 'Nuevo Registro'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {getFormFields()}
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancelar</button>
                                <button type="submit" className="px-5 py-2 bg-brand-green-dark text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-colors">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Entities;
