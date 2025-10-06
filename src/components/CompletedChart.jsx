import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { faker } from '@faker-js/faker';
import { format, subDays } from 'date-fns';

// This registers all the necessary parts of Chart.js for our mixed chart.
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

// --- Style constants from your original file ---
const COLOR_CHANGE = 'rgba(59, 130, 246, 0.22)';
const BORDER_CHANGE = 'rgba(59, 130, 246, 0.45)';
const COLOR_NOCHANGE = 'rgba(16, 185, 129, 0.22)';
const BORDER_NOCHANGE = 'rgba(16, 185, 129, 0.45)';
const COLOR_DISCARDED = 'rgba(248, 113, 113, 0.22)';
const BORDER_DISCARDED = 'rgba(248, 113, 113, 0.45)';
const COLOR_QCERS = 'rgba(99, 102, 241, 0.85)';
const BORDER_QCERS = 'rgba(99, 102, 241, 0.95)';

// --- Mock Data Generation ---
const generateMockData = () => {
  return Array.from({ length: 15 }, (_, i) => {
    const date = subDays(new Date(), 15 - i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      change: faker.number.int({ min: 200, max: 500 }),
      nochange: faker.number.int({ min: 800, max: 1500 }),
      discarded: faker.number.int({ min: 20, max: 80 }),
      qcers: faker.number.int({ min: 5, max: 12 }),
    };
  });
};

/**
 * A complex, mixed-type chart for displaying daily completed work statistics.
 * This demo version simulates the data fetch but preserves all original styling.
 */
export default function CompletedChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect simulates fetching data and then processes it for the chart.
  useEffect(() => {
    setTimeout(() => {
      const raw = generateMockData();
      const labels = raw.map((d) => d.date);
      const datasets = [];

      // This helper function dynamically builds the datasets, just like the original.
      const checkAndAdd = (
        label,
        key,
        color,
        borderColor,
        type = 'bar',
        yAxisID = 'y-left',
        stack = 'Parcels'
      ) => {
        const values = raw.map((d) => d[key]);
        if (values.some((v) => v > 0)) {
          datasets.push({
            type,
            label,
            data: values,
            ...(type === 'bar'
              ? {
                  backgroundColor: color,
                  borderColor,
                  stack,
                  yAxisID,
                  borderWidth: 2,
                  borderRadius: 7,
                  barPercentage: 0.75,
                  categoryPercentage: 0.75,
                }
              : {
                  borderColor,
                  backgroundColor: color,
                  yAxisID,
                  tension: 0.3,
                  pointRadius: 4,
                  borderWidth: 3,
                  order: 2,
                  fill: false,
                }),
          });
        }
      };

      checkAndAdd('Change', 'change', COLOR_CHANGE, BORDER_CHANGE);
      checkAndAdd('No Change', 'nochange', COLOR_NOCHANGE, BORDER_NOCHANGE);
      checkAndAdd('Discarded', 'discarded', COLOR_DISCARDED, BORDER_DISCARDED);
      checkAndAdd(
        'QCers Worked',
        'qcers',
        COLOR_QCERS,
        BORDER_QCERS,
        'line',
        'y-right'
      );

      setChartData({ labels, datasets });
      setLoading(false);
    }, 1400); // 1.4 second delay
  }, []);

  if (loading || !chartData) {
    return (
      <div className="text-center py-10 text-green-500 font-semibold animate-pulse">
        Loading Completed Chart…
      </div>
    );
  }

  // The chart options object is preserved exactly from your original code.
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#24292f', font: { size: 14, weight: 500 } },
      },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: 'Completed Parcels & QCers',
        font: { size: 18, weight: 600 },
        color: '#2a3140',
      },
    },
    scales: {
      'y-left': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Parcels',
          font: { size: 14 },
          color: '#14532d',
        },
        beginAtZero: true,
        stacked: true,
        grid: { display: false },
        ticks: { color: '#14532d', font: { size: 12 } },
      },
      'y-right': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'QCers Worked',
          font: { size: 14 },
          color: '#6366f1',
        },
        beginAtZero: true,
        grid: { display: false, drawOnChartArea: false },
        ticks: { color: '#6366f1', font: { size: 12 } },
      },
      x: {
        title: { display: true, text: 'Date', color: '#14532d' },
        ticks: {
          font: { size: 12 },
          maxRotation: 60,
          minRotation: 40,
          color: '#353a47',
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="rounded-xl shadow-xl border border-green-100 p-4 h-full"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 36px 0 rgba(30,150,30,0.12)',
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
}
