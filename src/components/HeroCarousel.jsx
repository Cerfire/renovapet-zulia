import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const HeroCarousel = ({ onEdit }) => {
    const { products } = useProducts();
    const { user } = useAuth();

    // Select featured products
    const featuredProducts = products.filter(p => p.is_featured);

    if (featuredProducts.length === 0) return null;

    return (
        <div className="py-8 relative animate-fade-in md:px-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Destacados</h2>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper w-full md:w-[80%] pb-10"
            >
                {featuredProducts.map((product) => (
                    <SwiperSlide key={product.id} className="w-[280px] sm:w-[350px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700 relative group/slide">

                        {/* Admin Edit Button for Featured Items */}
                        {user?.role === 'Gerente' && onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(product);
                                }}
                                className="absolute top-2 right-2 z-20 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur text-blue-600 dark:text-blue-400 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover/slide:opacity-100 transition-opacity"
                                title="Editar Destacado"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}

                        <div className="relative h-64 overflow-hidden group">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                >
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1 shadow-black/50 drop-shadow-md">
                                        {product.name}
                                    </h3>
                                    <span className="text-brand-green-light font-bold text-xl block">${Number(product.price).toFixed(2)}</span>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroCarousel;
