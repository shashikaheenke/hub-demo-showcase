import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- Helper Data and Functions (from your original file) ---
const parcelLabels = {
  plcd_parcels: 'Change',
  nochange_parcels: 'No Change',
  bau_parcels: 'BAU',
  insp_parcels: 'Insp',
  dnc_parcels: 'DNC',
  disc_parcels: 'Discarded',
};
const parcelKeys = Object.keys(parcelLabels);
const parcelColors = [
  '#60A5FA',
  '#22D3EE',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#A78BFA',
];

// --- Mock Data (Simulates API response for a single Digitiser) ---
const mockApiResponse = {
  plcd_parcels: 85,
  nochange_parcels: 123,
  bau_parcels: 22,
  insp_parcels: 5,
  qcjobs: 20,
  pass: 19,
};

export default function YesterdayProductionCard() {
  const role = 'Dig'; // <-- Changed role to 'Dig'
  const [data, setData] = useState({});
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setTimeout(() => setData(mockApiResponse), 500);
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setShowCharts(false);
      const timeout = setTimeout(() => setShowCharts(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  // --- All Data Transformation Logic (Copied from your original file) ---
  const shownParcels = parcelKeys.filter((key) => data[key] > 0);
  const parcelData = shownParcels.map((key) => ({
    name: parcelLabels[key],
    value: data[key],
    rawKey: key,
  }));
  const singleStackBar =
    parcelData.length > 0
      ? [
          parcelData.reduce(
            (acc, { name, value }) => {
              acc[name] = value;
              return acc;
            },
            { name: 'Parcels' }
          ),
        ]
      : [];
  const singleParcelKeys = parcelData.map((d) => d.name);
  let qualityData = [];
  if (role === 'Dig' && data.qcjobs > 0) {
    const percent = Math.round((data.pass / data.qcjobs) * 100);
    qualityData = [
      { name: 'Passed', value: percent },
      { name: 'Failed', value: 100 - percent },
    ];
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <h3 className="text-base font-semibold text-black mb-2 select-none">
        Last Working Day
      </h3>
      <div className="flex flex-col md:flex-row gap-8 min-w-0 h-full w-full">
        {/* Production Bar Chart */}
        <div className="flex-1 min-w-0 flex flex-col px-1 min-h-[120px] items-center">
          <h4 className="text-center font-semibold mb-1 text-gray-400 select-none text-xs">
            Production
          </h4>
          {showCharts && parcelData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={singleStackBar}
                  margin={{ top: 6, right: 6, left: 0, bottom: 2 }}
                  barCategoryGap="40%"
                >
                  <CartesianGrid
                    strokeDasharray="2 2"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#9E9E9E"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip />
                  {singleParcelKeys.map((k, i) => (
                    <Bar
                      key={k}
                      dataKey={k}
                      stackId="a"
                      fill={
                        parcelColors[
                          parcelKeys.indexOf(parcelData[i]?.rawKey) %
                            parcelColors.length
                        ]
                      }
                      name={k}
                      isAnimationActive={showCharts}
                      barSize={60}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div
                className="flex flex-row flex-wrap justify-center gap-2 mt-1 mx-auto"
                style={{
                  width: '100%',
                  maxWidth: 340,
                  textAlign: 'center',
                  fontSize: 9,
                }}
              >
                {parcelData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center text-[8px] text-gray-700"
                  >
                    <span
                      className="inline-block rounded-sm mr-1"
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor:
                          parcelColors[
                            parcelKeys.indexOf(item.rawKey) %
                              parcelColors.length
                          ],
                      }}
                    ></span>
                    {item.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-blue-300 select-none text-xs">
              {showCharts ? 'No parcel data' : 'Loading...'}
            </p>
          )}
        </div>
        {/* Quality Pie Chart */}
        <div className="flex-1 min-w-0 flex flex-col px-1 min-h-[120px] items-center">
          <h4 className="text-center font-semibold mb-1 text-gray-400 select-none text-xs">
            Quality
          </h4>
          {showCharts && qualityData.length > 0 ? (
            <div className="w-full flex flex-col items-center text-[12px]">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={qualityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    innerRadius={25}
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                    paddingAngle={4}
                  >
                    {qualityData.map((entry, index) => (
                      <Cell
                        key={`slice-${index}`}
                        fill={index === 0 ? '#34D399' : '#F87171'}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-row flex-wrap justify-center gap-4 mt-1">
                <div className="flex items-center text-[8px] text-gray-700">
                  <span
                    className="inline-block rounded-sm mr-1"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#34D399',
                    }}
                  ></span>
                  Passed
                </div>
                <div className="flex items-center text-[8px] text-gray-700">
                  <span
                    className="inline-block rounded-sm mr-1"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#F87171',
                    }}
                  ></span>
                  Failed
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-blue-300 select-none text-xs">
              {showCharts ? 'No quality data' : 'Loading...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
