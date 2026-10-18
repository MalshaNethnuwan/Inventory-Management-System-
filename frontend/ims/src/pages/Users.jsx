import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Shield, Key, Check, UserPlus, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';

const emptyForm = { name: '', email: '', password: '', role: 'INVENTORY_MANAGER' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const fetchUsers = () => {
    api.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let tempPass = 'Temp#';
    for (let i = 0; i < 6; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, password: tempPass }));
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    generateTempPassword();
    setShowModal(true);
  };

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditId(user.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setCopiedPass(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/users/${editId}`, form);
      } else {
        await api.post('/users', form);
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="text-indigo-600 dark:text-indigo-400" size={22} /> System User Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Admin portal to provision Manager and Staff accounts, assign roles, and manage credentials.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-600/20 transition-all duration-200"
        >
          <UserPlus size={18} /> Provision New Account
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Password Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.role} />
                  </td>
                  <td className="px-6 py-4">
                    {u.mustChangePassword ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                        <Key size={12} /> Temp Password Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                        <Check size={12} /> Password Changed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        title="Edit User Role / Reset Password"
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        title="Delete User"
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-600 dark:text-indigo-400" />
                {editId ? 'Edit Account & Role' : 'Provision User Account'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="manager@company.com"
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {editId ? 'Set New Temporary Password (Optional)' : 'Temporary Password'}
                  </label>
                  {!editId && (
                    <button
                      type="button"
                      onClick={generateTempPassword}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Regenerate
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required={!editId}
                  placeholder={editId ? 'Leave blank to keep current password' : 'Enter temporary password'}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/80"
                />
                {!editId && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                    <Key size={12} /> User will be prompted to change this password on first login.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Assign System Role
                </label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="INVENTORY_MANAGER">Inventory Manager</option>
                  <option value="SALES_STAFF">Sales Staff</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2.5 text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editId ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
