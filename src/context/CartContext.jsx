import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

import { toast } from 'sonner';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Use auth context for user info during checkout if available, 
    // or we might need it passed to checkout if it's a guest checkout flow not yet fully defined.
    // For now, we'll try to get it if possible, but won't strictly depend on it for Context initialization.
    // However, hooks inside provider body are risky if AuthProvider isn't parent. 
    // Assuming AuthProvider wraps CartProvider or we pass user data to checkout function.

    // Actually, creating a hook dependency here might be fine if structure is correct.
    // Let's safe-guard: if we use useAuth here, AuthProvider MUST be higher up.
    // Standard react pattern.

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('renovapet_cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                } else {
                    setCart([]);
                }
            }
        } catch (e) {
            console.error("Error loading cart:", e);
            setCart([]);
        }
    }, []);

    // Update total and localStorage whenever cart changes
    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
        localStorage.setItem('renovapet_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // New checkout function to create order in backend
    const checkout = async (clientData, user_id = null) => {
        if (cart.length === 0) return { error: 'Carrito vacío' };

        // Construct payload
        const orderData = {
            user_id: user_id,
            client_name: clientData.name || 'Cliente Web',
            total: total,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            dispatch_info: {
                direccion: clientData.address,
                telefono: clientData.phone,
                metodo_pago: clientData.paymentMethod
            }
        };

        const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error al procesar la orden');
            }

            const result = await response.json();

            // Backend handles stock deduction, just clear cart
            clearCart();
            toast.success(`Orden #${result.id} creada exitosamente`);
            return { success: true, id: result.id };

        } catch (error) {
            console.error("Checkout Error:", error);
            const msg = error.message === 'Failed to fetch' ? 'Error de conexión con el servidor' : error.message;
            toast.error(msg);

            // Fallback: If backend is down, maybe save to localStorage "Pending Orders"?
            return { error: msg };
        }
    };

    const generateWhatsAppLink = () => {
        const phoneNumber = "584124383334";
        let message = "¡Hola Renovapet Zulia! 🐾 Mi pedido es:%0A%0A";

        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} ($${item.price})%0A`;
        });

        message += `%0ATotal: $${total.toFixed(2)}%0A`;
        message += "¿Tienen disponibilidad?";

        return `https://wa.me/${phoneNumber}?text=${message}`;
    };

    return (
        <CartContext.Provider value={{
            cart,
            total,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            generateWhatsAppLink,
            isCartOpen,
            toggleCart,
            openCart,
            closeCart,
            checkout // Export checkout function
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
