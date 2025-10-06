import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  format,
  addDays,
  getDaysInMonth as dfnsGetDaysInMonth,
} from 'date-fns';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';

// --- Helper Functions ---

// In this demo, the export buttons will show an alert instead of downloading a file.
function downloadLastWeekCSV() {
  alert('CSV export is for demonstration only.');
}

// A list of possible values for each timesheet cell dropdown.
const TIME_OPTIONS = [
  'H',
  'S',
  ...Array.from({ length: 27 }, (_, i) => (i * 0.5).toString()).slice(1),
];

// --- Dynamic Mock Data Generation ---

// Generates a list of realistic-looking users for the filter dropdowns.
const mockAllUsers = Array.from({ length: 15 }, () => {
  const fname = faker.person.firstName();
  const sname = faker.person.lastName();
  return {
    AutoID: faker.string.uuid(),
    fname,
    sname,
    team: faker.helpers.arrayElement(['Team 1', 'Team 2', 'Team 3']),
    role: faker.helpers.arrayElement(['Dig', 'QC', 'Team Leader']),
  };
});

// Generates a full timesheet for the mock users for a given month and year.
function generateMockTimesheet(year, month) {
  return mockAllUsers.map((user) => {
    const userTimesheet = {
      autoId: user.AutoID,
      fname: user.fname,
      sname: user.sname,
      team: user.team,
      role: user.role,
    };
    const daysInMonth = dfnsGetDaysInMonth(new Date(year, month - 1));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayOfWeek = date.getDay(); // Sunday is 0, Saturday is 6

      // Weekends are left blank.
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // Randomly assign work hours, sick days, or holidays.
      const random = Math.random();
      if (random < 0.05) userTimesheet[dateKey] = 'H'; // 5% chance of holiday
      else if (random < 0.08)
        userTimesheet[dateKey] = 'S'; // 3% chance of sick day
      else userTimesheet[dateKey] = faker.helpers.arrayElement([7.5, 8, 8.5]);
    }
    return userTimesheet;
  });
}

/**
 * A full-page, interactive timesheet editor that resembles a spreadsheet.
 * This demo version simulates data fetching and allows for instant, client-side
 * editing of the timesheet grid, showcasing complex state management.
 */
