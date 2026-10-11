

// import React from 'react';

// export default function DashboardCard({
//   title,
//   value,
//   icon: Icon,
//   color = 'blue',
//   subtitle,
// }) {
//   const colorThemes = {
//     blue: 'text-sky-400',
//     green: 'text-emerald-400',
//     yellow: 'text-amber-400',
//     red: 'text-rose-400',
//     purple: 'text-violet-400',
//     slate: 'text-slate-300',
//   };

//   const iconColor = colorThemes[color] || colorThemes.slate;

//   return (
//     <div className="group rounded-2xl border border-slate-700/70 bg-slate-800 p-5 transition-colors duration-200 hover:border-slate-600 hover:bg-slate-800/90">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
//             {title}
//           </p>

//           <h3 className="text-2xl font-bold tracking-tight text-slate-100">
//             {value}
//           </h3>

//           {subtitle && (
//             <p className="mt-2 text-xs font-medium text-slate-400">
//               {subtitle}
//             </p>
//           )}
//         </div>

//         <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 ${iconColor} transition-colors group-hover:border-slate-600`}>
//           <Icon size={21} strokeWidth={1.8} />
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  subtitle,
}) {
  const iconColors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-emerald-600 bg-emerald-50',
    yellow: 'text-amber-600 bg-amber-50',
    red: 'text-rose-600 bg-rose-50',
    purple: 'text-violet-600 bg-violet-50',
    slate: 'text-slate-600 bg-slate-100',
  };

  const iconStyle = iconColors[color] || iconColors.blue;

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-200 hover:border-blue-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-xs font-medium text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
