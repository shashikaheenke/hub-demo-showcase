import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Mock Data Generation ---
const generateMockData = () => {
  return Array.from({ length: 15 }, () => {
    const jobs = faker.number.int({ min: 5, max: 20 });
    const tjobs = jobs + faker.number.int({ min: 0, max: 10 });
    const parcels = faker.number.int({ min: 50, max: 250 });
    const tparcels = parcels + faker.number.int({ min: 0, max: 50 });
    return {
      StatNameDig: `${faker.person
        .firstName()
        .slice(0, 1)}.${faker.person.lastName()}`,
      team: faker.helpers.arrayElement([
        'Team 1',
        'Team 2',
        'Team 3',
        'Quality',
      ]),
      startdate: format(faker.date.recent(), 'yyyy-MM-dd HH:mm:ss'),
      jobs,
      parcels,
      tjobs,
      tparcels,
      fails: faker.number.int({ min: 0, max: 3 }),
      sec: faker.number.int({ min: 3600, max: 28800 }), // 1 to 8 hours
      qjobs: faker.number.int({ min: 0, max: 2 }),
    };
  });
};

/**
 * A page displaying a table of live production statistics for digitisers.
 * Data is loaded from a mock data generator to simulate a real-time feed.
 */
export default function LiveDigiStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This effect simulates fetching the data when the component first mounts.
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fake a 1-second network delay.
    setTimeout(() => {
      try {
        setData(generateMockData());
      } catch (err) {
        setError('Failed to generate mock data.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

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
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-hub-cyan">
          Live Digi Stats
        </h1>
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="table-auto w-full text-sm text-center">
            <thead className="bg-hub-cyan-light text-hub-cyan font-semibold">
              <tr>
                <th className="px-4 py-2 border-b border-gray-200">
                  Digitiser ID
                </th>
                <th className="px-4 py-2 border-b border-gray-200">Team</th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Start Date
                </th>
                <th className="px-4 py-2 border-b border-gray-200">1st Jobs</th>
                <th className="px-4 py-2 border-b border-gray-200">
                  1st Parcels
                </th>
                <th className="px-4 py-2 border-b border-gray-200">2nd Jobs</th>
                <th className="px-4 py-2 border-b border-gray-200">
                  2nd Parcels
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Fail Parcels
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Hours Since Login
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Parcels per Hour
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Total Jobs
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Total Parcels
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Query Jobs
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                // Perform the same calculations as the original component.
                const hours = row.sec / 3600;
                const parcelsPerHour =
                  hours > 0 ? (row.tparcels / hours).toFixed(2) : '0.00';
                return (
                  <tr
                    key={idx}
                    className="hover:bg-hub-cyan-lighter border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-3 py-2">{row.StatNameDig}</td>
                    <td className="px-3 py-2">{row.team}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.startdate}
                    </td>
                    <td className="px-3 py-2">{row.jobs}</td>
                    <td className="px-3 py-2">{row.parcels}</td>
                    <td className="px-3 py-2">{row.tjobs - row.jobs}</td>
                    <td className="px-3 py-2">{row.tparcels - row.parcels}</td>
                    <td className="px-3 py-2">{row.fails}</td>
                    <td className="px-3 py-2">{hours.toFixed(2)}</td>
                    <td className="px-3 py-2 font-semibold text-cyan-800">
                      {parcelsPerHour}
                    </td>
                    <td className="px-3 py-2">{row.tjobs}</td>
                    <td className="px-3 py-2">{row.tparcels}</td>
                    <td className="px-3 py-2">{row.qjobs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
