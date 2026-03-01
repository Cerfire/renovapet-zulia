import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if redirected from protected route
    const from = location.state?.from?.pathname || "/";
    const accessDenied = location.state?.accessDenied;

    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('1234');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (accessDenied) {
            setError('Acceso Denegado: Inicia sesión primero.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    }, [accessDenied]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Credenciales incorrectas');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-green-light/10 dark:bg-brand-green-light/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green-dark/10 dark:bg-brand-green-dark/5 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    x: shake ? [-10, 10, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-gray-700 relative z-10 transition-colors duration-300"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-brand-green-dark rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-green-dark/30"
                    >
                        <span className="text-white font-bold text-2xl">R</span>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Bienvenido de nuevo</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Ingresa a tu cuenta de Renovapet Zulia</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-green-dark dark:group-focus-within:text-brand-green-light transition-colors" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-green-light/20 focus:border-brand-green-light dark:focus:border-brand-green-light outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder="Usuario"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-green-dark dark:group-focus-within:text-brand-green-light transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-green-light/20 focus:border-brand-green-light dark:focus:border-brand-green-light outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder="Contraseña"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-green-dark text-white font-medium py-3.5 rounded-xl hover:bg-opacity-90 hover:shadow-lg hover:shadow-brand-green-dark/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Ingresar</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Sistema de Gestión Interna v1.0</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
