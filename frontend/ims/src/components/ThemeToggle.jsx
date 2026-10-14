import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false, size = 18 }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-200 border ${
        isDark
          ? 'text-amber-400 bg-slate-800/80 border-slate-700/80 hover:bg-slate-700 hover:text-amber-300 shadow-sm'
          : 'text-indigo-600 bg-slate-100 border-slate-200 hover:bg-slate-200/80 hover:text-indigo-700 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun
            size={size}
            className="transition-transform duration-300 rotate-0 hover:rotate-45"
          />
        ) : (
          <Moon
            size={size}
            className="transition-transform duration-300 -rotate-12 hover:rotate-0"
          />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide select-none">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
