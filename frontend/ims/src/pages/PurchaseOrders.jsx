import React, { useEffect, useState } from 'react';
import { Plus, X, Eye, CheckCircle, ClipboardList } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState([{ productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchOrders = () => api.get('/purchase-orders').then(res => setOrders(res.data));
  useEffect(() => {
    fetchOrders();
    api.get('/suppliers').then(res => setSuppliers(res.data));
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const getSupplierName = (id) => suppliers.find(s => s.id === id)?.supplierName || id;

  const addItem = () => setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    if (field === 'productId') {
      const p = products.find(pr => pr.id === value);
      if (p) { updated[i].productName = p.productName; updated[i].unitPrice = p.price; }
    }
    setItems(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/purchase-orders', { supplierId, items: items.map(it => ({ ...it, quantity: parseInt(it.quantity), unitPrice: parseFloat(it.unitPrice) })) });
      fetchOrders();
      setShowCreate(false);
      setSupplierId('');
      setItems([{ productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
      showMsg('Purchase order created.');
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    await api.post(`/purchase-orders/${id}/approve`);
    fetchOrders();
    showMsg('Order approved.');
  };

  const handleStatusUpdate = async (id, status) => {
    await api.put(`/purchase-orders/${id}`, { status });
    fetchOrders();
  };

  const totalOfItems = items.reduce((sum, it) => sum + (parseFloat(it.unitPrice) || 0) * (parseInt(it.quantity) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ClipboardList className="text-indigo-600 dark:text-indigo-400" size={22} /> Purchase Orders
        </h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus size={16} /> Create Order
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium">
          {msg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                <th className="px-6 py-3.5 font-medium">Order #</th>
                <th className="px-6 py-3.5 font-medium">Supplier</th>
                <th className="px-6 py-3.5 font-medium">Date</th>
                <th className="px-6 py-3.5 font-medium">Items</th>
                <th className="px-6 py-3.5 font-medium">Total (LKR)</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{o.orderNumber}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{getSupplierName(o.supplierId)}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{o.items?.length ?? 0}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">{o.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 items-center justify-end">
                      <button onClick={() => setShowDetail(o)} className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Eye size={16} />
                      </button>
                      {o.status === 'PENDING' && (
                        <button onClick={() => handleApprove(o.id)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      {o.status === 'APPROVED' && (
                        <button onClick={() => handleStatusUpdate(o.id, 'COMPLETED')} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
                          Complete
                        </button>
                      )}
                      {(o.status === 'PENDING' || o.status === 'APPROVED') && (
                        <button onClick={() => handleStatusUpdate(o.id, 'CANCELLED')} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 font-semibold">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Create Purchase Order</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">Supplier</label>
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Items</label>
                  <button type="button" onClick={addItem} className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:text-indigo-700">+ Add Item</button>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <select value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)} required className="col-span-5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
                    </select>
                    <input type="number" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" required className="col-span-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', e.target.value)} placeholder="Price" required className="col-span-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <div className="col-span-1 text-xs text-slate-500 dark:text-slate-400 font-mono">{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}</div>
                    {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="col-span-1 text-rose-500 hover:text-rose-700"><X size={15} /></button>}
                  </div>
                ))}
              </div>
              <div className="text-right text-sm font-bold text-slate-900 dark:text-slate-100">
                Total: LKR {totalOfItems.toLocaleString()}
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors">{loading ? 'Creating...' : 'Create Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Order {showDetail.orderNumber}</h3>
              <button onClick={() => setShowDetail(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Supplier:</span><span className="font-semibold text-slate-900 dark:text-slate-100">{getSupplierName(showDetail.supplierId)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Date:</span><span className="text-slate-700 dark:text-slate-300">{new Date(showDetail.orderDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Status:</span><StatusBadge status={showDetail.status} /></div>
              <hr className="border-slate-200 dark:border-slate-800" />
              <table className="w-full text-xs">
                <thead><tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800"><th className="text-left py-2">Product</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {showDetail.items?.map((item, i) => (
                    <tr key={i}><td className="py-2.5 text-slate-900 dark:text-slate-100">{item.productName}</td><td className="text-right text-slate-700 dark:text-slate-300">{item.quantity}</td><td className="text-right text-slate-700 dark:text-slate-300">{item.unitPrice?.toLocaleString()}</td><td className="text-right text-emerald-600 dark:text-emerald-400 font-semibold">{item.total?.toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-3 border-t border-slate-200 dark:border-slate-800 text-sm">
                <span>Grand Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">LKR {showDetail.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
