import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Filter, Package } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyForm = { productCode: '', productName: '', description: '', price: '', quantity: '', minimumStock: '', categoryId: '', supplierId: '' };

export default function Products() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'INVENTORY_MANAGER';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = () => {
    const params = {};
    if (search) params.search = search;
    if (categoryFilter) params.categoryId = categoryFilter;
    api.get('/products').then(res => {
      let data = res.data || [];
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(p => p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q));
      }
      if (categoryFilter) {
        data = data.filter(p => p.categoryId === categoryFilter);
      }
      setProducts(data);
    });
  };

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data || []));
    api.get('/suppliers').then(res => setSuppliers(res.data || []));
  }, []);

  useEffect(() => { fetchProducts(); }, [search, categoryFilter]);

  const getCategoryName = (id) => categories.find(c => c.id === id)?.categoryName || '-';

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ productCode: p.productCode, productName: p.productName, description: p.description, price: p.price, quantity: p.quantity, minimumStock: p.minimumStock, categoryId: p.categoryId, supplierId: p.supplierId });
    setEditId(p.id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), minimumStock: parseInt(form.minimumStock) };
    try {
      if (editId) await api.put(`/products/${editId}`, payload);
      else await api.post('/products', payload);
      fetchProducts();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving product');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting product');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Package size={24} className="text-indigo-600 dark:text-indigo-400" />
            {canManage ? 'Products Catalog' : 'Product Explorer'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage SKUs, unit pricing, inventory status and reorder levels.</p>
        </div>
        {canManage && (
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all duration-200"
          >
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by SKU code or product name..."
            className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="relative sm:w-64">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 shadow-sm"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider bg-slate-50/90 dark:bg-slate-900/60">
                <th className="px-6 py-4">SKU Code</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (LKR)</th>
                <th className="px-6 py-4">Stock Qty</th>
                <th className="px-6 py-4">Status</th>
                {canManage && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 text-[11px] font-semibold">{p.productCode}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-bold">{p.productName}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{getCategoryName(p.categoryId)}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${p.quantity <= p.minimumStock ? 'text-amber-500 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {p.quantity}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">(min {p.minimumStock})</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  {canManage && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 7 : 6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    No products found matching your filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:glass-panel border border-slate-200 dark:border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{editId ? 'Edit Product Details' : 'Add New Product'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Product Code</label>
                  <input value={form.productCode} onChange={e => setForm({...form, productCode: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Product Name</label>
                  <input value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Price (LKR)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Quantity</label>
                  <input type="number" min="0" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Min Stock</label>
                  <input type="number" min="0" value={form.minimumStock} onChange={e => setForm({...form, minimumStock: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Supplier</label>
                  <select value={form.supplierId} onChange={e => setForm({...form, supplierId: e.target.value})} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-2.5 font-bold hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all">{loading ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
