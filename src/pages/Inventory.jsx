import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import TactileStockControl from '../components/TactileStockControl';
import ProductModal from '../components/ProductModal';
import { Search, Plus, Edit2, Trash2, LayoutGrid, List as ListIcon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Inventory = () => {
    const { user } = useAuth();
    const { products, updateStock, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isManager = user?.role === 'Gerente';

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            deleteProduct(id);
        }
    };

    const handleSaveProduct = (productData) => {
        if (currentProduct) {
            updateProduct(currentProduct.id, productData);
        } else {
            addProduct(productData);
        }
    };

    const openNewProductModal = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const exportToCSV = () => {
        if (products.length === 0) {
            toast.error('No hay datos para exportar');
            return;
        }

        const headers = ['ID,Nombre,Precio,Stock,Descripción,Categoría'];
        const rows = products.map(p =>
            `${p.id},"${p.name}",${p.price},${p.stock},"${p.description || ''}","${p.category || ''}"`
        );

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Inventario exportado exitosamente');
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 relative min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
                    <p className="text-gray-500 text-sm">Control de productos y stock.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto items-center">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green-light/20 outline-none w-full"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-brand-green-dark' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Vista de Cuadrícula"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-brand-green-dark' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Vista de Lista"
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={exportToCSV}
                        className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                        title="Exportar CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>

                    {isManager && (
                        <button
                            onClick={openNewProductModal}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-green-dark text-white rounded-xl shadow-md hover:bg-opacity-90 transition-colors font-medium text-sm whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nuevo</span>
                        </button>
                    )}
                </div>
            </div>

            {!isManager && (
                <div className="bg-yellow-50 text-yellow-800 text-sm p-4 rounded-xl border border-yellow-200">
                    <span className="font-bold">Vista de Solo Lectura:</span> Como Vendedor, puedes ver el stock pero no modificarlo. Contacta a un Gerente para ajustes.
                </div>
            )}

            {filteredProducts.length > 0 ? (
                <div className="min-h-[400px]">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 group relative hover:shadow-md transition-shadow">

                                    {/* Admin Actions Overlay (Visible on Hover/Focus for Managers) */}
                                    {isManager && (
                                        <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur rounded-lg p-1 shadow-sm">
                                            <button onClick={() => handleEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                            <p className="text-brand-green-dark font-bold text-sm">${Number(product.price).toFixed(2)}</p>
                                            <p className="text-xs text-gray-400 truncate mt-1">{product.description}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-50">
                                        <TactileStockControl
                                            initialStock={product.stock}
                                            onChange={(val) => updateStock(product.id, val)}
                                            readOnly={!isManager}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 font-semibold text-gray-600 text-sm w-16">Img</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm">Producto</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm text-right">Precio</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm text-center w-40">Stock</th>
                                            {isManager && <th className="p-4 font-semibold text-gray-600 text-sm text-right w-24">Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredProducts.map(product => (
                                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-medium text-gray-800">{product.name}</div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[200px] hidden sm:block">{product.description}</div>
                                                </td>
                                                <td className="p-3 text-right font-bold text-brand-green-dark">
                                                    ${Number(product.price).toFixed(2)}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-center scale-75 origin-center">
                                                        <TactileStockControl
                                                            initialStock={product.stock}
                                                            onChange={(val) => updateStock(product.id, val)}
                                                            readOnly={!isManager}
                                                            compact={true} // Assumes component can handle compact mode or styling
                                                        />
                                                    </div>
                                                </td>
                                                {isManager && (
                                                    <td className="p-3 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl overflow-hidden grayscale opacity-50">
                        🐶
                    </div>
                    <h3 className="text-xl font-bold text-gray-500 mb-2">No hay productos disponibles</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">Prueba con otro término de búsqueda o agrega un nuevo producto.</p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="mt-6 text-brand-green-dark font-bold hover:underline"
                    >
                        Limpiar búsqueda
                    </button>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={currentProduct}
            />
        </div>
    );
};

export default Inventory;
