import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';
import { CheckCircle, Layers } from 'lucide-react';

export default function Stock() {
  const [tab, setTab] = useState('view');
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [pending, setPending] = useState([]);
  const [adjustForm, setAdjustForm] = useState({ productId: '', adjustmentQuantity: '', reason: '' });
  const [transferForm, setTransferForm] = useState({ productId: '', quantity: '', fromLocation: '', toLocation: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/stock').then(res => setProducts(res.data));
    api.get('/stock/adjustments').then(res => setAdjustments(res.data));
    api.get('/stock/adjustments/pending').then(res => setPending(res.data));
  }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleAdjust = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/stock/adjust', {
        productId: adjustForm.productId,
        adjustmentQuantity: parseInt(adjustForm.adjustmentQuantity),
        reason: adjustForm.reason
      });
      setAdjustForm({ productId: '', adjustmentQuantity: '', reason: '' });
      api.get('/stock/adjustments/pending').then(res => setPending(res.data));
      showMsg('Adjustment submitted for approval.');
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/stock/approve/${id}`);
      api.get('/stock').then(res => setProducts(res.data));
      api.get('/stock/adjustments/pending').then(res => setPending(res.data));
      api.get('/stock/adjustments').then(res => setAdjustments(res.data));
      showMsg('Adjustment approved!');
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/stock/transfer', {
        productId: transferForm.productId,
        quantity: parseInt(transferForm.quantity),
        fromLocation: transferForm.fromLocation,
        toLocation: transferForm.toLocation
      });
      setTransferForm({ productId: '', quantity: '', fromLocation: '', toLocation: '' });
      showMsg('Transfer completed.');
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  const tabs = [
    { key: 'view', label: 'Stock View' },
    { key: 'adjust', label: 'Stock Adjustment' },
    { key: 'approve', label: `Approve (${pending.length})` },
    { key: 'transfer', label: 'Stock Transfer' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Layers className="text-indigo-600 dark:text-indigo-400" size={22} /> Stock Management
      </h2>

      {msg && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-1.5 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
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

      {/* Stock View */}
      {tab === 'view' && (
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                  <th className="px-6 py-3.5 font-medium">Code</th>
                  <th className="px-6 py-3.5 font-medium">Product</th>
                  <th className="px-6 py-3.5 font-medium">Quantity</th>
                  <th className="px-6 py-3.5 font-medium">Min Stock</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{p.productCode}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-semibold">{p.productName}</td>
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

      {/* Stock Adjustment */}
      {tab === 'adjust' && (
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 max-w-lg shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-base">Create Stock Adjustment</h3>
          <form onSubmit={handleAdjust} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Product</label>
              <select
                value={adjustForm.productId}
                onChange={e => setAdjustForm({...adjustForm, productId: e.target.value})}
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.productName} (Current: {p.quantity})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Adjustment Quantity (use negative to reduce)</label>
              <input
                type="number"
                value={adjustForm.adjustmentQuantity}
                onChange={e => setAdjustForm({...adjustForm, adjustmentQuantity: e.target.value})}
                required
                placeholder="e.g. 10 or -5"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Reason</label>
              <input
                value={adjustForm.reason}
                onChange={e => setAdjustForm({...adjustForm, reason: e.target.value})}
                required
                placeholder="e.g. Received new stock"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Adjustment'}
            </button>
          </form>
        </div>
      )}

      {/* Approve Adjustments */}
      {tab === 'approve' && (
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Pending Adjustments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                  <th className="px-6 py-3.5 font-medium">Product</th>
                  <th className="px-6 py-3.5 font-medium">Current Qty</th>
                  <th className="px-6 py-3.5 font-medium">Adjustment</th>
                  <th className="px-6 py-3.5 font-medium">Reason</th>
                  <th className="px-6 py-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {pending.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{a.productName}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{a.currentQuantity}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${a.adjustmentQuantity >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {a.adjustmentQuantity >= 0 ? '+' : ''}{a.adjustmentQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{a.reason}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleApprove(a.id)}
                        className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 transition-colors"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">No pending adjustments</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Transfer */}
      {tab === 'transfer' && (
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 max-w-lg shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-base">Stock Transfer</h3>
          <form onSubmit={handleTransfer} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Product</label>
              <select
                value={transferForm.productId}
                onChange={e => setTransferForm({...transferForm, productId: e.target.value})}
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Quantity</label>
              <input
                type="number"
                min="1"
                value={transferForm.quantity}
                onChange={e => setTransferForm({...transferForm, quantity: e.target.value})}
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">From Location</label>
              <input
                value={transferForm.fromLocation}
                onChange={e => setTransferForm({...transferForm, fromLocation: e.target.value})}
                required
                placeholder="e.g. Warehouse A"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">To Location</label>
              <input
                value={transferForm.toLocation}
                onChange={e => setTransferForm({...transferForm, toLocation: e.target.value})}
                required
                placeholder="e.g. Showroom"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Complete Transfer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
