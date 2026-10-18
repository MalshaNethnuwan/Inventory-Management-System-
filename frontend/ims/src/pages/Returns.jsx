import React, { useEffect, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import api from '../services/api';

export default function Returns() {
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [foundSale, setFoundSale] = useState(null);
  const [returnForm, setReturnForm] = useState({ productId: '', quantity: 1, reason: '' });
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => { api.get('/returns').then(res => setReturns(res.data)); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 4000); };

  const handleSearchInvoice = async () => {
    if (!invoiceSearch.trim()) return;
    setSearchError('');
    setFoundSale(null);
    try {
      const res = await api.get(`/sales/invoice/${invoiceSearch.trim()}`);
      setFoundSale(res.data);
      setReturnForm({ productId: res.data.items[0]?.productId || '', quantity: 1, reason: '' });
    } catch (err) {
      setSearchError('Invoice not found.');
    }
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/returns', {
        invoiceNumber: foundSale.invoiceNumber,
        productId: returnForm.productId,
        quantity: parseInt(returnForm.quantity),
        reason: returnForm.reason
      });
      showMsg('Return submitted successfully. Stock has been updated.');
      setFoundSale(null);
      setInvoiceSearch('');
      setReturnForm({ productId: '', quantity: 1, reason: '' });
      api.get('/returns').then(res => setReturns(res.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Error submitting return');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <RotateCcw className="text-indigo-600 dark:text-indigo-400" size={22} /> Product Returns
      </h2>

      {msg && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium">
          {msg}
        </div>
      )}

      {/* Search Invoice */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-base">Search Invoice</h3>
        <div className="flex gap-3 max-w-md">
          <input
            value={invoiceSearch}
            onChange={e => setInvoiceSearch(e.target.value)}
            placeholder="Enter Invoice Number (e.g. INV-001)"
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={e => e.key === 'Enter' && handleSearchInvoice()}
          />
          <button
            onClick={handleSearchInvoice}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Search size={16} /> Search
          </button>
        </div>
        {searchError && <p className="text-rose-600 dark:text-rose-400 text-xs mt-2 font-medium">{searchError}</p>}

        {/* Found Invoice */}
        {foundSale && (
          <div className="mt-6">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Invoice: {foundSale.invoiceNumber}</p>
              <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">Customer: {foundSale.customerName}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Date: {new Date(foundSale.saleDate).toLocaleDateString()}</p>
            </div>
            <form onSubmit={handleSubmitReturn} className="space-y-4 max-w-md text-sm">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Product to Return</label>
                <select
                  value={returnForm.productId}
                  onChange={e => setReturnForm({...returnForm, productId: e.target.value})}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Product</option>
                  {foundSale.items?.map(item => (
                    <option key={item.productId} value={item.productId}>{item.productName} (Purchased: {item.quantity})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Return Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={returnForm.quantity}
                  onChange={e => setReturnForm({...returnForm, quantity: e.target.value})}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Reason for Return</label>
                <textarea
                  value={returnForm.reason}
                  onChange={e => setReturnForm({...returnForm, reason: e.target.value})}
                  required
                  rows={2}
                  placeholder="e.g. Damaged, Wrong item, Defective..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-2.5 text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
              >
                {loading ? 'Processing...' : 'Submit Return'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Returns History */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Returns History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                <th className="px-6 py-3.5 font-medium">Invoice</th>
                <th className="px-6 py-3.5 font-medium">Product</th>
                <th className="px-6 py-3.5 font-medium">Quantity</th>
                <th className="px-6 py-3.5 font-medium">Reason</th>
                <th className="px-6 py-3.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {returns.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{r.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{r.productName}</td>
                  <td className="px-6 py-4 font-bold text-rose-600 dark:text-rose-400">{r.quantity}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{r.reason}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(r.returnDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {returns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                    No returns logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
