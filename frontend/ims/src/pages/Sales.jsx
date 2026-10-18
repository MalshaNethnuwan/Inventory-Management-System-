import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
    api.get('/sales').then(res => setRecentSales(res.data.slice(-10).reverse()));
  }, []);

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    p.productCode.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    if (product.quantity === 0) { alert('Product is out of stock'); return; }
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.quantity) { alert('Not enough stock'); return; }
      setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i));
    } else {
      setCart([...cart, { productId: product.id, productName: product.productName, quantity: 1, unitPrice: product.price, total: product.price }]);
    }
  };

  const updateQty = (productId, qty) => {
    const product = products.find(p => p.id === productId);
    if (qty > product.quantity) { alert('Not enough stock'); return; }
    if (qty < 1) { removeFromCart(productId); return; }
    setCart(cart.map(i => i.productId === productId ? { ...i, quantity: qty, total: qty * i.unitPrice } : i));
  };

  const removeFromCart = (productId) => setCart(cart.filter(i => i.productId !== productId));

  const grandTotal = cart.reduce((sum, i) => sum + i.total, 0);

  const handleSale = async () => {
    if (!customerName.trim()) { alert('Please enter customer name'); return; }
    if (cart.length === 0) { alert('Cart is empty'); return; }
    setLoading(true);
    try {
      const res = await api.post('/sales', {
        customerName,
        items: cart,
        createdBy: user?.email
      });
      setSuccessMsg(`Sale created! Invoice: ${res.data.invoiceNumber}`);
      setCart([]);
      setCustomerName('');
      api.get('/sales').then(r => setRecentSales(r.data.slice(-10).reverse()));
      api.get('/products').then(r => setProducts(r.data));
      setTimeout(() => navigate(`/invoice/${res.data.id}`), 1500);
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating sale');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <ShoppingCart className="text-indigo-600 dark:text-indigo-400" size={22} /> Sales Orders & Billing
      </h2>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Search */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm">Search & Add Products</h3>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or SKU code..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.productName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono">{p.productCode}</span> · Stock: <span className="font-bold">{p.quantity}</span> · LKR {p.price?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.quantity === 0 || p.status === 'OUT_OF_STOCK'}
                    className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 text-sm">
              <ShoppingCart size={18} className="text-indigo-600 dark:text-indigo-400" /> Cart ({cart.length} items)
            </h3>
            {cart.length === 0 ? (
              <div className="text-slate-400 dark:text-slate-500 text-xs py-12 text-center">
                Your cart is empty. Add products from the explorer on the left.
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.productName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">LKR {item.unitPrice?.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateQty(item.productId, parseInt(e.target.value) || 1)}
                        className="w-14 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 text-xs text-center text-slate-900 dark:text-slate-100"
                      />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 min-w-[70px] text-right">LKR {item.total?.toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item.productId)} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
              <span>Grand Total</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">LKR {grandTotal.toLocaleString()}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
              <input
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Enter customer name / organization"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleSale}
              disabled={loading || cart.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing Transaction...' : 'Complete & Print Invoice'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Recent Sales Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left border-b border-slate-200/80 dark:border-slate-800">
                <th className="px-6 py-3.5 font-medium">Invoice</th>
                <th className="px-6 py-3.5 font-medium">Customer</th>
                <th className="px-6 py-3.5 font-medium">Items</th>
                <th className="px-6 py-3.5 font-medium">Total</th>
                <th className="px-6 py-3.5 font-medium">Date</th>
                <th className="px-6 py-3.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {recentSales.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{s.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-200">{s.customerName}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.items?.length}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">LKR {s.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(s.saleDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/invoice/${s.id}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 transition-colors"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {recentSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                    No sales recorded yet.
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
