import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import HeroCarousel from '../components/HeroCarousel';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import InstagramFeed from '../components/InstagramFeed';

const Catalog = () => {
    const { products, loading, error, addProduct, updateProduct } = useProducts();
    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const { user } = useAuth();

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando catálogo...</div>;
    if (error) return (
        <div className="p-10 text-center text-red-500">
            <h3 className="font-bold">Error cargando productos</h3>
            <p>{error}</p>
            <p className="text-xs text-gray-400 mt-2">Intenta recargar la página.</p>
        </div>
    );

    const handleSearch = (query) => {
        if (!query) {
            setFilteredProducts(products);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            (product.category && product.category.toLowerCase().includes(lowerQuery))
        );
        setFilteredProducts(filtered);
    };

    // Keep filtered products in sync with main products list if it changes (e.g. edit/delete)
    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productData) => {
        if (currentProduct) {
            updateProduct(currentProduct.id, productData);
        } else {
            addProduct(productData);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Hero Section */}
            <HeroCarousel onEdit={handleEdit} />

            {/* Search & Filter Section */}
            <section className="px-4">
                <SearchBar onSearch={handleSearch} />
            </section>

            {/* Product Grid */}
            <section className="px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Nuestros Productos</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{filteredProducts.length} resultados</span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center text-4xl overflow-hidden grayscale opacity-50 dark:opacity-70">
                            🐶
                        </div>
                        <h3 className="text-xl font-bold text-gray-500 dark:text-gray-300 mb-2">No hay productos en inventario</h3>
                        <p className="text-gray-400 dark:text-gray-500 max-w-xs mx-auto">Parece que nos hemos quedado sin stock de todo. ¡Vuelve pronto!</p>
                        <button
                            onClick={() => handleSearch('')}
                            className="mt-6 text-brand-green-dark dark:text-brand-green-light font-bold hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </section>

            {/* Instagram Feed Simulation */}
            <section>
                <InstagramFeed />
            </section>

            {/* Edit Modal (Only for Managers ultimately, logic inside handles save) */}
            {user?.role === 'Gerente' && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProduct}
                    productToEdit={currentProduct}
                />
            )}
        </div>
    );
};

export default Catalog;
