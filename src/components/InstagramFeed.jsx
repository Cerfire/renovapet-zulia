import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock images using placeholders or product images for now
const mockPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400', likes: 124 },
    { id: 2, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', likes: 89 },
    { id: 3, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=400', likes: 256 },
    { id: 4, image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9205?auto=format&fit=crop&q=80&w=400', likes: 67 },
    { id: 5, image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400', likes: 142 },
    { id: 6, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400', likes: 98 },
];

const InstagramFeed = () => {
    const [posts, setPosts] = useState(mockPosts);
    const [likedPosts, setLikedPosts] = useState({});

    const handleDoubleTap = (id) => {
        handleLike(id);
    };

    const handleLike = (id) => {
        const isLiked = likedPosts[id];

        setLikedPosts(prev => ({ ...prev, [id]: !isLiked }));

        setPosts(prev => prev.map(post => {
            if (post.id === id) {
                return { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 };
            }
            return post;
        }));
    };

    return (
        <div className="py-8">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-bold text-gray-800">Comunidad Renovapet</h2>
                <button className="text-sm text-brand-green-dark font-medium hover:underline">Ver todo</button>
            </div>

            <div className="grid grid-cols-3 gap-1 md:gap-4 md:grid-cols-4 lg:grid-cols-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer group"
                        onDoubleClick={() => handleDoubleTap(post.id)}
                    >
                        <img
                            src={post.image}
                            alt="Community Post"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                            <div className="flex items-center gap-1">
                                <Heart className="w-5 h-5 fill-current" />
                                <span className="font-bold">{post.likes}</span>
                            </div>
                        </div>

                        {/* Like Heart Animation Overlay */}
                        <AnimatePresence>
                            {likedPosts[post.id] && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1.2, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <Heart className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mobile functional like indicator */}
                        <div className="absolute bottom-2 right-2 md:hidden">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm"
                            >
                                <Heart className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstagramFeed;
