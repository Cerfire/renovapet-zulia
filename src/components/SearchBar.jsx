import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    // Debounce search to simulate "AI-Like" predictive feel (smooth)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="relative w-full max-w-lg mx-auto mb-8">
            <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-green-light/20 focus:border-brand-green-light dark:focus:border-brand-green-light outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
