import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { StallPage } from './pages/StallPage';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Stall page - public ha  */}
            <Route path="/stall/:slug" element={<StallPage />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/stall/burger-hub" />} />

            {/* 404 */}
            <Route path="*" element={<div className="p-8">Page not found</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;