import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { KeyRound, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      setSuccess('Password updated successfully! Redirecting to dashboard...');
      updateUser({ mustChangePassword: false });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update password. Check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Dark/Light mode toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 border shadow-2xl glass-panel rounded-3xl border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 shadow-xl rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-amber-500/20 ring-1 ring-white/20">
              <KeyRound size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Change Password Required
            </h1>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center gap-1.5">
              <ShieldAlert size={14} /> First Login Temporary Password Update
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Welcome <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.name}</span>! For account security, you must set a new password before continuing.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-6 text-xs border text-rose-600 dark:text-rose-300 border-rose-500/30 rounded-xl bg-rose-500/10 backdrop-blur-md">
              <AlertCircle size={16} className="shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 mb-6 text-xs border text-emerald-600 dark:text-emerald-300 border-emerald-500/30 rounded-xl bg-emerald-500/10 backdrop-blur-md">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Temporary / Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  required
                  className="w-full px-4 py-3 text-sm transition-all border bg-slate-50 dark:bg-slate-900/80 border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-4 py-3 text-sm transition-all border bg-slate-50 dark:bg-slate-900/80 border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full px-4 py-3 text-sm transition-all border bg-slate-50 dark:bg-slate-900/80 border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 py-3 mt-4 text-sm font-bold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 rounded-xl shadow-amber-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
              ) : (
                <>
                  Update Password & Proceed
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
