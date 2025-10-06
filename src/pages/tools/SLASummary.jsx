import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Mock Data Generation ---
const mockSheetOptions = ['PLCD_Sheet', 'BPS_2023_Main', 'CS_Forms'];

const generateMockSlaData = () => {
  const slaDaysRange = ['0', '1', '2', '3', '4', '5', '6', '7+'];
  const digitisers = Array.from({ length: 15 }, () => {
    const digi = {
      DigitiserID: faker.person.fullName(),
      Team: faker.helpers.arrayElement([
        'Team 1',
        'Team 2',
        'Team 3',
        'Quality',
      ]),
      TimeIn: faker.date.recent({ days: 1 }).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      HoursSinceLogin: faker.number.float({
        min: 0.25,
        max: 8,
        multipleOf: 0.25,
      }),
      TimeOut: faker.date.recent({ days: 1 }).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      slaDays: {},
    };

    slaDaysRange.forEach((day) => {
      if (Math.random() > 0.6) {
        digi.slaDays[day] = {
          Jobs: faker.number.int({ min: 1, max: 15 }),
          Parcels: faker.number.int({ min: 1, max: 70 }),
        };
      }
    });

    return digi;
  });
  return { digitisers, slaDaysRange };
};

const mockDataCache = {
  PLCD_Sheet: generateMockSlaData(),
  BPS_2023_Main: generateMockSlaData(),
  CS_Forms: generateMockSlaData(),
};

