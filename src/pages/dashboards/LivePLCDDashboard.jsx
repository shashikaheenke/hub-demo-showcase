import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import AnimatedNumber from '../../components/AnimatedNumber';

// --- Helper Data & Mock Data Generation ---
const statusCards = [
  {
    key: 'visualChecking',
    label: 'In Visual Checking',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    key: 'digitising',
    label: 'In Digitising',
    color: 'bg-blue-100 text-blue-800',
  },
  { key: 'inQC', label: 'In QC', color: 'bg-purple-100 text-purple-800' },
  {
    key: 'inQCToday',
    label: 'In QC Today',
    color: 'bg-purple-200 text-purple-900',
  },
  { key: 'inQuery', label: 'In Query', color: 'bg-red-100 text-red-800' },
  { key: 'ppToday', label: 'PP Today', color: 'bg-teal-100 text-teal-800' },
  {
    key: 'pendingPublish',
    label: 'Pending Publish',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    key: 'completed',
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
  },
];
const teams = ['Team 1', 'Team 2', 'Team 3'];

const generateMockStats = () => ({
  visualChecking: faker.number.int({ min: 10, max: 50 }),
  digitising: faker.number.int({ min: 100, max: 200 }),
  inQC: faker.number.int({ min: 20, max: 80 }),
  inQCToday: faker.number.int({ min: 5, max: 25 }),
  inQuery: faker.number.int({ min: 5, max: 30 }),
  ppToday: faker.number.int({ min: 50, max: 150 }),
  pendingPublish: faker.number.int({ min: 200, max: 400 }),
  completed: faker.number.int({ min: 5000, max: 8000 }),
});
const generateMockDigiData = () =>
  Array.from({ length: faker.number.int({ min: 4, max: 8 }) }, () => ({
    StatNameDig: `${faker.person
      .firstName()
      .slice(0, 1)}.${faker.person.lastName()}`,
    jobs: faker.number.int({ min: 1, max: 5 }),
    parcels: faker.number.int({ min: 10, max: 50 }),
    tjobs: faker.number.int({ min: 5, max: 10 }),
    tparcels: faker.number.int({ min: 50, max: 150 }),
    sec: faker.number.int({ min: 3600, max: 28800 }),
    qjobs: faker.number.int({ min: 0, max: 3 }),
  }));
const generateMockQCData = () =>
  Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
    StatNameQC: `${faker.person
      .firstName()
      .slice(0, 1)}.${faker.person.lastName()}`,
    jobs: faker.number.int({ min: 1, max: 5 }),
    parcels: faker.number.int({ min: 10, max: 50 }),
    tjobs: faker.number.int({ min: 5, max: 10 }),
    tparcels: faker.number.int({ min: 50, max: 150 }),
    sec: faker.number.int({ min: 3600, max: 28800 }),
  }));
const mockTeamData = {
  digi: {
    'Team 1': generateMockDigiData(),
    'Team 2': generateMockDigiData(),
    'Team 3': generateMockDigiData(),
  },
  qc: {
    'Team 1': generateMockQCData(),
    'Team 2': generateMockQCData(),
    'Team 3': generateMockQCData(),
  },
};

/**
 * A live dashboard page for PLCD stats, featuring animated summary cards
 * and team-filterable data tables. This demo simulates live data fetching.
 */
export default function LivePLCDDashboard() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [digiData, setDigiData] = useState(null);
  const [loadingDigi, setLoadingDigi] = useState(true);
  const [qcData, setQCData] = useState(null);
  const [loadingQC, setLoadingQC] = useState(true);
  const [selectedDigiTeam, setSelectedDigiTeam] = useState(teams[0]);
  const [selectedQCTeam, setSelectedQCTeam] = useState(teams[0]);

  // Simulates fetching the status card data.
  useEffect(() => {
    const fetchStats = () => {
      setLoadingStats(true);
      setTimeout(() => {
        setStats(generateMockStats());
        setLoadingStats(false);
      }, 800);
    };
    fetchStats();
    const intervalId = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Simulates fetching the Digi table data when a team is selected.
  useEffect(() => {
    setLoadingDigi(true);
    setTimeout(() => {
      setDigiData(mockTeamData.digi[selectedDigiTeam]);
      setLoadingDigi(false);
    }, 500);
  }, [selectedDigiTeam]);

  // Simulates fetching the QC table data when a team is selected.
  useEffect(() => {
    setLoadingQC(true);
    setTimeout(() => {
      setQCData(mockTeamData.qc[selectedQCTeam]);
      setLoadingQC(false);
    }, 500);
  }, [selectedQCTeam]);

  const renderDigiTable = (data) => {
    /* ... table rendering logic ... */
  };
  const renderQCTable = (data) => {
    /* ... table rendering logic ... */
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-cyan-800 tracking-tight">
            Live PLCD Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Data is refreshed automatically.
          </p>
        </div>

        {loadingStats ? (
          <LoadingIndicator />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 w-full flex flex-col gap-3">
              {statusCards.map(({ key, label, color }) => (
                <div key={key} className={`${color} rounded-lg shadow p-4`}>
                  <div className="flex justify-between font-semibold mb-1 text-base items-center">
                    <span>{label}</span>
                    <span className="text-2xl font-bold">
                      <AnimatedNumber value={stats[key] || 0} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-3/4 w-full flex flex-col gap-8">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-cyan-800">
                  Live Digi Stats
                </h2>
                <div className="mb-3 flex gap-2">
                  {teams.map((team) => (
                    <button
                      key={team}
                      onClick={() => setSelectedDigiTeam(team)}
                      className={`px-3 py-1 text-sm rounded font-medium border ${
                        selectedDigiTeam === team
                          ? 'bg-cyan-700 text-white border-cyan-700'
                          : 'bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
                {loadingDigi ? <LoadingIndicator /> : renderDigiTable(digiData)}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-violet-800">
                  Live QC Stats
                </h2>
                <div className="mb-3 flex gap-2">
                  {teams.map((team) => (
                    <button
                      key={team}
                      onClick={() => setSelectedQCTeam(team)}
                      className={`px-3 py-1 text-sm rounded font-medium border ${
                        selectedQCTeam === team
                          ? 'bg-violet-800 text-white border-violet-800'
                          : 'bg-white text-violet-800 border-violet-300 hover:bg-violet-50'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
                {loadingQC ? <LoadingIndicator /> : renderQCTable(qcData, true)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
