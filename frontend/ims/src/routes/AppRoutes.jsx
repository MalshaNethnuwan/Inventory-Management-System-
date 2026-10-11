import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';


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
      
    </Routes>
  );
}