export default function SLASummary() {
  const [sheetname, setSheetname] = useState('');
  const [sheetOptions, setSheetOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ digitisers: [], slaDaysRange: [] });

  useEffect(() => {
    const t = setTimeout(() => {
      setSheetOptions(mockSheetOptions);
      setSheetname(mockSheetOptions[0]);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sheetname) return;
    setLoading(true);
    setError('');
    const t = setTimeout(() => {
      setData(mockDataCache[sheetname] || { digitisers: [], slaDaysRange: [] });
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [sheetname]);

  const digitiserTotals = data.digitisers.map((digi) => {
    const totalJobs = data.slaDaysRange.reduce(
      (sum, day) => sum + (digi.slaDays[day]?.Jobs || 0),
      0
    );
    const totalParcels = data.slaDaysRange.reduce(
      (sum, day) => sum + (digi.slaDays[day]?.Parcels || 0),
      0
    );
    return { DigitiserID: digi.DigitiserID, totalJobs, totalParcels };
  });

  const grandTotals = digitiserTotals.reduce(
    (acc, cur) => {
      acc.totalJobs += cur.totalJobs;
      acc.totalParcels += cur.totalParcels;
      return acc;
    },
    { totalJobs: 0, totalParcels: 0 }
  );

  return (
    <Layout>
      <div className="p-4 max-w-full">
        <div className="bg-white/50 backdrop-blur-md shadow-md rounded-xl p-6 border border-white/30">
          <h1 className="text-3xl font-bold mb-6 text-hub-cyan select-text text-center">
            SLA Summary by Sheet
          </h1>

          <div className="mb-6 text-center">
            <label
              htmlFor="sheet-select"
              className="mr-2 font-semibold text-hub-cyan/80"
            >
              Select Sheet:
            </label>
            <select
              id="sheet-select"
              value={sheetname}
              onChange={(e) => setSheetname(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
            >
              {sheetOptions.map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>
          </div>

          {loading && <LoadingIndicator />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="overflow-auto rounded-xl shadow-lg border border-gray-200 bg-white/50 backdrop-blur-sm">
              <table className="table-auto border-collapse w-full text-sm text-center text-gray-800">
                <thead>
                  <tr className="bg-cyan-700/90 text-white sticky top-0">
                    <th className="px-2 py-2 font-semibold border border-gray-200">
                      Digitiser ID
                    </th>
                    <th className="px-2 py-2 font-semibold border border-gray-200">
                      Team
                    </th>
                    <th className="px-2 py-2 font-semibold border border-gray-200">
                      Time In
                    </th>
                    <th className="px-2 py-2 font-semibold border border-gray-200">
                      Hours Since Login
                    </th>
                    <th className="px-2 py-2 font-semibold border border-gray-200">
                      Time Out
                    </th>
                    {data.slaDaysRange.map((day) => (
                      <th
                        key={`group-${day}`}
                        className="px-2 py-2 font-semibold border border-gray-200"
                        colSpan={2}
                        title={`${day} SLA Days`}
                      >
                        {day} SLA Days
                      </th>
                    ))}
                    <th
                      className="px-2 py-2 font-semibold border border-gray-200"
                      colSpan={2}
                    >
                      Totals
                    </th>
                  </tr>

                  <tr className="bg-cyan-600/90 text-white sticky top-12 text-xs">
                    <th colSpan={5} className="py-1 border border-gray-200" />
                    {data.slaDaysRange.map((day) => (
                      <React.Fragment key={`sub-${day}`}>
                        <th className="px-2 py-1 font-medium border-t border-b border-r-1 border-l border-gray-200">
                          Jobs
                        </th>
                        <th className="px-2 py-1 font-medium border-t border-b border-l border-gray-200">
                          Parcels
                        </th>
                      </React.Fragment>
                    ))}
                    <th className="px-2 py-1 font-medium border-t border-b border-r-1 border-l border-gray-200">
                      Jobs
                    </th>
                    <th className="px-2 py-1 font-medium border-t border-b border-l border-gray-200">
                      Parcels
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.digitisers.map((digi, idx) => {
                    const { totalJobs, totalParcels } = digitiserTotals[idx];
                    return (
                      <tr
                        key={digi.DigitiserID}
                        className="odd:bg-white/70 even:bg-white/50"
                      >
                        <td className="px-2 py-1 text-left text-cyan-800 hover:text-cyan-900 font-medium border border-gray-200">
                          {digi.DigitiserID}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap border border-gray-200">
                          {digi.Team || '-'}
                        </td>
                        <td className="px-2 py-1 border border-gray-200">
                          {digi.TimeIn || '-'}
                        </td>
                        <td className="px-2 py-1 border border-gray-200">
                          {typeof digi.HoursSinceLogin === 'number'
                            ? digi.HoursSinceLogin.toFixed(2)
                            : '-'}
                        </td>
                        <td className="px-2 py-1 border border-gray-200">
                          {digi.TimeOut || '-'}
                        </td>

                        {data.slaDaysRange.map((day) => (
                          <React.Fragment
                            key={`row-${digi.DigitiserID}-${day}`}
                          >
                            <td className="px-2 py-1 text-right border-t border-b border-r-1 border-l border-gray-200">
                              {digi.slaDays[day]?.Jobs ?? ''}
                            </td>
                            <td className="px-2 py-1 text-right border-t border-b border-l border-gray-200">
                              {digi.slaDays[day]?.Parcels ?? ''}
                            </td>
                          </React.Fragment>
                        ))}

                        <td className="px-2 py-1 font-semibold text-right border-t border-b border-r-1 border-l border-gray-200">
                          {totalJobs || ''}
                        </td>
                        <td className="px-2 py-1 font-semibold text-right border-t border-b border-l border-gray-200">
                          {totalParcels || ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr className="bg-cyan-700/90 text-white font-semibold sticky bottom-0">
                    <td
                      colSpan={5 + data.slaDaysRange.length * 2}
                      className="text-left px-3 py-2 border border-gray-200"
                    >
                      Totals
                    </td>
                    <td className="px-2 py-2 text-right border border-gray-200">
                      {grandTotals.totalJobs || ''}
                    </td>
                    <td className="px-2 py-2 text-right border border-gray-200">
                      {grandTotals.totalParcels || ''}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
