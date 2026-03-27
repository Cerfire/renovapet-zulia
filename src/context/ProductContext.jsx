import React, { createContext, useContext, useState, useEffect } from 'react';
import initialDesiredProducts from '../data/products.json';
import { getAuthHeaders, getAuthToken } from './AuthContext';

const ProductContext = createContext(null);

import { toast } from 'sonner';

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user ID for Audit Logs (from localStorage to allow stand-alone usage)
    const getUserId = () => {
        const stored = localStorage.getItem('renovapet_user');
        return stored ? JSON.parse(stored).id : null;
    };

    const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
    console.log("Using API URL:", API_URL);

    const fetchProducts = async () => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/api/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            localStorage.setItem('renovapet_products', JSON.stringify(data));
        } catch (err) {
            console.warn("Backend unavailable, using offline data:", err);
            setError(err.message); // Set error message but still try fallback

            const savedProducts = localStorage.getItem('renovapet_products');
            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            } else {
                setProducts(initialDesiredProducts);
                localStorage.setItem('renovapet_products', JSON.stringify(initialDesiredProducts));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Helper to sync state and localStorage
    const updateLocalState = (newProducts) => {
        setProducts(newProducts);
        localStorage.setItem('renovapet_products', JSON.stringify(newProducts));
    };

    // Helper: Upload to Cloudinary (Bonus)
    const uploadImage = async (file) => {
        if (!file || typeof file === 'string') return file; // Already a URL or base64

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'renovapet');

        toast.loading('Subiendo imagen...', { id: 'upload-toast' });

        try {
            const cloudName = 'dq2fby6is';
            const preset = 'renovapet';

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload?upload_preset=${preset}`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Cloudinary upload failed');

            const data = await res.json();
            toast.success('Imagen subida', { id: 'upload-toast' });
            return data.secure_url;
        } catch (error) {
            console.error("Upload error, falling back to base64/local", error);
            toast.error('Error subiendo imagen, usando local', { id: 'upload-toast' });

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }
    };

    const addProduct = async (productData) => {
        // 1. Upload Image if present
        let imageUrl = productData.image;
        if (productData.image instanceof File) {
            imageUrl = await uploadImage(productData.image);
        }

        const cleanProductData = { ...productData, image: imageUrl || 'https://placehold.co/400x400?text=No+Image' };

        const tempId = Date.now();
        const optimisticProduct = {
            ...cleanProductData,
            id: tempId,
            price: parseFloat(cleanProductData.price),
            stock: parseInt(cleanProductData.stock)
        };

        // Optimistic Update
        const previousProducts = [...products];
        updateLocalState([...previousProducts, optimisticProduct]);

        try {
            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(cleanProductData)
            });

            if (response.status === 401) {
                localStorage.removeItem('renovapet_user');
                localStorage.removeItem('renovapet_token');
                window.location.href = '/login';
                return;
            }
            if (!response.ok) throw new Error('Failed to add product');

            const newProduct = await response.json();
            // Replace temp product with real one from DB
            updateLocalState([...previousProducts, newProduct]);
            toast.success('Guardado en BD');
        } catch (error) {
            console.error("API Error (Add):", error);
            // Keep optimistic update for offline mode
            toast.warning('Guardado localmente (Backend offline)');
        }
    };

    const updateProduct = async (id, updates) => {
        // 1. Upload Image if present and is a File
        let imageUrl = updates.image;
        if (updates.image instanceof File) {
            imageUrl = await uploadImage(updates.image);
        }

        const cleanUpdates = { ...updates };
        if (imageUrl) cleanUpdates.image = imageUrl;

        // Optimistic Update
        const previousProducts = [...products];
        const updatedProducts = products.map(p => p.id === id ? { ...p, ...cleanUpdates } : p);
        updateLocalState(updatedProducts);

        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(cleanUpdates)
            });
            if (res.status === 401) {
                localStorage.removeItem('renovapet_user');
                localStorage.removeItem('renovapet_token');
                window.location.href = '/login';
                return;
            }
            toast.success('Producto actualizado en BD');
        } catch (error) {
            console.error("API Error (Update):", error);
            toast.warning('Actualizado localmente (Backend offline)');
        }
    };

    const deleteProduct = async (id) => {
        // Optimistic Update
        const previousProducts = [...products];
        const filteredProducts = products.filter(p => p.id !== id);
        updateLocalState(filteredProducts);

        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.status === 401) {
                localStorage.removeItem('renovapet_user');
                localStorage.removeItem('renovapet_token');
                window.location.href = '/login';
                return;
            }
            toast.success('Producto eliminado de BD');
        } catch (error) {
            console.error("API Error (Delete):", error);
            toast.warning('Eliminado localmente (Backend offline)');
        }
    };

    const updateStock = (id, newStock) => {
        updateProduct(id, { stock: newStock });
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, updateStock, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
