import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, LogOut, Sun, Moon, X as CloseIcon, Activity, Users as UsersIcon, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart, toggleCart } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState('');

    // Dark Mode Logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleCartClick = () => {
        toggleCart();
    };

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 bg-brand-green-dark rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-brand-green-dark/20">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight transition-colors">
                            Renovapet <span className="text-brand-green-light">Zulia</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {[
                            { name: 'Inicio', path: '/' },
                            { name: 'Catálogo', path: '/catalog' },
                            { name: 'Inventario', path: '/inventory' },
                            { name: 'Pedidos', path: '/orders' },
                            { name: 'Dashboard', path: '/dashboard' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="relative text-gray-600 dark:text-gray-300 hover:text-brand-green-dark dark:hover:text-brand-green-light font-medium transition-colors after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-brand-green-dark dark:after:bg-brand-green-light after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user?.role === 'Gerente' && (
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <Link
                                    to="/users"
                                    className="relative font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 text-sm"
                                    title="Gestión de Personal"
                                >
                                    <UsersIcon className="w-4 h-4" /> Personal
                                </Link>
                                <Link
                                    to="/entities"
                                    className="relative font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1 text-sm"
                                    title="Registros Maestros"
                                >
                                    <Database className="w-4 h-4" /> Registros
                                </Link>
                                <Link
                                    to="/bitacora"
                                    className="relative font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1 text-sm"
                                    title="Bitácora de Auditoría"
                                >
                                    <Activity className="w-4 h-4" /> Bitácora
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-green-dark dark:hover:text-brand-green-light hover:bg-gray-100/50 dark:hover:bg-gray-800 rounded-full transition-colors"
                            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-green-dark dark:hover:text-brand-green-light hover:bg-gray-100/50 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleCartClick}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-green-dark dark:hover:text-brand-green-light hover:bg-gray-100/50 dark:hover:bg-gray-800 rounded-full transition-colors relative group"
                            title="Ver carrito"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green-light text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 animate-bounce">
                                    {cart.reduce((a, b) => a + b.quantity, 0)}
                                </span>
                            )}
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        {user ? (
                            <div className="flex items-center gap-3 pl-1">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{user.username}</span>
                                    <span className="text-xs text-brand-green-dark dark:text-brand-green-light">{user.role}</span>
                                </div>
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover"
                                />
                                <button
                                    onClick={logout}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors ml-1"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-brand-green-dark text-white rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium">Ingresar</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Actions + Menu Button */}
                    <div className="md:hidden flex items-center gap-1">
                        {/* Dark Mode Toggle - visible on mobile */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800 rounded-full transition-colors"
                            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Cart button on mobile */}
                        <button
                            onClick={handleCartClick}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800 rounded-full transition-colors relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-green-light text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                                    {cart.reduce((a, b) => a + b.quantity, 0)}
                                </span>
                            )}
                        </button>

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300"
                        >
                            {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu (Premium) */}
            <div className={`md:hidden fixed top-16 left-0 right-0 bottom-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full overflow-y-auto pt-6 pb-24 px-6">
                    
                    {/* User Info Card (when logged in) - Moved to TOP */}
                    {user ? (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-12 h-12 rounded-full border-2 border-brand-green-light/30 object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 dark:text-white truncate">{user.username}</p>
                                <p className="text-xs text-brand-green-dark dark:text-brand-green-light font-semibold">{user.role}</p>
                            </div>
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors active:scale-95 flex-shrink-0"
                                title="Cerrar Sesión"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Salir</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full bg-brand-green-dark text-white py-4 mb-6 rounded-xl font-bold text-center shadow-lg shadow-brand-green-dark/30 block hover:bg-opacity-90 transition-all"
                        >
                            Iniciar Sesión
                        </Link>
                    )}

                    {/* Search Bar in Mobile - Functional */}
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            value={mobileSearch}
                            onChange={e => setMobileSearch(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && mobileSearch.trim()) {
                                    navigate(`/catalog?q=${encodeURIComponent(mobileSearch.trim())}`);
                                    setIsMenuOpen(false);
                                    setMobileSearch('');
                                }
                            }}
                            placeholder="Buscar producto..."
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-green-light outline-none"
                        />
                        <button
                            onClick={() => {
                                if (mobileSearch.trim()) {
                                    navigate(`/catalog?q=${encodeURIComponent(mobileSearch.trim())}`);
                                    setIsMenuOpen(false);
                                    setMobileSearch('');
                                }
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-brand-green-dark transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2 mb-8">
                        {[
                            { name: 'Inicio', path: '/' },
                            { name: 'Catálogo', path: '/catalog' },
                            { name: 'Inventario', path: '/inventory' },
                            { name: 'Pedidos', path: '/orders' },
                            { name: 'Dashboard', path: '/dashboard' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-green-light/10 text-gray-800 dark:text-gray-200 font-medium transition-all"
                            >
                                {item.name}
                                <span className="text-gray-400">→</span>
                            </Link>
                        ))}
                        {user?.role === 'Gerente' && (
                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    to="/users"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold transition-all border border-blue-100 dark:border-blue-900/30"
                                >
                                    <div className="flex items-center gap-2"><UsersIcon className="w-5 h-5" /> Personal</div>
                                    <span className="text-blue-400">→</span>
                                </Link>
                                <Link
                                    to="/entities"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold transition-all border border-purple-100 dark:border-purple-900/30"
                                >
                                    <div className="flex items-center gap-2"><Database className="w-5 h-5" /> Registros</div>
                                    <span className="text-purple-400">→</span>
                                </Link>
                                <Link
                                    to="/bitacora"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold transition-all border border-red-100 dark:border-red-900/30"
                                >
                                    <div className="flex items-center gap-2"><Activity className="w-5 h-5" /> Bitácora</div>
                                    <span className="text-red-400">→</span>
                                </Link>
                            </div>
                        )}
                    </div>


                    {/* Quick Controls Grid */}
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            onClick={toggleTheme}
                            className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl gap-2 active:scale-95 transition-transform hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            {theme === 'dark' ? <Sun className="w-6 h-6 text-orange-400" /> : <Moon className="w-6 h-6 text-indigo-500" />}
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                toggleCart();
                            }}
                            className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl gap-2 active:scale-95 transition-transform relative hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <ShoppingCart className="w-6 h-6 text-brand-green-dark dark:text-brand-green-light" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Carrito</span>
                            {cart.length > 0 && (
                                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </nav>
    );
};

export default Navbar;
