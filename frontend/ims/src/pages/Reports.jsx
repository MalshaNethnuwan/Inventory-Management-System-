import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';
import { BarChart3 } from 'lucide-react';

export default function Reports() {
  const [tab, setTab] = useState('sales');
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [loaded, setLoaded] = useState({});

  const loadTab = (key) => {
    if (loaded[key]) return;
    setLoaded(prev => ({ ...prev, [key]: true }));
    if (key === 'sales') api.get('/reports/sales').then(res => setSalesData(res.data));
    if (key === 'stock') api.get('/reports/stock').then(res => setStockData(res.data));
    if (key === 'purchase') api.get('/reports/purchases').then(res => setPurchaseData(res.data));
    if (key === 'lowstock') api.get('/reports/low-stock').then(res => setLowStockData(res.data));
  };

  const switchTab = (key) => { setTab(key); loadTab(key); };

  useEffect(() => { loadTab('sales'); }, []);

  const tabs = [
    { key: 'sales', label: 'Sales Report' },
    { key: 'stock', label: 'Stock Report' },
    { key: 'purchase', label: 'Purchase Report' },
    { key: 'lowstock', label: 'Low Stock Report' },
  ];

  const totalSales = salesData.reduce((s, r) => s + r.totalAmount, 0);
  const totalPurchases = purchaseData.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={22} /> Analytics & Reports
      </h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-1.5 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === t.key
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {tab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl px-4 py-3">
            <p className="text-sm text-indigo-900 dark:text-indigo-300">
              Total Sales Revenue: <span className="font-bold text-indigo-700 dark:text-indigo-200">LKR {totalSales.toLocaleString()}</span> from <span className="font-bold">{salesData.length}</span> sales
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                    <th className="px-6 py-3.5 font-medium">Invoice</th>
                    <th className="px-6 py-3.5 font-medium">Customer</th>
                    <th className="px-6 py-3.5 font-medium">Items</th>
                    <th className="px-6 py-3.5 font-medium">Total (LKR)</th>
                    <th className="px-6 py-3.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {salesData.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{s.invoiceNumber}</td>
                      <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{s.customerName}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.items?.length}</td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">{s.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(s.saleDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {salesData.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">No sales transactions available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Report */}
      {tab === 'stock' && (
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                  <th className="px-6 py-3.5 font-medium">Code</th>
                  <th className="px-6 py-3.5 font-medium">Product</th>
                  <th className="px-6 py-3.5 font-medium">Price (LKR)</th>
                  <th className="px-6 py-3.5 font-medium">Quantity</th>
                  <th className="px-6 py-3.5 font-medium">Min Stock</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {stockData.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.productCode}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{p.productName}</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">{p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-bold">{p.quantity}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{p.minimumStock}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Purchase Report */}
      {tab === 'purchase' && (
        <div className="space-y-4">
          <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl px-4 py-3">
            <p className="text-sm text-sky-900 dark:text-sky-300">
              Total Purchase Orders: <span className="font-bold">{purchaseData.length}</span> · Total Value: <span className="font-bold text-sky-700 dark:text-sky-200">LKR {totalPurchases.toLocaleString()}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                    <th className="px-6 py-3.5 font-medium">Order #</th>
                    <th className="px-6 py-3.5 font-medium">Supplier ID</th>
                    <th className="px-6 py-3.5 font-medium">Date</th>
                    <th className="px-6 py-3.5 font-medium">Items</th>
                    <th className="px-6 py-3.5 font-medium">Total (LKR)</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {purchaseData.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{o.orderNumber}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-mono">{o.supplierId}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{o.items?.length}</td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">{o.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                  {purchaseData.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">No purchase records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Report */}
      {tab === 'lowstock' && (
        <div className="space-y-4">
          {lowStockData.length > 0 && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-4 py-3">
              <p className="text-sm text-rose-800 dark:text-rose-300 font-semibold">
                ⚠️ <span className="font-bold">{lowStockData.length}</span> product(s) currently need restocking
              </p>
            </div>
          )}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                    <th className="px-6 py-3.5 font-medium">Code</th>
                    <th className="px-6 py-3.5 font-medium">Product</th>
                    <th className="px-6 py-3.5 font-medium">Current Qty</th>
                    <th className="px-6 py-3.5 font-medium">Min Stock</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {lowStockData.map(p => (
                    <tr key={p.id} className="hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.productCode}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{p.productName}</td>
                      <td className="px-6 py-4 font-bold text-rose-600 dark:text-rose-400">{p.quantity}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{p.minimumStock}</td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                  {lowStockData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ All inventory items are currently well-stocked.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
