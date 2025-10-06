import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { faker } from '@faker-js/faker';

// --- Helper Functions (from your original file) ---
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function getRelevantMondays() {
  const today = new Date();
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const thisMonday = addDays(today, -daysSinceMonday);
  const lastMonday = addDays(thisMonday, -7);
  return { lastMonday, thisMonday };
}
function displayTimesheetCell(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    if (val.entryType === 'H')
      return (
        <span
          className="inline-block bg-yellow-200 text-yellow-900 px-1.5 py-0 rounded text-xs font-semibold"
          title="Holiday"
        >
          H
        </span>
      );
    if (val.entryType === 'S')
      return (
        <span
          className="inline-block bg-red-400 text-white px-1.5 py-0 rounded text-xs font-semibold"
          title="Sick"
        >
          S
        </span>
      );
    if (val.hours !== null && val.hours !== undefined) return val.hours;
    return '';
  }
  return val;
}

// --- Dynamic Mock Data Generation ---
function generateMockHoursMap() {
  const { lastMonday } = getRelevantMondays();
  const hoursMap = {};
  for (let i = 0; i < 14; i++) {
    const date = addDays(lastMonday, i);
    const dayOfWeek = date.getDay(); // Sunday is 0, Saturday is 6
    const dateKey = format(date, 'yyyy-MM-dd');

    // No hours for weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      hoursMap[dateKey] = '';
      continue;
    }

    // Add some random holidays, sick days, or work hours
    const random = Math.random();
    if (random < 0.05) {
      // 5% chance of holiday
      hoursMap[dateKey] = { entryType: 'H' };
    } else if (random < 0.08) {
      // 3% chance of sick day
      hoursMap[dateKey] = { entryType: 'S' };
    } else {
      hoursMap[dateKey] = faker.helpers.arrayElement([7.5, 8, 8.5, 9]);
    }
  }
  return hoursMap;
}

export default function TimesheetHoursCard() {
  const [lastWeek, setLastWeek] = useState(Array(7).fill(''));
  const [thisWeek, setThisWeek] = useState(Array(7).fill(''));
  const [weekStartDates, setWeekStartDates] = useState({
    last: null,
    this: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const hoursMap = generateMockHoursMap();
      const { lastMonday, thisMonday } = getRelevantMondays();
      const getHours = (monday) =>
        Array.from(
          { length: 7 },
          (_, i) => hoursMap[format(addDays(monday, i), 'yyyy-MM-dd')] ?? ''
        );
      setLastWeek(getHours(lastMonday));
      setThisWeek(getHours(thisMonday));
      setWeekStartDates({ last: lastMonday, this: thisMonday });
      setLoading(false);
    }, 500);
  }, []);

  function weekDatesHeaders(monday) {
    return Array.from({ length: 7 }, (_, idx) => {
      const d = addDays(monday, idx);
      return (
        <th key={idx} className="text-[10px] font-semibold text-gray-500 p-1">
          <div className="flex flex-col items-center">
            <span>{WEEKDAYS[idx]}</span>
            <span className="text-[9px] text-gray-400">{format(d, 'd/M')}</span>
          </div>
        </th>
      );
    });
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-base font-semibold text-[#008C9E] mb-1">
        Timesheet Hours
      </h3>
      {loading ? (
        <div className="text-center text-gray-400 py-4 text-xs">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-center border-separate border-spacing-y-0.5 w-full">
            <thead>
              <tr>
                <th
                  colSpan={7}
                  className="text-[11px] font-semibold text-gray-700 pb-1 text-left"
                >
                  Last Week
                </th>
              </tr>
              <tr>
                {weekStartDates.last && weekDatesHeaders(weekStartDates.last)}
              </tr>
            </thead>
            <tbody>
              <tr>
                {lastWeek.map((h, i) => (
                  <td
                    key={i}
                    className="text-xs font-bold text-gray-800 bg-gray-50 rounded py-0.5 px-0.5"
                  >
                    {displayTimesheetCell(h)}
                  </td>
                ))}
              </tr>
              <tr>
                <td colSpan={7} className="py-0"></td>
              </tr>
              <tr>
                <th
                  colSpan={7}
                  className="text-[11px] font-semibold text-gray-700 pb-1 text-left"
                >
                  This Week
                </th>
              </tr>
              <tr>
                {weekStartDates.this && weekDatesHeaders(weekStartDates.this)}
              </tr>
            </tbody>
            <tbody>
              <tr>
                {thisWeek.map((h, i) => (
                  <td
                    key={i}
                    className="text-xs font-bold text-cyan-700 bg-cyan-50 rounded py-0.5 px-0.5"
                  >
                    {displayTimesheetCell(h)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
