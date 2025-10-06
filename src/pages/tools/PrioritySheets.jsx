import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { RefreshCw, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { generateMockData } from '../../data/mockPrioritySheets';

// --- Helper Data and Functions ---
// These define the structure and appearance of the data tables.
const statuses = [
  {
    code: 'IN_VISUAL_CHECKING',
    label: 'Visual Checking',
    bgColor: 'bg-amber-100',
  },
  { code: 'UNASSINGED', label: 'Unassigned', bgColor: 'bg-blue-100' },
  { code: 'ASSIGNED', label: 'Assigned', bgColor: 'bg-green-100' },
  { code: 'IN_PROGRESS', label: 'In Progress', bgColor: 'bg-purple-100' },
  { code: 'TOTAL', label: 'Total', bgColor: 'bg-yellow-100' },
  { code: 'IN_QC', label: 'In QC', bgColor: 'bg-red-100' },
  { code: 'INTERNAL_QUERY', label: 'Internal Query', bgColor: 'bg-cyan-100' },
  { code: 'IN_QUERY', label: 'In Query', bgColor: 'bg-orange-100' },
  { code: 'COMPLETED', label: 'Completed', bgColor: 'bg-gray-200' },
];
const slaStatuses = statuses.filter(
  (s) => s.code !== 'COMPLETED' && s.code !== 'INTERNAL_QUERY'
);
const getBgColorForCode = (code) =>
  statuses.find((s) => s.code === code)?.bgColor || '';
const sumFirstFour = (d) =>
  ['IN_VISUAL_CHECKING', 'UNASSINGED', 'ASSIGNED', 'IN_PROGRESS'].reduce(
    (acc, k) => {
      acc.jobs += d?.[k]?.jobs || 0;
      acc.parcels += d?.[k]?.parcels || 0;
      return acc;
    },
    { jobs: 0, parcels: 0 }
  );

/**
 * A data-heavy dashboard page for viewing the status of priority sheets.
 * This demo simulates a complex API response to populate two different types of
 * summary tables, complete with calculations and interactive collapsible sections.
 */
export default function PrioritySheets() {
  const [onlineData, setOnlineData] = useState({});
  const [slaSummary, setSlaSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshedAt, setRefreshedAt] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Simulates fetching all data for the page.
  async function loadData() {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const mockData = generateMockData();
      setOnlineData(mockData.onlineSheets);
      setSlaSummary(mockData.slaSummary);
      setRefreshedAt(new Date());
      setLoading(false);
    }, 1000);
  }

  // Load initial data on component mount.
  useEffect(() => {
    loadData();
  }, []);

  // Client-side calculation for the "Total" column in the Online Sheets table.
  const calcTotals = (sheetStats) => sumFirstFour(sheetStats);

  // Calculates the grand totals row at the bottom of the main table.
  const calcGrandTotals = (data) => {
    const totals = {};
    statuses.forEach(({ code }) => (totals[code] = { jobs: 0, parcels: 0 }));
    Object.values(data).forEach((sheetStats) => {
      statuses.forEach(({ code }) => {
        const stat =
          code === 'TOTAL' ? calcTotals(sheetStats) : sheetStats[code];
        if (stat) {
          totals[code].jobs += stat.jobs ?? 0;
          totals[code].parcels += stat.parcels ?? 0;
        }
      });
    });
    return totals;
  };

  const grandTotals = useMemo(() => calcGrandTotals(onlineData), [onlineData]);
  const sheetCount = Object.keys(onlineData).length;

  if (loading)
    return (
      <Layout>
        <div className="p-8">
          <LoadingIndicator />
        </div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="p-8">
          <ErrorMessage message={error} />
        </div>
      </Layout>
    );

  return (
    <Layout>
      {/* The sticky header now uses a soft shadow instead of a hard border. */}
      <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-cyan-700" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
                  Priority Sheets
                </h1>
                <p className="text-xs text-slate-500">
                  {sheetCount} sheets • Updated{' '}
                  {refreshedAt ? refreshedAt.toLocaleTimeString() : '—'}
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />{' '}
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ONLINE SHEETS Table */}
        <section className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-slate-800">
              Online Sheets
            </h2>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-semibold border-b border-gray-200">
                    Sheet name
                  </th>
                  {statuses.map(({ label, code, bgColor }) => (
                    <th
                      key={code}
                      colSpan={2}
                      className={`${bgColor} px-2 py-2 text-center font-semibold border-b border-l border-gray-200`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 border-b border-gray-200" />
                  {statuses.map(({ code }) => (
                    <React.Fragment key={`${code}-sub`}>
                      <th className="px-2 py-1 text-[11px] border-b border-l border-gray-200 font-normal">
                        Jobs
                      </th>
                      <th className="px-2 py-1 text-[11px] border-b border-l border-gray-200 font-normal">
                        Parcels
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(onlineData).map(([sheetName, stats], idx) => {
                  const total = calcTotals(stats);
                  return (
                    <tr
                      key={sheetName}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td
                        className={`sticky left-0 px-3 py-2 font-medium text-slate-800 bg-white`}
                      >
                        {sheetName}
                      </td>
                      {statuses.map(({ code }) => {
                        const stat = code === 'TOTAL' ? total : stats[code];
                        return (
                          <React.Fragment key={`${sheetName}-${code}`}>
                            <td className="px-2 py-1 font-semibold text-center border-l border-gray-100">
                              {stat?.jobs || ''}
                            </td>
                            <td className="px-2 py-1 text-center border-l border-gray-100">
                              {stat?.parcels || ''}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="bg-slate-100 font-bold text-slate-800">
                  <td className="sticky left-0 bg-slate-100 px-3 py-2 border-t border-gray-200">
                    Total
                  </td>
                  {statuses.map(({ code }) => (
                    <React.Fragment key={`grand-${code}`}>
                      <td className="px-2 py-1 text-center border-t border-l border-gray-200">
                        {grandTotals[code]?.jobs ?? 0}
                      </td>
                      <td className="px-2 py-1 text-center border-t border-l border-gray-200">
                        {grandTotals[code]?.parcels ?? 0}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SLA DAYS SUMMARY Section */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-800">
            SLA Days Summary
          </h2>
          {Object.entries(slaSummary).map(([sheetName, dayData]) => {
            const filteredDays = Object.entries(dayData).filter(
              ([, statusData]) =>
                slaStatuses.some(
                  ({ code }) =>
                    (statusData[code]?.jobs || 0) > 0 ||
                    (statusData[code]?.parcels || 0) > 0
                )
            );
            if (filteredDays.length === 0) return null;

            const totals = {};
            slaStatuses.forEach(({ code }) => {
              totals[code] = { jobs: 0, parcels: 0 };
            });
            filteredDays.forEach(([, statusData]) =>
              slaStatuses.forEach(({ code }) => {
                const s =
                  code === 'TOTAL'
                    ? sumFirstFour(statusData)
                    : statusData[code] || { jobs: 0, parcels: 0 };
                totals[code].jobs += s.jobs;
                totals[code].parcels += s.parcels;
              })
            );

            const isOpen = expanded[sheetName] ?? true;
            return (
              <div
                key={sheetName}
                className="rounded-2xl bg-white shadow-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpanded((e) => ({ ...e, [sheetName]: !isOpen }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(90deg)' : '' }}
                    >
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </span>
                    <span className="font-semibold text-slate-800">
                      {sheetName}
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="p-4">
                    <div className="overflow-auto rounded-lg border border-gray-200">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-700">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">
                              SLA Day
                            </th>
                            {slaStatuses.map(({ label, code }) => (
                              <th
                                key={code}
                                colSpan={2}
                                className={`${getBgColorForCode(
                                  code
                                )} px-2 py-2 text-center font-semibold border-b border-l border-gray-200`}
                              >
                                {label}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <th className="px-3 py-2 border-b border-gray-200" />
                            {slaStatuses.map(({ code }) => (
                              <React.Fragment key={`${code}-subs`}>
                                <th className="px-2 py-1 text-[11px] border-b border-l border-gray-200 font-normal">
                                  Jobs
                                </th>
                                <th className="px-2 py-1 text-[11px] border-b border-l border-gray-200 font-normal">
                                  Parcels
                                </th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDays.map(([slaDay, statusData], idx) => (
                            <tr
                              key={slaDay}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="px-3 py-2 font-medium">
                                {slaDay}
                              </td>
                              {slaStatuses.map(({ code }) => {
                                const stat =
                                  code === 'TOTAL'
                                    ? sumFirstFour(statusData)
                                    : statusData[code] || {
                                        jobs: 0,
                                        parcels: 0,
                                      };
                                return (
                                  <React.Fragment key={`${slaDay}-${code}`}>
                                    <td className="px-2 py-1 font-semibold text-center border-l border-gray-100">
                                      {stat.jobs || ''}
                                    </td>
                                    <td className="px-2 py-1 text-center border-l border-gray-100">
                                      {stat.parcels || ''}
                                    </td>
                                  </React.Fragment>
                                );
                              })}
                            </tr>
                          ))}
                          <tr className="bg-slate-100 font-bold text-slate-800">
                            <td className="px-3 py-2 border-t border-gray-200">
                              Total
                            </td>
                            {slaStatuses.map(({ code }) => (
                              <React.Fragment key={`tot-${code}`}>
                                <td className="px-2 py-1 text-center border-t border-l border-gray-200">
                                  {totals[code].jobs}
                                </td>
                                <td className="px-2 py-1 text-center border-t border-l border-gray-200">
                                  {totals[code].parcels}
                                </td>
                              </React.Fragment>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}
