import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

// --- Helper Data and Functions (from your original file) ---
const STATE_BG = {
  change: 'bg-cyan-100/60',
  nochange: 'bg-lime-100/60',
  discarded: 'bg-rose-100/60',
};
const STATE_TEXT = {
  change: 'text-cyan-800 font-medium',
  nochange: 'text-lime-800 font-medium',
  discarded: 'text-rose-800 font-medium',
};

/**
 * Calculates and formats a percentage string.
 * @param {number} value - The part.
 * @param {number} total - The whole.
 * @returns {string} The formatted percentage string (e.g., "12.3%").
 */
function pctStr(value, total) {
  if (!total || value === 0) return '–';
  const pct = (value / total) * 100;
  const s = pct.toFixed(1);
  // Removes the ".0" for whole numbers (e.g., "12.0%" becomes "12%")
  return `${s.endsWith('.0') ? s.slice(0, -2) : s}%`;
}

// --- Mock Data Generation ---
const generateMockData = () => ({
  qc: {
    change: faker.number.int({ min: 1000, max: 2000 }),
    nochange: faker.number.int({ min: 8000, max: 12000 }),
    discarded: faker.number.int({ min: 50, max: 200 }),
  },
  pp: {
    change: faker.number.int({ min: 800, max: 1500 }),
    nochange: faker.number.int({ min: 7000, max: 10000 }),
    discarded: faker.number.int({ min: 20, max: 100 }),
  },
});

/**
 * A component that displays a summary table of parcel states for QC and PP.
 * This demo version simulates fetching the summary data from an API.
 */
export default function ParcelStatesSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect simulates fetching the data when the component first mounts.
  useEffect(() => {
    // Fake a network delay to show the loading state.
    setTimeout(() => {
      setSummary(generateMockData());
      setLoading(false);
    }, 1100); // A 1.1 second delay
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white/80 p-8 text-center text-cyan-600 font-semibold animate-pulse">
        Loading summary...
      </div>
    );
  }
  if (!summary) return null;

  // All calculation logic from your original file is preserved.
  const { qc, pp } = summary;
  const totalQC = (qc.change || 0) + (qc.nochange || 0) + (qc.discarded || 0);
  const totalPP = (pp.change || 0) + (pp.nochange || 0) + (pp.discarded || 0);
  const rows = [
    { key: 'change', label: 'Change', qc: qc.change || 0, pp: pp.change || 0 },
    {
      key: 'nochange',
      label: 'No Change',
      qc: qc.nochange || 0,
      pp: pp.nochange || 0,
    },
    {
      key: 'discarded',
      label: 'Discarded',
      qc: qc.discarded || 0,
      pp: pp.discarded || 0,
    },
  ];

  return (
    <div className="rounded-3xl bg-white/70 p-6 backdrop-blur-lg overflow-x-auto">
      <table
        className="w-full border-separate"
        style={{ borderSpacing: '0 0.75rem' }}
      >
        <thead>
          <tr className="text-cyan-800 font-semibold text-sm">
            <th className="pb-2 text-left">State</th>
            <th className="pb-2 text-right">QC</th>
            <th className="pb-2 text-right">QC %</th>
            <th className="pb-2 text-right">PP</th>
            <th className="pb-2 text-right">PP %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className={`${STATE_BG[row.key]}`}>
              <td className={`rounded-l-xl pl-3 py-3 ${STATE_TEXT[row.key]}`}>
                {row.label}
              </td>
              <td
                className={`text-right px-3 py-3 font-mono font-semibold ${
                  STATE_TEXT[row.key]
                }`}
              >
                {row.qc.toLocaleString()}
              </td>
              <td
                className={`text-right px-3 py-3 font-mono ${
                  STATE_TEXT[row.key]
                }`}
              >
                {pctStr(row.qc, totalQC)}
              </td>
              <td
                className={`text-right px-3 py-3 font-mono font-semibold ${
                  STATE_TEXT[row.key]
                }`}
              >
                {row.pp.toLocaleString()}
              </td>
              <td
                className={`rounded-r-xl text-right px-3 py-3 font-mono ${
                  STATE_TEXT[row.key]
                }`}
              >
                {pctStr(row.pp, totalPP)}
              </td>
            </tr>
          ))}
          <tr className="font-bold text-cyan-900 text-base">
            <td className="pt-4">Total</td>
            <td className="pt-4 text-right font-mono text-xl">
              {totalQC.toLocaleString()}
            </td>
            <td className="pt-4"></td>
            <td className="pt-4 text-right font-mono text-xl">
              {totalPP.toLocaleString()}
            </td>
            <td className="pt-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
