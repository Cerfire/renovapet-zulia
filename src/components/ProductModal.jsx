import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Camera, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ProductModal = ({ isOpen, onClose, onSave, productToEdit = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        imagePreview: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                ...productToEdit,
                imagePreview: productToEdit.image
            });
        } else {
            setFormData({
                name: '',
                price: '',
                stock: '',
                description: '',
                image: '',
                imagePreview: ''
            });
        }
        setErrors({});
    }, [productToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) newErrors.price = 'El precio debe ser mayor a 0';

        const stock = parseInt(formData.stock);
        if (isNaN(stock) || stock < 0) newErrors.stock = 'El stock no puede ser negativo';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Por favor corrige los errores en el formulario');
            return;
        }

        try {
            await onSave({
                ...formData,
                image: formData.imagePreview || 'https://placehold.co/400x400?text=No+Image'
            });
            toast.success(productToEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el producto');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-800">
                            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                        {/* Image Upload Area */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                                    {formData.imagePreview ? (
                                        <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <ImageIcon className="w-8 h-8 mb-1" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                </div>

                                <div className="absolute bottom-0 right-0 bg-brand-green-dark p-2 rounded-full border-4 border-white shadow-md pointer-events-none">
                                    <Camera className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {formData.imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '', imagePreview: '' }))}
                                    className="text-red-500 text-xs font-medium hover:underline flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Eliminar Imagen
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-2.5 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 bg-white placeholder-gray-400 ${errors.name ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-brand-green-light/50 focus:border-brand-green-light'}`}
                                placeholder="Ej. Juguete Hueso"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`w-full p-2.5 border rounded-xl focus:ring-2 outline-none text-gray-900 bg-white placeholder-gray-400 ${errors.price ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-brand-green-light/50'}`}
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 border rounded-xl focus:ring-2 outline-none text-gray-900 bg-white placeholder-gray-400 ${errors.stock ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-brand-green-light/50'}`}
                                />
                                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full p-2.5 border rounded-xl focus:ring-2 outline-none resize-none text-gray-900 bg-white placeholder-gray-400 ${errors.description ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-brand-green-light/50'}`}
                                placeholder="Detalles del producto..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-brand-green-dark text-white font-bold rounded-xl shadow-lg hover:bg-[#005538] transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductModal;
