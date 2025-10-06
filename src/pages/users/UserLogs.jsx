import React, { useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { RefreshCw, Users, Shield, LogIn, LogOut } from 'lucide-react';

// --- Helper Functions & Data ---

// Defines the display order for roles and teams in the heatmap.
const ROLE_ORDER = ['Manager', 'Team Leader', 'QC', 'Dig'];
const TEAM_ORDER = ['Management', 'Quality', 'Team 1', 'Team 2', 'Team 3'];

/**
 * Determines the background color for a heatmap cell based on its value.
 * @param {number} value - The number of logged-in users.
 * @param {number} max - The maximum value in the entire heatmap for scaling.
 * @returns {string} A Tailwind CSS background color class.
 */
function heatClass(value, max) {
  if (!max || value <= 0) return 'bg-cyan-50/40';
  const pct = value / max;
  if (pct >= 0.85) return 'bg-cyan-400/40';
  if (pct >= 0.65) return 'bg-cyan-300/40';
  if (pct >= 0.45) return 'bg-cyan-200/40';
  if (pct >= 0.25) return 'bg-cyan-100/40';
  return 'bg-cyan-50/40';
}

// A reusable component for the summary cards at the top of the page.
function StatChip({ icon: Icon, label, value, sub, tone = 'cyan' }) {
  const toneMap = {
    cyan: 'bg-cyan-50/70 text-cyan-800 border-cyan-200',
    slate: 'bg-slate-100/70 text-slate-800 border-slate-200',
  };
  return (
    <div className={`rounded-2xl border ${toneMap[tone]} px-4 py-3 shadow-sm`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="opacity-80" />}
        <span className="text-xs font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
      <div className="mt-1 text-xl font-bold leading-6">{value}</div>
      {sub ? <div className="text-[11px] text-slate-500">{sub}</div> : null}
    </div>
  );
}

// --- Mock Data Generation ---
const generateMockLogs = () => {
  const roleSummary = ROLE_ORDER.map((role) => ({
    role,
    loggedIn: faker.number.int({ min: 5, max: 15 }),
    employees: faker.number.int({ min: 15, max: 20 }),
  }));

  const teamRoleCounts = TEAM_ORDER.flatMap((team) =>
    ROLE_ORDER.map((role) => ({
      team,
      role,
      loggedIn: faker.number.int({ min: 1, max: 5 }),
    }))
  );

  const loggedIn = Array.from({
    length: faker.number.int({ min: 10, max: 20 }),
  }).map(() => ({
    autoId: faker.string.uuid(),
    fname: faker.person.firstName(),
    sname: faker.person.lastName(),
    role: faker.helpers.arrayElement(ROLE_ORDER),
    team: faker.helpers.arrayElement(TEAM_ORDER),
    TimeIn: faker.date.recent().toISOString(),
    agency: 'Cyient',
  }));

  const notLoggedIn = Array.from({
    length: faker.number.int({ min: 3, max: 8 }),
  }).map(() => ({
    autoId: faker.string.uuid(),
    fname: faker.person.firstName(),
    sname: faker.person.lastName(),
    role: faker.helpers.arrayElement(ROLE_ORDER),
    team: faker.helpers.arrayElement(TEAM_ORDER),
    timesheetEntry: faker.helpers.arrayElement(['H', 'S', '']),
    agency: 'Kinect',
  }));

  return { roleSummary, teamRoleCounts, loggedIn, notLoggedIn };
};

/**
 * A dashboard page displaying summaries and detailed lists of user login activity.
 * This demo version simulates all data fetching to showcase the complex UI,
 * including summary cards, a heatmap, and multiple data tables.
 */
export default function UserLogs() {
  const [summary, setSummary] = useState([]);
  const [rolesSummary, setRolesSummary] = useState([]);
  const [users, setUsers] = useState([]);
  const [notLogged, setNotLogged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  // This function simulates fetching all data for the dashboard.
  const load = async () => {
    setLoading(true);
    setErr('');
    // Fake a 1.2 second network delay to mimic a real API call.
    setTimeout(() => {
      try {
        const mockData = generateMockLogs();
        setSummary(mockData.teamRoleCounts);
        setRolesSummary(mockData.roleSummary);
        setUsers(mockData.loggedIn);
        setNotLogged(mockData.notLoggedIn);
        setUpdatedAt(new Date());
      } catch (e) {
        setErr('Failed to generate mock data.');
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  // Load the initial data when the component first mounts.
  useEffect(() => {
    load();
  }, []);

  // useMemo provides performance optimization by only recalculating when data changes.
  const maxCell = useMemo(() => {
    if (!summary?.length) return 0;
    return Math.max(0, ...summary.map((s) => s.loggedIn));
  }, [summary]);

  const totalLoggedIn = rolesSummary.reduce((a, r) => a + (r.loggedIn || 0), 0);
  const totalEmployees = rolesSummary.reduce(
    (a, r) => a + (r.employees || 0),
    0
  );

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cyan-900">User Logs</h2>
            <div className="text-xs text-slate-500 mt-1">
              {updatedAt
                ? `Updated ${updatedAt.toLocaleTimeString()}`
                : 'Loading…'}
            </div>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl bg-white/70 backdrop-blur border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50 transition shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />{' '}
            Refresh
          </button>
        </div>

        {err && <ErrorMessage message={err} />}
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            {/* Top summary cards provide a high-level overview. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="col-span-1 sm:col-span-2 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50/80 to-sky-50/80 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-cyan-900 font-semibold">
                  <Users size={18} /> Overall
                </div>
                <div className="mt-2 text-3xl font-extrabold text-cyan-800">
                  {totalLoggedIn}
                  <span className="text-slate-500 text-xl font-semibold">
                    {' '}
                    / {totalEmployees}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Logged In / Employees
                </div>
              </div>
              {rolesSummary.map((row) => (
                <StatChip
                  key={row.role}
                  icon={Shield}
                  label={row.role}
                  value={
                    <span className="whitespace-nowrap">
                      <span className="text-emerald-700 font-bold">
                        {row.loggedIn}
                      </span>
                      <span className="text-slate-500"> / {row.employees}</span>
                    </span>
                  }
                  sub="Logged In / Total"
                  tone="slate"
                />
              ))}
            </div>

            {/* The heatmap provides a visual breakdown of logins by team and role. */}
            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm overflow-auto mb-8">
              <div className="px-4 py-3  border-slate-200">
                <h3 className="font-semibold text-slate-800">
                  Live Login by Team & Role
                </h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-semibold text-slate-700  border-slate-200">
                      Team
                    </th>
                    {ROLE_ORDER.map((role) => (
                      <th
                        key={role}
                        className="p-3 text-center font-semibold text-slate-700  border-slate-200"
                      >
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEAM_ORDER.map((team) => (
                    <tr key={team} className="even:bg-slate-50/30">
                      <td className="p-3 font-semibold text-slate-800 border-t border-slate-100">
                        {team}
                      </td>
                      {ROLE_ORDER.map((role) => {
                        const val =
                          summary.find(
                            (r) => r.team === team && r.role === role
                          )?.loggedIn || 0;
                        return (
                          <td
                            key={role}
                            className={`p-2 text-center border-t border-slate-100 ${heatClass(
                              val,
                              maxCell
                            )} rounded-sm`}
                          >
                            <span className="inline-flex justify-center min-w-[2.5rem] font-semibold text-cyan-900">
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* The final two tables show detailed lists of who is logged in and who is not. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
                <div className="px-4 py-3  border-slate-200 flex items-center gap-2">
                  <LogIn size={18} className="text-emerald-600" />
                  <h3 className="font-semibold text-slate-800">
                    Currently Logged In
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[600px] w-full text-sm">
                    <thead>
                      <tr className="text-slate-700">
                        <th className="p-2 text-left ">Name</th>
                        <th className="p-2 text-left ">Team</th>
                        <th className="p-2 text-left ">Time In</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.autoId} className="hover:bg-cyan-50/60">
                          <td className="p-2  font-semibold text-slate-800">
                            {u.fname} {u.sname}
                          </td>
                          <td className="p-2 ">{u.team}</td>
                          <td className="p-2 ">
                            {u.TimeIn
                              ? new Date(u.TimeIn).toLocaleTimeString('en-GB')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
                <div className="px-4 py-3  border-slate-200 flex items-center gap-2">
                  <LogOut size={18} className="text-rose-600" />
                  <h3 className="font-semibold text-slate-800">
                    Not Logged In
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[600px] w-full text-sm">
                    <thead>
                      <tr className="text-slate-700">
                        <th className="p-2 text-left ">Name</th>
                        <th className="p-2 text-left ">Team</th>
                        <th className="p-2 text-left ">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notLogged.map((u) => {
                        const status =
                          u.timesheetEntry === 'S'
                            ? {
                                label: 'Sick',
                                cls: 'bg-sky-50 text-sky-700 border-sky-200',
                              }
                            : u.timesheetEntry === 'H'
                            ? {
                                label: 'Holiday',
                                cls: 'bg-amber-50 text-amber-700 border-amber-200',
                              }
                            : {
                                label: 'Not Logged In',
                                cls: 'bg-rose-50 text-rose-700 border-rose-200',
                              };
                        return (
                          <tr key={u.autoId} className="hover:bg-slate-50">
                            <td className="p-2  font-semibold text-slate-800">
                              {u.fname} {u.sname}
                            </td>
                            <td className="p-2 ">{u.team}</td>
                            <td className="p-2 ">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${status.cls}`}
                              >
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
