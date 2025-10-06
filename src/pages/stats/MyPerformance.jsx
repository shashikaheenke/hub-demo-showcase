import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { faker } from '@faker-js/faker';
import {
  format,
  eachDayOfInterval,
  addDays as dateFnsAddDays,
  startOfISOWeek as mondayOf,
  startOfMonth as firstOfMonth,
} from 'date-fns';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Helper Functions ---
const ymd = (d) => format(d, 'yyyy-MM-dd');
const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
const num = (n, d = 0) =>
  Number(n ?? 0).toLocaleString('en-GB', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
const sumParcels = (r) =>
  (r.plcd_parcels || 0) +
  (r.nochange_parcels || 0) +
  (r.bau_parcels || 0) +
  (r.insp_parcels || 0) +
  (r.disc_parcels || 0);

// --- Mock Data Generation ---
const generateMockHistory = (mode, from, to) => {
  const startDate = from ? new Date(from) : dateFnsAddDays(new Date(), -29);
  const endDate = to ? new Date(to) : new Date();
  const validStartDate = startDate > endDate ? endDate : startDate;
  const days = eachDayOfInterval({ start: validStartDate, end: endDate });

  const rows = days
    .map((day) => {
      if (day.getDay() === 0 || day.getDay() === 6) return null; // Skip weekends
      if (mode === 'digi') {
        const qcjobs = faker.number.int({ min: 0, max: 5 });
        return {
          day: ymd(day),
          hours: faker.number.float({ min: 7, max: 9, precision: 2 }),
          plcd_parcels: faker.number.int({ min: 20, max: 80 }),
          nochange_parcels: faker.number.int({ min: 100, max: 300 }),
          bau_parcels: faker.number.int({ min: 10, max: 50 }),
          insp_parcels: faker.number.int({ min: 0, max: 10 }),
          disc_parcels: faker.number.int({ min: 0, max: 5 }),
          qcjobs,
          pass:
            qcjobs > 0
              ? faker.number.int({ min: Math.max(0, qcjobs - 2), max: qcjobs })
              : 0,
        };
      }
      // else, 'qc' mode
      return {
        day: ymd(day),
        hours: faker.number.float({ min: 7, max: 9, precision: 2 }),
        jobs: faker.number.int({ min: 10, max: 30 }),
        fails: faker.number.int({ min: 0, max: 3 }),
        plcd_parcels: faker.number.int({ min: 20, max: 80 }),
        nochange_parcels: faker.number.int({ min: 100, max: 300 }),
        bau_parcels: faker.number.int({ min: 10, max: 50 }),
        insp_parcels: faker.number.int({ min: 0, max: 10 }),
        disc_parcels: faker.number.int({ min: 0, max: 5 }),
      };
    })
    .filter(Boolean);

  const totals = rows.reduce((acc, row) => {
    Object.keys(row).forEach((key) => {
      if (key !== 'day') acc[key] = (acc[key] || 0) + row[key];
    });
    return acc;
  }, {});

  return {
    rows,
    totals,
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };
};

// Simplified Export CSV button for the demo.
const ExportCSV = ({ from, to, mode }) => (
  <button
    onClick={() =>
      alert(
        `This would export a CSV for ${mode} performance from ${from} to ${to}.`
      )
    }
    className="px-3 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 shadow text-sm font-medium"
  >
    Export CSV
  </button>
);

/**
 * A personal performance reporting page with selectable modes (Digi/QC) and date ranges.
 * This demo is fully interactive, simulating API calls to fetch and display historical data.
 */
export default function MyPerformance() {
  const [mode, setMode] = useState('digi');
  const [from, setFrom] = useState(ymd(dateFnsAddDays(new Date(), -29)));
  const [to, setTo] = useState(ymd(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState(null);
  const [serverRange, setServerRange] = useState({ from: '', to: '' });
  const [activePreset, setActivePreset] = useState('last30');

  // For the demo, we'll assume the user can see both Digi and QC stats.
  const can = { digi: true, qc: true };

  // This function simulates fetching data based on the selected filters.
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    // Fake a 1-second network delay.
    setTimeout(() => {
      try {
        const data = generateMockHistory(mode, from, to);
        setRows(data.rows || []);
        setTotals(data.totals || null);
        setServerRange({
          from: data.from.slice(0, 10),
          to: data.to.slice(0, 10),
        });
      } catch (e) {
        setError('Failed to load performance data.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, [mode, from, to]);

  // Load initial data and reload when mode changes.
  useEffect(() => {
    load();
  }, [load]);

  // Handler for the date preset buttons.
  const applyPreset = (preset) => {
    setActivePreset(preset);
    const today = new Date();
    if (preset === 'yesterday') {
      setFrom(ymd(addDays(today, -1)));
      setTo(ymd(addDays(today, -1)));
    }
    if (preset === 'thisWeek') {
      setFrom(ymd(mondayOf(today)));
      setTo(ymd(today));
    }
    if (preset === 'lastWeek') {
      setFrom(ymd(addDays(mondayOf(today), -7)));
      setTo(ymd(addDays(mondayOf(today), -1)));
    }
    if (preset === 'thisMonth') {
      setFrom(ymd(firstOfMonth(today)));
      setTo(ymd(today));
    }
    if (preset === 'last30') {
      setFrom(ymd(addDays(today, -29)));
      setTo(ymd(today));
    }
  };

  // Defines the table columns dynamically based on the selected mode.
  const columns = useMemo(() => {
    if (mode === 'digi')
      return [
        { key: 'day', label: 'Day', fmt: fmtDay },
        { key: 'hours', label: 'Hours', fmt: (v) => num(v, 2) },
        { key: 'plcd_parcels', label: 'PLCD' },
        { key: 'nochange_parcels', label: 'NO-CHANGE' },
        { key: 'bau_parcels', label: 'CNC' },
        { key: 'insp_parcels', label: 'INSP' },
        { key: 'disc_parcels', label: 'DISCARDED' },
        { key: 'qcjobs', label: 'QC Jobs' },
        {
          key: 'quality',
          label: 'Quality %',
          compute: (r) => (r.qcjobs > 0 ? ((r.pass || 0) / r.qcjobs) * 100 : 0),
          fmt: (v) => `${num(v, 1)}%`,
        },
        { key: 'total_parcels', label: 'Total Parcels', compute: sumParcels },
      ];
    return [
      { key: 'day', label: 'Day', fmt: fmtDay },
      { key: 'hours', label: 'Hours', fmt: (v) => num(v, 2) },
      { key: 'jobs', label: 'Jobs' },
      { key: 'fails', label: 'Fails' },
      { key: 'plcd_parcels', label: 'PLCD' },
      { key: 'nochange_parcels', label: 'NO-CHANGE' },
      { key: 'bau_parcels', label: 'CNC' },
      { key: 'insp_parcels', label: 'INSP' },
      { key: 'disc_parcels', label: 'DISCARDED' },
      { key: 'total_parcels', label: 'Total Parcels', compute: sumParcels },
    ];
  }, [mode]);

  // Calculates the values for the summary cards at the top.
  const totalsCards = useMemo(() => {
    const t = totals || {};
    const qualityPct =
      (t.qcjobs || 0) > 0 ? ((t.pass || 0) / t.qcjobs) * 100 : 0;
    return {
      hours: num(t.hours || 0, 2),
      totalParcels: num(sumParcels(t), 0),
      jobs: num(t.jobs || t.qcjobs || 0, 0),
      quality: num(qualityPct, 1),
      fails: num(t.fails || 0, 0),
    };
  }, [totals]);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-hub-cyan">
            My Performance
          </h1>
          <div className="flex items-center gap-2 bg-hub-cyan-light p-1 rounded-xl">
            <button
              onClick={() => setMode('digi')}
              className={`px-3 py-1 text-sm rounded-lg ${
                mode === 'digi'
                  ? 'bg-white shadow font-semibold text-hub-cyan'
                  : 'text-slate-700 hover:bg-white/50'
              }`}
            >
              Digitiser
            </button>
            <button
              onClick={() => setMode('qc')}
              className={`px-3 py-1 text-sm rounded-lg ${
                mode === 'qc'
                  ? 'bg-white shadow font-semibold text-hub-cyan'
                  : 'text-slate-700 hover:bg-white/50'
              }`}
            >
              QC
            </button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-cyan-100 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              {['yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'last30'].map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      activePreset === p
                        ? 'bg-hub-cyan text-white shadow'
                        : 'bg-white border hover:bg-cyan-50'
                    }`}
                  >
                    {p.replace(/([A-Z])/g, ' $1')}
                  </button>
                )
              )}
            </div>
            <button
              onClick={load}
              className="ml-auto px-4 py-2 rounded-md bg-hub-cyan text-white hover:opacity-90 shadow text-sm font-medium"
            >
              Apply
            </button>
            <ExportCSV
              mode={mode}
              rows={rows}
              from={serverRange.from}
              to={serverRange.to}
            />
          </div>
        </div>

        {loading && <LoadingIndicator />}
        {error && !loading && <ErrorMessage message={error} />}
        {!loading && !error && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-hub-cyan-light border border-cyan-200/50">
                <div className="text-sm text-slate-500">Hours</div>
                <div className="text-2xl font-semibold text-hub-cyan">
                  {totalsCards.hours}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-hub-cyan-light border border-cyan-200/50">
                <div className="text-sm text-slate-500">Total Parcels</div>
                <div className="text-2xl font-semibold text-hub-cyan">
                  {totalsCards.totalParcels}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-hub-cyan-light border border-cyan-200/50">
                <div className="text-sm text-slate-500">Jobs</div>
                <div className="text-2xl font-semibold text-hub-cyan">
                  {totalsCards.jobs}
                </div>
              </div>
              {mode === 'digi' && (
                <div className="p-4 rounded-lg bg-hub-cyan-light border border-cyan-200/50">
                  <div className="text-sm text-slate-500">Quality</div>
                  <div className="text-2xl font-semibold text-hub-cyan">
                    {totalsCards.quality}%
                  </div>
                </div>
              )}
              {mode === 'qc' && (
                <div className="p-4 rounded-lg bg-hub-cyan-light border border-cyan-200/50">
                  <div className="text-sm text-slate-500">Fails</div>
                  <div className="text-2xl font-semibold text-hub-cyan">
                    {totalsCards.fails}
                  </div>
                </div>
              )}
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
              <table className="w-full text-sm text-center">
                <thead className="bg-hub-cyan-light text-hub-cyan font-semibold">
                  <tr>
                    {columns.map((c) => (
                      <th
                        key={c.key}
                        className="px-4 py-2 border-b border-gray-200 whitespace-nowrap"
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {columns.map((c) => {
                        const raw = c.compute ? c.compute(r) : r[c.key];
                        const val = c.fmt
                          ? c.fmt(raw)
                          : typeof raw === 'number'
                          ? raw.toLocaleString()
                          : raw || '';
                        return (
                          <td
                            key={c.key}
                            className="px-3 py-2 whitespace-nowrap"
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-8 text-slate-500"
                        colSpan={columns.length}
                      >
                        No data for the selected range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
