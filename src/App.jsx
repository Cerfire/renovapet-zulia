import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Bitacora from './pages/Bitacora';
import WhatsAppFloat from './components/WhatsAppFloat';
import Users from './pages/Users';
import Entities from './pages/Entities';

import { Toaster } from 'sonner';
import CartDrawer from './components/CartDrawer';

import { useEffect } from 'react';
import { toast } from 'sonner';

function App() {
  useEffect(() => {
    const handleOffline = () => toast.error('Offline – usando cache');
    const handleOnline = () => toast.success('Conectado de nuevo');

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" richColors />
            <WhatsAppFloat />
            <CartDrawer />
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                } />
                <Route path="/catalog" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <Catalog />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/inventory" element={
                  <MainLayout>
                    <Inventory />
                  </MainLayout>
                } />
                <Route path="/dashboard" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/orders" element={
                  <MainLayout>
                    <Orders />
                  </MainLayout>
                } />
                <Route path="/bitacora" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <Bitacora />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/users" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <Users />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/entities" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <Entities />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                {/* Add more protected routes here later */}
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

