import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Tag } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, name, role, mustChangePassword } = res.data;
      login({ name, email: res.data.email, role, mustChangePassword }, token);
      if (mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden font-sans bg-slate-950 text-slate-100">
      
      

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 border shadow-2xl glass-panel rounded-3xl border-slate-800 backdrop-blur-xl">
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 shadow-xl rounded-2xl  to-purple-500  ring-1 ring-white/20">
              <Box size={32} className="text-white" />
            </div>
            <h1 className="flex items-center justify-center gap-2 text-2xl font-black tracking-tight text-slate-100">
              IMS
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-400">Enterprise Supply Chain & Inventory Portal</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-6 text-xs border text-rose-300 border-rose-500/30 rounded-xl bg-rose-500/10 backdrop-blur-md">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ims.com"
                required
                className="w-full px-4 py-3 text-sm transition-all border bg-slate-900/80 border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 text-sm transition-all border bg-slate-900/80 border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 py-3 mt-2 text-sm font-bold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
              ) : (
                <>
                  Sign In to System
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Account Notice */}
          <div className="pt-4 mt-6 text-center border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Accounts are created by your <span className="font-semibold text-slate-200">System Administrator</span>.
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}

