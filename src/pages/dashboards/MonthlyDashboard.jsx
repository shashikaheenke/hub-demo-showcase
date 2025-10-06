import React from 'react';
import Layout from '../../components/Layout';
import ParcelLoadTable from '../../components/ParcelLoadTable';
import ParcelStatesSummary from '../../components/ParcelStatesSummary';
import QcChart from '../../components/QcChart';
import CompletedChart from '../../components/CompletedChart';
import SLAStackedChart from '../../components/SLAStackedChart';

// A shared class string to maintain a consistent card style.
const cardClass = `
  bg-white/90 backdrop-blur-sm rounded-xl shadow-lg
  p-4 sm:p-5
  flex flex-col h-full
  min-h-[360px]
  w-full
`;

/**
 * A high-level dashboard that provides a monthly overview of production.
 * It's composed of several specialized chart and table components.
 */
export default function MonthlyDashboard() {
  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-cyan-900 tracking-tight drop-shadow">
          PLCD 2025 — Monthly Dashboard
        </h1>

        {/* This grid arranges the dashboard cards in a responsive 2-column layout. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Card 1: Parcel Load Table */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold mb-3 text-cyan-800">
              Parcel Load
            </h2>
            <ParcelLoadTable />
          </div>

          {/* Card 2: Parcel States Summary */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold mb-3 text-cyan-800">
              Parcel States Summary
            </h2>
            <ParcelStatesSummary />
          </div>

          {/* Card 3: Sent to QC Chart (full width) */}
          <div className={`md:col-span-2 ${cardClass}`}>
            <h2 className="text-xl font-bold mb-3 text-cyan-800">Sent to QC</h2>
            <QcChart />
          </div>

          {/* Card 4: Completed Chart (full width) */}
          <div className={`md:col-span-2 ${cardClass}`}>
            <h2 className="text-xl font-bold mb-3 text-green-800">Completed</h2>
            <CompletedChart />
          </div>

          {/* Card 5: SLA Chart */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold mb-3 text-cyan-800">
              Avg Days (SLA) Trend
            </h2>
            <SLAStackedChart />
          </div>
        </div>
      </div>
    </Layout>
  );
}
