import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PawPrint, Cat, Dog } from 'lucide-react';

const TactileStockControl = ({ initialStock = 0, onChange, readOnly = false }) => {
    const [stock, setStock] = useState(initialStock);

    useEffect(() => {
        setStock(initialStock);
    }, [initialStock]);

    const handleChange = (newValue) => {
        if (readOnly) return;
        // Clamp value between 0 and 100
        const clampedValue = Math.min(100, Math.max(0, newValue));
        setStock(clampedValue);
        if (onChange) onChange(clampedValue);
    };

    const handleSliderChange = (e) => {
        handleChange(parseInt(e.target.value, 10));
    };

    const handleInputChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
            handleChange(val);
        } else if (e.target.value === '') {
            setStock(''); // Allow empty temporarily for typing
        }
    };

    const handleInputBlur = () => {
        if (stock === '' || isNaN(stock)) {
            handleChange(0);
        }
    };

    const getStatusColor = (value) => {
        // Red 0-20, Orange 21-50, Green 51-100
        if (value <= 20) return 'from-red-500 to-red-600';
        if (value <= 50) return 'from-orange-400 to-orange-500';
        return 'from-brand-green-light to-brand-green-dark';
    };

    const statusColor = getStatusColor(typeof stock === 'number' ? stock : 0);
    const displayStock = typeof stock === 'number' ? stock : 0;

    return (
        <div className="w-full p-2">
            <div className="flex justify-between mb-2 items-end">
                <div className="flex items-center gap-1 text-gray-500">
                    <PawPrint className="w-4 h-4 text-brand-green-light/50" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Stock</span>
                </div>
                {/* Numeric Input synchronized with Slider */}
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={stock}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={readOnly}
                    className={twMerge(
                        "w-16 text-right font-bold text-base bg-transparent border-b-2 outline-none transition-all duration-300 focus:border-brand-green-dark",
                        displayStock <= 20 ? "text-red-600 border-red-200" :
                            displayStock <= 50 ? "text-orange-500 border-orange-200" :
                                "text-brand-green-dark border-brand-green-light/30"
                    )}
                />
            </div>

            <div className="relative w-full h-10 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200 group touch-none">

                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTEwIDZMMTCA1TDEyIDZMMTEgN1oiLz48L3N2Zz4=')]"></div>

                {/* Animated Progress Bar */}
                <div
                    className={twMerge("absolute top-0 left-0 h-full bg-gradient-to-r transition-all duration-300 ease-out flex items-center justify-end pr-3", statusColor)}
                    style={{ width: `${Math.max(displayStock, 10)}%` }} // Ensure min width for icon visibility
                >
                    {/* Dynamic Icon inside bar */}
                    {displayStock < 50 ? <Cat className="w-5 h-5 text-white animate-pulse" /> : <Dog className="w-5 h-5 text-white" />}
                </div>

                {/* Input Range (Invisible Interactor) */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={displayStock}
                    onChange={handleSliderChange}
                    disabled={readOnly}
                    className={clsx(
                        "absolute top-0 left-0 w-full h-full opacity-0 z-20",
                        !readOnly ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed"
                    )}
                />

                {/* Custom Thumb (Visual Only) - Paw Print */}
                {!readOnly && (
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-lg border-2 border-brand-green-light pointer-events-none transition-all duration-75 ease-linear flex items-center justify-center z-10"
                        style={{ left: `calc(${displayStock}% - 18px)` }}
                    >
                        <PawPrint className={twMerge("w-5 h-5 transition-colors",
                            displayStock <= 20 ? "text-red-500" :
                                displayStock <= 50 ? "text-orange-500" :
                                    "text-brand-green-dark"
                        )} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TactileStockControl;
