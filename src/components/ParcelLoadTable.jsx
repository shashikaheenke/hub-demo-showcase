import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { format, subDays } from 'date-fns';

// --- Mock Data Generation ---
/**
 * Generates an array of realistic parcel load data for the last few days.
 * @returns {object[]} An array of data rows.
 */
const generateMockData = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const jobs = faker.number.int({ min: 50, max: 200 });
    const queried_jobs = Math.floor(
      jobs * (faker.number.int({ min: 5, max: 15 }) / 100)
    );
    return {
      date: format(date, 'yyyy-MM-dd'),
      jobs,
      parcels: faker.number.int({ min: 1000, max: 5000 }),
      queried_jobs,
    };
  });
};

/**
 * A component that displays a table of daily parcel load statistics.
 * This demo version simulates fetching this data from an API.
 */
export default function ParcelLoadTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect simulates fetching the data when the component first mounts.
  useEffect(() => {
    // Fake a network delay to show the loading state.
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 900); // A 0.9 second delay
  }, []);

  return (
    <div className="p-0">
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-cyan-500 text-base font-semibold animate-pulse">
            Loading parcel load...
          </div>
        ) : (
          <table
            className="min-w-full table-auto border-separate"
            style={{ borderSpacing: '0 0.5rem' }}
          >
            <thead>
              <tr className="bg-cyan-50 text-cyan-900 text-sm font-semibold">
                <th className="px-3 py-2 rounded-l-xl text-left">Date</th>
                <th className="px-3 py-2">No. of Jobs</th>
                <th className="px-3 py-2">Total Parcels</th>
                <th className="px-3 py-2">Queried Jobs</th>
                <th className="px-3 py-2 rounded-r-xl">Queried Job %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                // Perform the same calculations as the original component.
                const hasJobs = Number(row.jobs) > 0;
                const pct = hasJobs
                  ? (
                      (Number(row.queried_jobs) / Number(row.jobs)) *
                      100
                    ).toFixed(1)
                  : null;

                return (
                  <tr
                    key={row.date}
                    className="bg-white text-gray-700 font-medium text-sm"
                  >
                    <td className="px-3 py-2 rounded-l-xl font-mono text-gray-900">
                      {row.date}
                    </td>
                    <td className="px-3 py-2">{row.jobs.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      {row.parcels.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-orange-600">
                      {row.queried_jobs.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 rounded-r-xl">
                      {hasJobs ? `${pct}%` : '—'}
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No parcel data for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
