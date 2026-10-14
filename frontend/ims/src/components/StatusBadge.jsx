import React from 'react';

const statusStyles = {
  AVAILABLE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  LOW_STOCK: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  OUT_OF_STOCK: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  APPROVED: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  COMPLETED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  ADMIN: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  INVENTORY_MANAGER: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
  SALES_STAFF: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
};

const statusLabels = {
  AVAILABLE: 'Available',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ADMIN: 'Admin',
  INVENTORY_MANAGER: 'Inv. Manager',
  SALES_STAFF: 'Sales Staff',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  const label = statusLabels[status] || status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
}
