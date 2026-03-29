import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, Trash2, Send, Package, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Image from '../components/Image';
import HeroCarousel from '../components/HeroCarousel';

const PHONE_NUMBER = "584124383334";

const ClientCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cart logic
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const product = products.find(p => p.id === productId);
                const newQty = item.quantity + delta;
                if (newQty < 1) return item;
                if (newQty > (product?.stock || 99)) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Get unique categories
    const categories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // WhatsApp checkout
    const handleWhatsAppCheckout = () => {
        if (cart.length === 0) return;
        if (!clientName.trim()) {
            alert('Por favor ingresa tu nombre para continuar.');
            return;
        }

        let message = `🐾 *¡Hola RenovaPet Zulia!*%0A%0A`;
        message += `👤 *Cliente:* ${clientName.trim()}%0A`;
        if (clientPhone.trim()) message += `📱 *Teléfono:* ${clientPhone.trim()}%0A`;
        message += `%0A🛒 *Mi pedido:*%0A%0A`;

        cart.forEach((item, index) => {
            message += `${index + 1}. 📦 *${item.name}* — Cantidad: ${item.quantity}%0A`;
        });

        message += `%0A📝 *Total de productos:* ${cart.reduce((sum, item) => sum + item.quantity, 0)} artículos%0A`;
        message += `%0A¿Tienen disponibilidad? ¡Quedo atento! 🙏✨`;

        // Confetti Dramático 🎉
        const isMobile = window.innerWidth < 768;
        const duration = isMobile ? 6000 : 3000; // 6 segundos en móviles
        const end = Date.now() + duration;
        const colors = ['#006644', '#FF5F1F', '#ffffff', '#FFD700', '#FF1493', '#00BFFF'];
        
        // Disparo inicial gigante al centro (aún más fuerte en móviles)
        confetti({ particleCount: isMobile ? 300 : 150, spread: 180, origin: { y: 0.6 }, colors });

        (function frame() {
            confetti({ particleCount: isMobile ? 25 : 15, angle: 60, spread: 80, origin: { x: 0, y: 0.8 }, colors });
            confetti({ particleCount: isMobile ? 25 : 15, angle: 120, spread: 80, origin: { x: 1, y: 0.8 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());

        window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');

        setTimeout(() => {
            setCart([]);
            setClientName('');
            setClientPhone('');
            setIsCartOpen(false);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-green-dark border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-green-dark rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">Renovapet Zulia</h1>
                            <p className="text-xs text-gray-400">Tienda de Mascotas</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2.5 bg-brand-green-dark text-white rounded-xl shadow-md hover:bg-opacity-90 transition-all"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-gradient-to-r from-brand-green-dark to-emerald-700 text-white py-10 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">🐾 Nuestros Productos</h2>
                    <p className="text-green-100 text-sm md:text-base">Encuentra lo mejor para tu mascota. ¡Haz tu pedido por WhatsApp!</p>
                </div>
            </div>

            <HeroCarousel />

            {/* Search + Filters */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-light/30 outline-none text-sm"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-brand-green-dark text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-green-light'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No se encontraron productos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => {
                            const inCart = cart.find(item => item.id === product.id);
                            const isOutOfStock = product.stock <= 0;

                            return (
                                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                                        />
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Agotado</span>
                                            </div>
                                        )}
                                        {product.stock > 0 && product.stock <= 5 && (
                                            <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                Últimas {product.stock}u
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{product.name}</h3>
                                        {product.category && (
                                            <span className="text-[10px] text-gray-400 font-medium">{product.category}</span>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-lg font-bold text-brand-green-dark">${parseFloat(product.price).toFixed(2)}</span>
                                            {inCart ? (
                                                <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                                                    <button onClick={() => inCart.quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{inCart.quantity}</span>
                                                    <button onClick={() => updateQuantity(product.id, 1)} disabled={inCart.quantity >= product.stock} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 disabled:opacity-30">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    disabled={isOutOfStock}
                                                    className="px-3 py-1.5 bg-brand-green-dark text-white text-xs font-medium rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    {isOutOfStock ? 'Agotado' : 'Agregar'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 mt-12 py-6 px-4 text-center text-sm text-gray-400">
                <p>© {new Date().getFullYear()} Renovapet Zulia — Todos los derechos reservados</p>
                <p className="mt-1">Haz tu pedido por <a href={`https://wa.me/${PHONE_NUMBER}`} target="_blank" rel="noreferrer" className="text-brand-green-dark font-medium hover:underline">WhatsApp</a></p>
            </footer>

            {/* Cart Drawer */}
            {isCartOpen && (
                <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]" onClick={() => setIsCartOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-slide-in-right">
                        {/* Cart Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-brand-green-dark" />
                                Mi Pedido
                                <span className="bg-brand-green-light/10 text-brand-green-dark text-xs py-1 px-2 rounded-full">{cartCount}</span>
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Tu pedido está vacío</p>
                                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-brand-green-dark font-medium hover:underline text-sm">
                                        Ver productos
                                    </button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                                                <p className="text-brand-green-dark font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-0.5">
                                                    <button onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cart.length > 0 && (
                            <div className="p-4 bg-white border-t border-gray-100 space-y-3 pb-8">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tu nombre *</label>
                                    <input
                                        type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green-light outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tu teléfono (opcional)</label>
                                    <input
                                        type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="0412-1234567"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green-light outline-none"
                                    />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-gray-500 text-sm">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleWhatsAppCheckout}
                                    disabled={cart.length === 0}
                                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Enviar Pedido por WhatsApp</span>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientCatalog;
