import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, AlertTriangle, Truck, ClipboardList, ShoppingCart,
  ArrowUpRight, Activity, Users, Shield, Tag, RotateCcw, Plus, Search, FileText
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Loading workspace insights...</p>
      </div>
    );
  }

  const role = user?.role || 'SALES_STAFF';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header customized by Role */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {role.replace('_', ' ')} PORTAL
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Good to See You Again, {user?.name || 'User'} 
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'ADMIN' && 'System overview, user role management, revenue streams, and high-level controls.'}
            {role === 'INVENTORY_MANAGER' && 'Real-time telemetry, stock reorder levels, suppliers, and purchase order tracking.'}
            {role === 'SALES_STAFF' && 'Point of Sale hub, quick invoicing, product search, and returns management.'}
          </p>
        </div>
      </div>

      {/* Role-Based Quick Actions */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {role === 'ADMIN' && (
            <>
              <Link to="/users" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Users className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Manage Users</p>
                <p className="text-[10px] text-slate-500">Add Manager & Staff</p>
              </Link>
              <Link to="/products" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Package className="text-sky-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Products Catalog</p>
                <p className="text-[10px] text-slate-500">View & Edit SKUs</p>
              </Link>
              <Link to="/stock" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Activity className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Stock Audits</p>
                <p className="text-[10px] text-slate-500">Transfers & Adjustments</p>
              </Link>
              <Link to="/reports" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <FileText className="text-violet-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Analytics Reports</p>
                <p className="text-[10px] text-slate-500">Sales & Inventory Data</p>
              </Link>
            </>
          )}

          {role === 'INVENTORY_MANAGER' && (
            <>
              <Link to="/products" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Plus className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Add Product SKU</p>
                <p className="text-[10px] text-slate-500">Create new item</p>
              </Link>
              <Link to="/purchase-orders" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <ClipboardList className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Purchase Orders</p>
                <p className="text-[10px] text-slate-500">Reorder & Receive</p>
              </Link>
              <Link to="/stock" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Activity className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Stock Control</p>
                <p className="text-[10px] text-slate-500">Transfers & Adjust</p>
              </Link>
              <Link to="/suppliers" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Truck className="text-violet-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Suppliers Hub</p>
                <p className="text-[10px] text-slate-500">Manage Vendors</p>
              </Link>
            </>
          )}

          {role === 'SALES_STAFF' && (
            <>
              <Link to="/sales" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:bg-blue-50 transition-all group">
                <ShoppingCart className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">New Sale Invoice</p>
                <p className="text-[10px] text-slate-500">Create & checkout</p>
              </Link>
              <Link to="/products" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-blue-50 transition-all group">
                <Search className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Search Products</p>
                <p className="text-[10px] text-slate-500">Price & Stock Check</p>
              </Link>
              <Link to="/returns" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-500/50 hover:bg-blue-50 transition-all group">
                <RotateCcw className="text-rose-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Process Return</p>
                <p className="text-[10px] text-slate-500">Customer returns</p>
              </Link>
              <Link to="/sales" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-500/50 hover:bg-blue-50 transition-all group">
                <Tag className="text-violet-600 mb-2 group-hover:scale-110 transition-transform" size={20} />
                <p className="text-xs font-bold text-slate-700">Sales Log</p>
                <p className="text-[10px] text-slate-500">View recent orders</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <DashboardCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} color="blue" />
        <DashboardCard title="Low Stock Alerts" value={stats?.lowStockProducts ?? 0} icon={AlertTriangle} color="red" />
        <DashboardCard title="Suppliers" value={stats?.totalSuppliers ?? 0} icon={Truck} color="green" />
        <DashboardCard title="Pending POs" value={stats?.pendingPurchaseOrders ?? 0} icon={ClipboardList} color="yellow" />
        <DashboardCard
          title="Today's Sales"
          value={stats?.todaySalesCount ?? 0}
          icon={ShoppingCart}
          color="purple"
          subtitle={`LKR ${(stats?.todaySalesAmount ?? 0).toLocaleString()}`}
        />
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales Table */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <ShoppingCart size={16} className="text-indigo-400" />
              Recent Sales Orders
            </h3>
            <span className="text-xs text-slate-500 font-medium">Latest 5 sales</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-semibold tracking-wider bg-slate-900/60">
                  <th className="px-6 py-3.5">Invoice</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {(stats?.recentSales || []).slice(0, 5).map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-blue-600 font-semibold flex items-center gap-1">
                      {sale.invoiceNumber}
                      <ArrowUpRight size={12} className="opacity-60" />
                    </td>
                    <td className="px-6 py-4 text-slate-700">{sale.customerName}</td>
                    <td className="px-6 py-4 text-slate-500">{sale.items?.length ?? 0} pcs</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">LKR {sale.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(sale.saleDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!stats?.recentSales || stats.recentSales.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      No recent sales transactions recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Activities Table */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <Activity size={16} className="text-purple-400" />
              Recent Stock Movements
            </h3>
            <span className="text-xs text-slate-500 font-medium">Audited stream</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-semibold tracking-wider bg-slate-900/60">
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Adj</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {(stats?.recentStockActivities || []).slice(0, 5).map(act => (
                  <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-slate-700 font-semibold">{act.productName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${act.adjustmentQuantity >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                        {act.adjustmentQuantity >= 0 ? '+' : ''}{act.adjustmentQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-[120px]">{act.reason}</td>
                    <td className="px-6 py-4"><StatusBadge status={act.status} /></td>
                  </tr>
                ))}
                {(!stats?.recentStockActivities || stats.recentStockActivities.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      No stock movement logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
