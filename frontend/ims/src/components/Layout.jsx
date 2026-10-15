import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient background glows tailored for light and dark modes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
