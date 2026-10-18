import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import ChangePassword from '../pages/ChangePassword';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Suppliers from '../pages/Suppliers';
import Stock from '../pages/Stock';
import PurchaseOrders from '../pages/PurchaseOrders';
import Sales from '../pages/Sales';
import Invoice from '../pages/Invoice';
import Returns from '../pages/Returns';
import Reports from '../pages/Reports';
import Layout from '../components/Layout';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-300">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword) return <Navigate to="/change-password" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-300">Loading...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            user.mustChangePassword ? (
              <Navigate to="/change-password" replace />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/change-password"
        element={
          user ? <ChangePassword /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<ProtectedRoute roles={['ADMIN']}><Users /></ProtectedRoute>} />
        <Route path="products" element={<ProtectedRoute roles={['ADMIN', 'INVENTORY_MANAGER', 'SALES_STAFF']}><Products /></ProtectedRoute>} />
        <Route path="categories" element={<ProtectedRoute roles={['ADMIN', 'INVENTORY_MANAGER']}><Categories /></ProtectedRoute>} />
        <Route path="suppliers" element={<ProtectedRoute roles={['ADMIN', 'INVENTORY_MANAGER']}><Suppliers /></ProtectedRoute>} />
        <Route path="stock" element={<ProtectedRoute roles={['ADMIN', 'INVENTORY_MANAGER']}><Stock /></ProtectedRoute>} />
        <Route path="purchase-orders" element={<ProtectedRoute roles={['ADMIN', 'INVENTORY_MANAGER']}><PurchaseOrders /></ProtectedRoute>} />
        <Route path="sales" element={<ProtectedRoute roles={['ADMIN', 'SALES_STAFF']}><Sales /></ProtectedRoute>} />
        <Route path="invoice/:id" element={<ProtectedRoute roles={['ADMIN', 'SALES_STAFF', 'INVENTORY_MANAGER']}><Invoice /></ProtectedRoute>} />
        <Route path="returns" element={<ProtectedRoute roles={['ADMIN', 'SALES_STAFF']}><Returns /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute roles={['ADMIN', 'INVENTORY_MANAGER']}><Reports /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
