import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';
import Image from './Image';

const CartDrawer = () => {
    const {
        cart,
        total,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        generateWhatsAppLink
    } = useCart();

    const drawerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                closeCart();
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCartOpen, closeCart]);

    const handleCheckout = () => {
        // Trigger Confetti
        const end = Date.now() + 1000;
        const colors = ['#006644', '#FF5F1F', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
                shapes: ['circle', 'square'] // Simple shapes for now, custom SVG needs more setup
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
                shapes: ['circle', 'square']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Open WhatsApp
        window.open(generateWhatsAppLink(), '_blank');

        // Close after a moment and clear (optional, maybe wait for user to confirm?)
        // For now, let's keep it open or close it? Prompt says "Feedback de Éxito: Al enviar, limpia el carrito"
        setTimeout(() => {
            clearCart();
            closeCart();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-brand-green-dark" />
                                Tu Carrito
                                <span className="bg-brand-green-light/10 text-brand-green-dark text-xs py-1 px-2 rounded-full">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                                </span>
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Tu carrito está vacío</p>
                                    <button
                                        onClick={closeCart}
                                        className="mt-4 text-brand-green-dark font-medium hover:underline"
                                    >
                                        Explorar Catálogo
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4"
                                    >
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover mix-blend-multiply"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                                                <p className="text-brand-green-dark font-bold">${item.price}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-green-dark transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-green-dark transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-4 bg-white border-t border-gray-100 pb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-500">Total Estimado</span>
                                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-brand-green-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-green-dark/20 hover:bg-opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    <span>Finalizar Pedido en WhatsApp</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
