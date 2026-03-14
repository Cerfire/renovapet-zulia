import React from 'react';
import Navbar from './Navbar';
import BottomDock from './BottomDock';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-transparent text-gray-900 dark:text-gray-100 font-sans relative selection:bg-brand-green-light/30 transition-colors duration-300">
            {/* Navigation - handles its own responsive layout */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>

            {/* Main Content Area */}
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-24 pb-24 md:pb-8 transition-all duration-300">
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Dock */}
            <div className="md:hidden">
                <BottomDock />
            </div>
        </div>
    );
};


export default MainLayout;
