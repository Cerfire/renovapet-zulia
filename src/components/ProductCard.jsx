import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, Info, Check, Pencil, Trash2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import Image from './Image';

const ProductCard = ({ product, onEdit }) => {
    const { addToCart, cart } = useCart();
    const { user } = useAuth();
    const { deleteProduct, updateProduct } = useProducts();

    const [isAdded, setIsAdded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!product) return null;

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteProduct(product.id);
        setShowDeleteConfirm(false);
    };

    const toggleFeatured = (e) => {
        e.stopPropagation();
        updateProduct(product.id, { ...product, is_featured: !product.is_featured });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:shadow-md transition-all duration-300 relative group/card">

            {/* Admin Controls - Visible on mobile, hover on desktop */}
            {user?.role === 'Gerente' && (
                <div className="absolute top-2 left-2 z-20 flex gap-2 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity">
                    <button
                        onClick={toggleFeatured}
                        className={`p-1.5 backdrop-blur rounded-lg shadow-sm transition-colors ${product.is_featured ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-white/90 dark:bg-gray-700/90 text-gray-400 hover:text-yellow-400'}`}
                        title={product.is_featured ? "Quitar de Destacados" : "Destacar"}
                    >
                        <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 bg-white/90 dark:bg-gray-700/90 backdrop-blur text-blue-600 dark:text-blue-400 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                        title="Editar"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="p-1.5 bg-white/90 dark:bg-gray-700/90 backdrop-blur text-red-500 dark:text-red-400 rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-gray-600 transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Delete Confirmation Overlay */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-30 rounded-2xl flex flex-col items-center justify-center p-4 text-center"
                    >
                        <p className="text-sm font-bold text-gray-800 dark:text-white mb-4">¿Estás seguro de eliminar este alimento?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative h-40 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden mb-4 group">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 leading-tight">{product.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-gray-700">
                <span className="text-lg font-bold text-brand-green-dark dark:text-brand-green-light">
                    ${(Number(product.price) || 0).toFixed(2)}
                </span>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddToCart}
                    className={`p-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center min-w-[44px] ${isAdded ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-brand-green-dark text-white shadow-brand-green-dark/20'}`}
                >
                    <AnimatePresence mode='wait'>
                        {isAdded ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex items-center gap-1 font-bold text-sm"
                            >
                                <Check className="w-4 h-4" />
                                <span>{quantity}</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="cart"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
};

export default ProductCard;
