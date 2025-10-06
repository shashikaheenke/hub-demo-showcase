import React, { useEffect, useState, useCallback } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { useSpring, animated } from '@react-spring/web';

// --- Helper Data ---
const SESSION_STATS = [
  { key: 'jobs', label: '1st Jobs' },
  { key: 'parcels', label: '1st Parcels' },
  { key: 'tjobs2', label: '2nd Jobs' },
  { key: 'tparcels2', label: '2nd Parcels' },
  { key: 'tjobs', label: 'Total Jobs' },
  { key: 'tparcels', label: 'Total Parcels' },
];
const OTHER_STATS = [
  { key: 'qjobs', label: 'Query Jobs' },
  { key: 'fails', label: 'Fail Parcels' },
  { key: 'hours', label: 'Hours Since Login' },
  { key: 'pph', label: 'Parcels / Hour' },
];

// --- Mock Data Generation ---
const generateMockStats = () => {
  const jobs = faker.number.int({ min: 5, max: 15 });
  const parcels = faker.number.int({ min: 50, max: 150 });
  const tjobs = jobs + faker.number.int({ min: 1, max: 10 });
  const tparcels = parcels + faker.number.int({ min: 10, max: 80 });
  return {
    jobs,
    parcels,
    tjobs,
    tparcels,
    qjobs: faker.number.int({ min: 0, max: 3 }),
    fails: faker.number.int({ min: 0, max: 2 }),
    sec: faker.number.int({ min: 3600, max: 28800 }), // 1 to 8 hours
  };
};

/**
 * A "live" dashboard displaying personal digi stats for the current session.
 * This demo version simulates the live-updating data with an interval,
 * triggering the smooth count-up animations for each stat card.
 */
export default function MyDigiStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function simulates fetching fresh stats from the backend.
  const fetchStats = useCallback(() => {
    // We don't set loading to true on interval refreshes for a smoother UX.
    setTimeout(() => {
      try {
        setData(generateMockStats());
        setError(null);
      } catch (e) {
        setError('Failed to generate mock stats.');
      } finally {
        setLoading(false);
      }
    }, 600);
  }, []);

  // This effect fetches the initial data and then sets up an interval
  // to re-fetch every 60 seconds, just like the original.
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

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
  if (!data)
    return (
      <Layout>
        <p className="p-6">No stats available for you today.</p>
      </Layout>
    );

  // All client-side calculations are preserved from the original component.
  const hours = data.sec / 3600;
  const tjobs2 = data.tjobs - data.jobs;
  const tparcels2 = data.tparcels - data.parcels;
  const pph = hours > 0 ? data.tparcels / hours : 0;
  const statValues = {
    ...data,
    tjobs2,
    tparcels2,
    hours: hours.toFixed(2),
    pph: pph.toFixed(2),
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-hub-cyan text-center">
          My Live Digi Stats
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          {SESSION_STATS.map(({ key, label }) => (
            <StatCard key={key} label={label} value={statValues[key]} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {OTHER_STATS.map(({ key, label }) => (
            <StatCard key={key} label={label} value={statValues[key]} />
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center mt-8">
          Stats refresh every 60 seconds.
        </div>
      </div>
    </Layout>
  );
}

/**
 * A reusable card component that displays a single statistic with a
 * smooth count-up animation powered by React Spring.
 */
function StatCard({ label, value }) {
  // useSpring provides a 'number' object that we can animate.
  const { number } = useSpring({
    from: { number: 0 },
    number: Number(value) || 0,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  const isDecimal = typeof value === 'string' && value.includes('.');

  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center py-6 px-3 min-w-[140px] border border-gray-100">
      <div className="text-4xl font-extrabold text-hub-cyan tracking-tight">
        <animated.span>
          {number.to((n) => (isDecimal ? n.toFixed(2) : Math.floor(n)))}
        </animated.span>
      </div>
      <div className="text-xs text-gray-600 mt-2 text-center font-medium">
        {label}
      </div>
    </div>
  );
}