export default function TimesheetTool() {
  const today = new Date();

  // State for the filter controls.
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');

  // State for the data and UI.
  const [allUsers, setAllUsers] = useState([]);
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(true);

  // Loads the list of users for the filter dropdowns when the component first mounts.
  useEffect(() => {
    setAllUsers(mockAllUsers);
  }, []);

  // Simulates fetching new timesheet data when filters are applied.
  const fetchTimesheet = async () => {
    setLoading(true);
    // Fake a 1-second delay to mimic a network request.
    setTimeout(() => {
      const newTimesheet = generateMockTimesheet(year, month).sort((a, b) =>
        `${a.fname} ${a.sname}`.localeCompare(`${b.fname} ${b.sname}`)
      );
      setTimesheet(newTimesheet);
      setLoading(false);
    }, 1000);
  };

  // Fetches the initial timesheet data when the component first loads.
  useEffect(() => {
    fetchTimesheet();
  }, []); // The empty array ensures this only runs once on mount.

  // Memoized values derived from state, for performance.
  const teams = Array.from(new Set(allUsers.map((u) => u.team))).filter(
    Boolean
  );
  const roles = Array.from(new Set(allUsers.map((u) => u.role))).filter(
    Boolean
  );
  const days = Array.from(
    { length: dfnsGetDaysInMonth(new Date(year, month - 1)) },
    (_, i) => i + 1
  );

  // Helper functions to check if a given date is a weekend or today.
  const isWeekend = (yyyymmdd) => {
    const d = new Date(yyyymmdd);
    return d.getDay() === 0 || d.getDay() === 6;
  };
  const isToday = (yyyymmdd) => {
    const d = new Date(yyyymmdd);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  // This function updates the local state instantly, making the grid feel responsive.
  const handleChange = async (autoId, date, value) => {
    setTimesheet((prev) =>
      prev.map((row) =>
        row.autoId === autoId ? { ...row, [date]: value } : row
      )
    );
  };

  // Custom styling for the select dropdowns within the table to make them invisible.
  const selectStyle = {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'center',
    fontSize: 13,
    outline: 'none',
    color: '#1b324a',
    padding: 0,
    fontWeight: 'bold',
  };

  return (
    <Layout>
      <div className="max-w-full">
        <h2 className="text-lg font-semibold mb-4 text-cyan-800">
          Timesheets Tool
        </h2>

        {/* Filter controls with the "glass" UI style */}
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-white rounded-xl shadow-sm">
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">All Names</option>
            {allUsers
              .sort((a, b) =>
                `${a.fname} ${a.sname}`.localeCompare(`${b.fname} ${b.sname}`)
              )
              .map((u) => (
                <option key={u.AutoID} value={u.AutoID}>
                  {u.fname} {u.sname}
                </option>
              ))}
          </select>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">All Teams</option>
            {teams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={fetchTimesheet}
            className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 text-sm font-medium"
          >
            Filter
          </button>
          <button
            onClick={downloadLastWeekCSV}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
          >
            Export Last Week
          </button>
        </div>

        {loading && <LoadingIndicator />}
        {!loading && (
          <div
            className="overflow-x-auto border rounded-lg shadow-sm bg-white"
            style={{ fontSize: 13, maxWidth: 'calc(100vw - 120px)' }}
          >
            <table
              className="w-full border-collapse"
              style={{ tableLayout: 'fixed' }}
            >
              <colgroup>
                <col style={{ minWidth: 130, width: 130 }} />
                <col style={{ minWidth: 90, width: 90 }} />
                <col style={{ minWidth: 110, width: 110 }} />
                {days.map((d) => (
                  <col key={d} style={{ minWidth: 40, width: 40 }} />
                ))}
              </colgroup>
              <thead className="text-xs">
                <tr>
                  <th
                    className="p-2 border-r border-gray-200 sticky left-0 bg-slate-50 z-20"
                    rowSpan={2}
                    style={{ left: 0 }}
                  >
                    Name
                  </th>
                  <th
                    className="p-2 border-r border-gray-200 sticky left-[130px] bg-slate-50 z-20"
                    rowSpan={2}
                    style={{ left: 130 }}
                  >
                    Team
                  </th>
                  <th
                    className="p-2 border-r border-gray-200 sticky left-[220px] bg-slate-50 z-20"
                    rowSpan={2}
                    style={{ left: 220 }}
                  >
                    Role
                  </th>
                  {days.map((d) => {
                    const dateStr = `${year}-${String(month).padStart(
                      2,
                      '0'
                    )}-${String(d).padStart(2, '0')}`;
                    const dayOfWeek = new Date(dateStr).toLocaleString(
                      'default',
                      { weekday: 'short' }
                    );
                    return (
                      <th
                        key={'dow-' + d}
                        className={`p-1 border-b border-gray-200 font-semibold text-center ${
                          isWeekend(dateStr) ? 'bg-gray-100' : 'bg-slate-50'
                        }`}
                      >
                        {dayOfWeek}
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  {days.map((d) => {
                    const dateStr = `${year}-${String(month).padStart(
                      2,
                      '0'
                    )}-${String(d).padStart(2, '0')}`;
                    return (
                      <th
                        key={'date-' + d}
                        className={`p-1 border-b border-gray-200 font-bold text-center ${
                          isToday(dateStr)
                            ? 'bg-green-100'
                            : isWeekend(dateStr)
                            ? 'bg-gray-100'
                            : 'bg-slate-50'
                        }`}
                      >
                        {d}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timesheet.map((user) => (
                  <tr key={user.autoId} className="even:bg-gray-50/70">
                    <td
                      className="p-2 border-r border-gray-200 sticky left-0 z-10 font-semibold bg-white even:bg-gray-50/70"
                      style={{ left: 0 }}
                    >
                      {user.fname} {user.sname}
                    </td>
                    <td
                      className="p-2 border-r border-gray-200 sticky left-[130px] z-10 bg-white even:bg-gray-50/70"
                      style={{ left: 130 }}
                    >
                      {user.team}
                    </td>
                    <td
                      className="p-2 border-r border-gray-200 sticky left-[220px] z-10 bg-white even:bg-gray-50/70"
                      style={{ left: 220 }}
                    >
                      {user.role}
                    </td>
                    {days.map((day) => {
                      const dateStr = `${year}-${String(month).padStart(
                        2,
                        '0'
                      )}-${String(day).padStart(2, '0')}`;
                      const value = user[dateStr] ?? '';
                      let cellBg = '';
                      if (value === 'H') cellBg = 'bg-yellow-200/70';
                      else if (value === 'S') cellBg = 'bg-red-200/70';
                      else if (isToday(dateStr)) cellBg = 'bg-green-100/60';
                      else if (isWeekend(dateStr)) cellBg = 'bg-gray-100';

                      return (
                        <td
                          key={day}
                          className={`border-l border-gray-200 text-center p-0 ${cellBg}`}
                        >
                          {!isWeekend(dateStr) && (
                            <select
                              style={selectStyle}
                              value={value}
                              onChange={(e) =>
                                handleChange(
                                  user.autoId,
                                  dateStr,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">-</option>
                              {TIME_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
