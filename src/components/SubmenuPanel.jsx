import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

// This is a complete but static list of all submenus.
const subMenus = {
  Users: [
    { label: 'User Management', path: '/users' },
    { label: 'Add User', path: '/users/add' },
    { label: 'Bulk User Upload', path: '/users/bulk-upload' },
    { label: 'Time Sheet', path: '/users/timesheet' },
    { label: 'Holiday Calendar', path: '/users/leave' },
    { label: 'User Logs', path: '/users/logs-summary' },
    { label: 'Training Records', path: '/users/training' },
  ],
  Stats: [
    { label: 'Live Digi Stats', path: '/stats/livedigistats' },
    { label: 'Live QC Stats', path: '/stats/liveqcstats' },
    { label: 'My Live Digi Stats', path: '/stats/mydigistats' },
    { label: 'My Performance', path: '/stats/my-performance' },
  ],
  Tools: [
    { label: 'Priority Sheets', path: '/tools/prioritysheets' },
    { label: 'SLA Summary', path: '/tools/slasummary' },
    { label: 'Map Search', path: '/tools/mapsearch' },
    { label: 'Agreement Search', path: '/tools/agreementsearch' },
  ],
  Dashboards: [
    { label: 'PLCD Dashboard', path: '/dashboards/plcd' }, // <-- This is now a real link
    { label: 'Monthly Dashboard', path: '/dashboards/monthly' },
  ],
  'My Account': [],
  Home: [],
  MIR: [],
};

// A static representation of the "Sheets" panel that mimics the original's style.
const StaticSheetGroups = () => {
  const sheetGroups = [
    {
      displayName: 'BPS_2023_1',
      variants: [
        { key: 'digi', label: 'DIGI', path: '/sheets/digi/BPS_2023_1' },
        { key: 'qc', label: 'QC', path: '/sheets/qc/BPS_2023_1' },
        { key: 'tl', label: 'TL', path: '/sheets/tl/BPS_2023_1' },
      ],
    },
    {
      displayName: 'BPS_2023_2',
      variants: [
        { key: 'digi', label: 'DIGI', path: '/sheets/digi/BPS_2023_2' },
        { key: 'qc', label: 'QC', path: '/sheets/qc/BPS_2023_2' },
        { key: 'tl', label: 'TL', path: '/sheets/tl/BPS_2023_2' },
      ],
    },
    {
      displayName: 'PLCD',
      variants: [
        { key: 'digi', label: 'DIGI', path: '/sheets/digi/plcd' },
        { key: 'qc', label: 'QC', path: '/sheets/qc/plcd' },
        { key: 'tl', label: 'TL', path: '/sheets/tl/plcd' },
      ],
    },
  ];
  const chipClasses = {
    digi: 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200/70 text-emerald-900',
    qc: 'bg-violet-50/90 hover:bg-violet-100/90 border-violet-200/70 text-violet-900',
    tl: 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200/70 text-amber-900',
  };

  return (
    <div className="py-3 space-y-3 overflow-y-auto max-h-[90vh] px-3">
      {sheetGroups.map((sheet) => (
        <div
          key={sheet.displayName}
          className="rounded-xl border border-slate-200/80 bg-white/85 shadow-sm p-3"
        >
          <div className="px-1 pb-2 text-sm font-semibold text-slate-700 tracking-wide">
            {sheet.displayName}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sheet.variants.map((v) => (
              <Link
                key={v.key}
                to={v.path}
                className={`h-9 px-3 rounded-xl border text-xs font-semibold tracking-wide shadow-sm transition flex items-center justify-center ${
                  chipClasses[v.key]
                }`}
              >
                <span className="truncate">{v.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SubmenuPanel({ activeMenu }) {
  const items = subMenus[activeMenu] || [];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-slate-50 to-cyan-50/40 border-r border-slate-200 text-hub-cyan shadow-md">
      <div className="p-4 text-xl font-bold border-b border-slate-200">
        {activeMenu}
      </div>
      {activeMenu === 'Sheets' ? (
        <StaticSheetGroups />
      ) : (
        <ul className="py-2 space-y-2 overflow-y-auto max-h-[90vh] px-2">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="group flex items-center justify-between px-4 py-2 rounded-lg border border-slate-200/80 bg-white/80 shadow-sm transition-all duration-200 hover:bg-cyan-50/70 hover:border-cyan-300 hover:shadow-md hover:-translate-y-[1px]"
              >
                <span className="text-slate-700 group-hover:text-cyan-900">
                  {item.label}
                </span>
                <FaChevronRight className="text-slate-500 group-hover:text-cyan-700 text-sm" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
