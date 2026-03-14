import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, Shield, User as UserIcon, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

const Users = () => {
    const { user } = useAuth();
    const [usersList, setUsersList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({ username: '', role: 'Vendedor', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}/api/users`);
            if (res.ok) {
                const data = await res.json();
                setUsersList(data);
            }
        } catch (error) {
            toast.error('Error al cargar usuarios. Usando datos locales si están disponibles.');
        }
    };

    const handleOpenModal = (userToEdit = null) => {
        if (userToEdit) {
            setCurrentUser(userToEdit);
            setFormData({ username: userToEdit.username, role: userToEdit.role, password: '' });
        } else {
            setCurrentUser(null);
            setFormData({ username: '', role: 'Vendedor', password: '' });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este usuario permanentemente?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}/api/users/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Usuario eliminado');
                    fetchUsers();
                } else {
                    const errorData = await res.json();
                    toast.error(errorData.error || 'Error al eliminar');
                }
            } catch (error) {
                toast.error('Error de conexión');
            }
        }
    };

    const handleToggleStatus = async (userToToggle) => {
        if (userToToggle.id === 1 && userToToggle.is_active) {
            toast.error('No puedes suspender al administrador principal.');
            return;
        }

        const newStatus = !userToToggle.is_active;
        const confirmMsg = newStatus 
            ? `¿Activar cuenta de ${userToToggle.username}?` 
            : `¿Suspender cuenta de ${userToToggle.username}?`;

        if (window.confirm(confirmMsg)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}/api/users/${userToToggle.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_active: newStatus })
                });

                if (res.ok) {
                    toast.success(`Cuenta ${newStatus ? 'activada' : 'suspendida'} exitosamente`);
                    fetchUsers();
                } else {
                    const data = await res.json();
                    toast.error(data.error || 'Error al cambiar estado');
                }
            } catch (error) {
                toast.error('Error de conexión');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const usernameTrimmed = formData.username.trim();
        if (!usernameTrimmed) {
            toast.error('El nombre de usuario es obligatorio');
            return;
        }

        if (!/^[a-zA-Z0-9_.-]*$/.test(usernameTrimmed)) {
            toast.error('El usuario solo puede contener letras, números, guiones y puntos (sin espacios).');
            return;
        }

        if (!currentUser && !formData.password) {
            toast.error('La contraseña es obligatoria para nuevos usuarios');
            return;
        }

        const url = `${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}/api/users${currentUser ? `/${currentUser.id}` : ''}`;
        const method = currentUser ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Usuario ${currentUser ? 'actualizado' : 'creado'} exitosamente`);
                setIsModalOpen(false);
                fetchUsers();
            } else {
                if (data.errors) {
                    data.errors.forEach(err => toast.error(err.msg));
                } else {
                    toast.error(data.error || 'Error al guardar');
                }
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const filteredUsers = usersList.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

    if (user?.role !== 'Gerente') {
        return <div className="p-8 text-center text-red-500 font-bold">Acceso Denegado</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20 relative min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
                    <p className="text-gray-500 text-sm">Administra los accesos y roles del sistema.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green-light/20 outline-none w-full md:w-64"
                        />
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-green-dark text-white rounded-xl shadow-md hover:bg-opacity-90 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(u => (
                    <div key={u.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <img src={u.avatar} alt="avatar" className="w-12 h-12 rounded-full border border-gray-200" />
                            <div>
                                <h3 className="font-bold text-gray-800">{u.username}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'Gerente' ? 'bg-brand-green-light/20 text-brand-green-dark' : 'bg-gray-100 text-gray-600'}`}>
                                        {u.role}
                                    </span>
                                    {u.is_active === 0 ? (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Suspendido
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                                            <Unlock className="w-3 h-3" /> Activo
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleToggleStatus(u)} 
                                disabled={u.id === user.id || (u.id === 1 && u.is_active)}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${u.is_active === 0 ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                                title={u.is_active === 0 ? "Activar cuenta" : "Suspender cuenta"}
                            >
                                {u.is_active === 0 ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleOpenModal(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(u.id)} disabled={u.id === user.id || u.id === 1} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30" title="Eliminar">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-brand-green-dark" />
                                {currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Usuario *</label>
                                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Rol *</label>
                                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                                    <option value="Vendedor">Vendedor</option>
                                    <option value="Gerente">Gerente</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{currentUser ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}</label>
                                <input required={!currentUser} minLength="4" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light outline-none" />
                            </div>
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

export default Users;
