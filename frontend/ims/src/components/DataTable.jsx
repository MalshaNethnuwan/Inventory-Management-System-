import React from 'react';

export default function DataTable({ columns = [], data = [], emptyMessage = 'No data available' }) {
  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 text-left border-b border-gray-200/80 dark:border-slate-800">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 font-medium ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 font-medium">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 text-gray-800 dark:text-slate-200 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-3 ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-400 dark:text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
