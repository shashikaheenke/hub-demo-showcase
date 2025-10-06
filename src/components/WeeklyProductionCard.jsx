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

// --- Helper Data (from your original file) ---
const parcelLabels = {
  plcd_parcels: 'Change',
  nochange_parcels: 'No Change',
  bau_parcels: 'BAU',
  insp_parcels: 'Insp',
  dnc_parcels: 'DNC',
  disc_parcels: 'Discarded',
};
const parcelKeys = Object.keys(parcelLabels);
const barColors = [
  '#60A5FA',
  '#22D3EE',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#A78BFA',
];
const pieColors = ['#3B82F6', '#8B5CF6'];

// --- Mock Data (Simulates API response for a single Digitiser) ---
const mockApiResponse = {
  plcd_parcels: 450,
  nochange_parcels: 980,
  bau_parcels: 120,
  insp_parcels: 35,
  dnc_parcels: 10,
  qcjobs: 88,
  pass: 85,
  fails: 3,
};

export default function WeeklyProductionCard() {
  const role = 'Dig'; // Set to 'Dig' role for the Digitiser view
  const [data, setData] = useState({});
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData(mockApiResponse);
    }, 500);
  }, []);

  useEffect(() => {
    // Trigger chart animation after data is loaded
    if (Object.keys(data).length > 0) {
      setShowCharts(false);
      const timer = setTimeout(() => setShowCharts(true), 300);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // --- Data Transformation Logic (from your original file) ---
  const shownParcels = Object.entries(parcelLabels).filter(
    ([key]) => data[key] > 0
  );
  const parcelData = shownParcels.map(([key, label]) => ({
    name: label,
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
        This Week's Statistics
      </h3>
      <div className="flex flex-row gap-6 min-w-0 h-full w-full">
        {/* Production Bar Chart */}
        <div className="flex-1 min-w-0 flex flex-col items-center px-1">
          <h4 className="text-xs text-center font-semibold mb-1 text-gray-400 select-none">
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
                        barColors[
                          parcelKeys.indexOf(parcelData[i]?.rawKey) %
                            barColors.length
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
                        width: 8,
                        height: 8,
                        backgroundColor:
                          barColors[
                            parcelKeys.indexOf(item.rawKey) % barColors.length
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
        <div className="flex-1 min-w-0 flex flex-col items-center px-1 text-[12px]">
          <h4 className="text-xs text-center font-semibold mb-1 text-gray-400 select-none">
            Quality
          </h4>
          {showCharts && qualityData.length > 0 ? (
            <div className="w-full flex flex-col items-center">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={qualityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    innerRadius={24}
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                    isAnimationActive
                    paddingAngle={2}
                  >
                    {qualityData.map((entry, index) => (
                      <Cell
                        key={`slice-${index}`}
                        fill={pieColors[index % pieColors.length]}
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
                      width: 8,
                      height: 8,
                      backgroundColor: pieColors[0],
                    }}
                  ></span>
                  Passed
                </div>
                <div className="flex items-center text-[8px] text-gray-700">
                  <span
                    className="inline-block rounded-sm mr-1"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: pieColors[1],
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
