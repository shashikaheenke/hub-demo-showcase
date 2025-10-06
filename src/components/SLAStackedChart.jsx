import React, { useEffect, useState, useMemo } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { format, subMonths } from 'date-fns';

// Register the necessary parts of Chart.js, including the 'Filler' for area charts.
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

/**
 * Formats a "YYYY-MM" string into a prettier "Mmm YYYY" format (e.g., "Oct 2025").
 * @param {string} ym - The year-month string.
 * @returns {string} The formatted month string.
 */
function prettyMonth(ym) {
  if (!ym || !ym.includes('-')) return ym || '';
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, (m || 1) - 1, 1);
  return d.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
}

// --- Mock Data Generation ---
const generateMockData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    // Create data for each of the last 12 months.
    const date = subMonths(new Date(), 11 - i);
    return {
      Month: format(date, 'yyyy-MM'),
      AvgSLA: faker.number.float({ min: 2.5, max: 8.5, precision: 2 }),
    };
  });
};

/**
 * An area chart component displaying the average SLA days over time.
 * This demo version simulates fetching monthly data from an API.
 */
export default function SLAStackedChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect simulates fetching the chart data when the component mounts.
  useEffect(() => {
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1600); // A 1.6 second delay
  }, []);

  // useMemo ensures these calculations only re-run when the data changes.
  const labels = useMemo(() => data.map((d) => prettyMonth(d.Month)), [data]);
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Avg SLA (Days)',
          data: data.map((d) => d.AvgSLA ?? null),
          borderColor: 'rgb(13,148,136)',
          backgroundColor: 'rgba(13,148,136,0.18)',
          fill: true,
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: 'rgb(13,148,136)',
          tension: 0.25,
        },
      ],
    }),
    [labels, data]
  );

  // Chart configuration options are preserved from your original code.
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Avg SLA (Days)' },
        },
        x: { title: { display: true, text: 'Month' } },
      },
    }),
    []
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-teal-500 font-semibold animate-pulse">
        Loading SLA Chart…
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
}
