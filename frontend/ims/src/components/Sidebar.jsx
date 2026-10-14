import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Package, Tag, Truck,
  BarChart3, ShoppingCart, FileText, RotateCcw,
  ClipboardList, Search, Layers, Box
} from 'lucide-react';

const allMenuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_STAFF'] },
  { path: '/users', label: 'User Management', icon: Users, roles: ['ADMIN'] },
  { path: '/products', label: 'Products Catalog', icon: Package, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
  { path: '/products', label: 'Search Products', icon: Search, roles: ['SALES_STAFF'] },
  { path: '/categories', label: 'Categories', icon: Tag, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
  { path: '/suppliers', label: 'Suppliers Hub', icon: Truck, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
  { path: '/stock', label: 'Stock Overview', icon: Layers, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: ClipboardList, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
  { path: '/sales', label: 'Sales Orders', icon: ShoppingCart, roles: ['ADMIN', 'SALES_STAFF'] },
  { path: '/sales', label: 'Invoices', icon: FileText, roles: ['SALES_STAFF'] },
  { path: '/returns', label: 'Returns', icon: RotateCcw, roles: ['ADMIN', 'SALES_STAFF'] },
  { path: '/reports', label: 'Analytics & Reports', icon: BarChart3, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
];

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));
  const seen = new Set();
  const uniqueMenu = menuItems.filter(item => {
    const key = item.path + item.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <aside className="w-64 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-lg dark:shadow-2xl transition-colors duration-200">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Box size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-white text-base tracking-wide flex items-center gap-1.5">
              IMS <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">PRO</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Inventory Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Navigation
        </div>
        {uniqueMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium tracking-wide truncate">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
