import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = {
    ADMIN: 'Administrator',
    INVENTORY_MANAGER: 'Inventory Manager',
    SALES_STAFF: 'Sales Staff',
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-8 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          Dashboard Overview
        </h1>
        <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
          System Live
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dark / Light Mode Switcher */}
        <ThemeToggle />

        {/* Quick action notification */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 px-3 py-1.5 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-semibold text-xs">
            <User size={16} />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">{roleLabel[user?.role] || user?.role}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-xl border border-rose-500/20 transition-all duration-200 shadow-sm"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}
