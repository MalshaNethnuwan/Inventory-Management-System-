
 import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorThemes = {
    blue: {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      glow: 'hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/20',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white ',
    },
    green: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      glow: 'hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/20',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ',
    },
    yellow: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      glow: 'hover:shadow-amber-500/15 dark:hover:shadow-amber-500/20',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white ',
    },
    red: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      glow: 'hover:shadow-rose-500/15 dark:hover:shadow-rose-500/20',
      iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white ',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      glow: 'hover:shadow-purple-500/15 dark:hover:shadow-purple-500/20',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white ',
    },
  };

  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div className={`group glass-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${theme.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.iconBg} transition-transform group-hover:scale-110 duration-200`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
