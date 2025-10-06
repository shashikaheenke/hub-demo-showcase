import React, { useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Date Helper Functions (from your original file) ---
function ymdLocal(d) {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, '0'),
    day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function mondayOf(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
function fridayOfWeek(startDate) {
  const fri = new Date(startDate);
  fri.setDate(startDate.getDate() + 4);
  fri.setHours(23, 59, 59, 999);
  return fri;
}
function nextWeekRange() {
  const thisMon = mondayOf(new Date());
  const nextMon = new Date(thisMon);
  nextMon.setDate(thisMon.getDate() + 7);
  return { start: nextMon, end: fridayOfWeek(nextMon) };
}
function fmtLong(d) {
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// --- Mock Data Generation ---
const mockTodayList = [
  {
    name: faker.person.fullName(),
    role: 'Dig',
    team: 'Team 1',
    entryType: 'H',
  },
  { name: faker.person.fullName(), role: 'QC', team: 'Team 2', entryType: 'S' },
  {
    name: faker.person.fullName(),
    role: 'Dig',
    team: 'Team 3',
    entryType: 'H',
  },
];
const mockTodaySummary = [
  { role: 'Dig', number: 2, strength: 30 },
  { role: 'QC', number: 1, strength: 15 },
  { role: 'Team Leader', number: 0, strength: 3 },
];
const mockNextWeekSummary = [
  { workPot: 'BPS', on_leave_number: 5 },
  { workPot: 'CS', on_leave_number: 2 },
];
const generateWeekGrid = (startMonday) => {
  return Array.from({ length: 10 }).map(() => {
    const person = {
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(['Dig', 'QC']),
      team: faker.helpers.arrayElement(['Team 1', 'Team 2', 'Team 3']),
    };
    const days = {};
    for (let i = 0; i < 5; i++) {
      const date = new Date(startMonday);
      date.setDate(startMonday.getDate() + i);
      if (Math.random() < 0.1) {
        days[ymdLocal(date)] = Math.random() < 0.7 ? 'H' : 'S';
      }
    }
    return { person, days };
  });
};

/**
 * A page for viewing the team's holiday and leave schedule.
 * This demo simulates fetching five different data sources to populate the dashboard.
 */
export default function HolidayCalendar() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // State for all the different data sections on the page.
  const [todayList, setTodayList] = useState([]);
  const [todaySummary, setTodaySummary] = useState([]);
  const [nextWeekSummary, setNextWeekSummary] = useState([]);
  const [thisWeekGrid, setThisWeekGrid] = useState([]);
  const [nextWeekGrid, setNextWeekGrid] = useState([]);

  // Date ranges are calculated on the client side.
  const today = new Date();
  const thisMon = mondayOf(today);
  const thisFri = fridayOfWeek(thisMon);
  const { start: nextMon, end: nextFri } = nextWeekRange();

  // Memoized arrays for the weekdays in the grid headers.
  const thisWeekDays = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date(thisMon);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [thisMon]
  );
  const nextWeekDays = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date(nextMon);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [nextMon]
  );

  // A key to identify and highlight the 'today' column.
  const todayKey = ymdLocal(today);

  // This effect simulates fetching all necessary data when the page loads.
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        // Fake a network delay.
        setTimeout(() => {
          setTodayList(mockTodayList);
          setTodaySummary(mockTodaySummary);
          setNextWeekSummary(mockNextWeekSummary);
          setThisWeekGrid(generateWeekGrid(thisMon));
          setNextWeekGrid(generateWeekGrid(nextMon));
          setLoading(false);
        }, 1200);
      } catch (e) {
        console.error(e);
        setErr('Failed to load holiday data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [thisMon, nextMon]); // Reruns if the date range logic were to change.

  if (loading)
    return (
      <Layout>
        <LoadingIndicator />
      </Layout>
    );
  if (err)
    return (
      <Layout>
        <ErrorMessage message={err} />
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
            Holiday Calendar
          </h2>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <span className="w-5 h-5 rounded-full inline-block bg-blue-300 ring-2 ring-white shadow" />{' '}
              <span className="text-sm md:text-base text-slate-700 font-medium">
                Holiday
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-5 h-5 rounded-full inline-block bg-green-300 ring-2 ring-white shadow" />{' '}
              <span className="text-sm md:text-base text-slate-700 font-medium">
                Sick
              </span>
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* "On Leave Today" Card */}
          <section className="bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-slate-800">
                On Leave Today
              </h3>
            </div>
            <div className="p-4 overflow-x-auto">
              {!todayList || todayList.length === 0 ? (
                <div className="text-sm text-gray-500 italic">
                  No leave entries for today.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-slate-600">
                    <tr className="border-b border-gray-200">
                      <th className="px-2 py-2 text-left">Name</th>
                      <th className="px-2 py-2 text-left">Team</th>
                      <th className="px-2 py-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayList.map((r, i) => (
                      <tr key={i} className="even:bg-gray-50">
                        <td className="px-2 py-2">{r.name}</td>
                        <td className="px-2 py-2">{r.team}</td>
                        <td className="px-2 py-2">
                          {r.entryType === 'H' ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              H
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              S
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
          {/* ... (Other summary cards for Today and Next Week) ... */}
        </div>

        {/* "Current Week" Grid */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-slate-800">
              Current week ({fmtLong(thisMon)} – {fmtLong(thisFri)})
            </h3>
          </div>
          <div className="p-4 overflow-x-auto">
            {!thisWeekGrid || thisWeekGrid.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No entries for this week.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left">Name</th>
                    <th className="px-2 py-2 text-left">Team</th>
                    {thisWeekDays.map((d, i) => (
                      <th
                        key={i}
                        className={`px-2 py-2 text-center ${
                          ymdLocal(d) === todayKey ? 'bg-amber-100 rounded' : ''
                        }`}
                      >
                        {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                        <div className="text-xs text-gray-500">
                          {d.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {thisWeekGrid.map(({ person, days }, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-2 py-2">{person?.name}</td>
                      <td className="px-2 py-2">{person?.team}</td>
                      {thisWeekDays.map((d, j) => (
                        <Cell
                          key={j}
                          v={days?.[ymdLocal(d)]}
                          highlight={ymdLocal(d) === todayKey}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ... (Next week grid is similar) ... */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-slate-800">
              Current week ({fmtLong(thisMon)} – {fmtLong(thisFri)})
            </h3>
          </div>
          <div className="p-4 overflow-x-auto">
            {!thisWeekGrid || thisWeekGrid.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No entries for this week.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left">Name</th>
                    <th className="px-2 py-2 text-left">Team</th>
                    {thisWeekDays.map((d, i) => (
                      <th
                        key={i}
                        className={`px-2 py-2 text-center ${
                          ymdLocal(d) === todayKey ? 'bg-amber-100 rounded' : ''
                        }`}
                      >
                        {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                        <div className="text-xs text-gray-500">
                          {d.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {thisWeekGrid.map(({ person, days }, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-2 py-2">{person?.name}</td>
                      <td className="px-2 py-2">{person?.team}</td>
                      {thisWeekDays.map((d, j) => (
                        <Cell
                          key={j}
                          v={days?.[ymdLocal(d)]}
                          highlight={ymdLocal(d) === todayKey}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Reusable cell component for the grid.
function Cell({ v, highlight }) {
  const base = 'px-2 py-1 text-center border-t border-gray-200';
  const hl = highlight ? ' bg-amber-50' : '';
  if (v === 'H')
    return (
      <td className={base + hl}>
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          H
        </span>
      </td>
    );
  if (v === 'S')
    return (
      <td className={base + hl}>
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          S
        </span>
      </td>
    );
  return <td className={base + hl + ' text-gray-300'}>–</td>;
}
