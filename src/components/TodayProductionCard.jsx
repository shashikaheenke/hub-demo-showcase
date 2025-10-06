import React, { useEffect, useState } from 'react';

// --- Helper Functions (Copied from your original file) ---
function animateCount(start, end, duration, setFunc) {
  const range = end - start;
  if (range === 0) {
    setFunc(end);
    return;
  }
  const increment = range / (duration / 16);
  let current = start;
  const step = () => {
    current += increment;
    if (
      (increment > 0 && current >= end) ||
      (increment < 0 && current <= end)
    ) {
      setFunc(Math.round(end));
    } else {
      setFunc(Math.round(current));
      requestAnimationFrame(step);
    }
  };
  step();
}

// --- Mock Data (Simulates API response for a single Digitiser) ---
const mockApiResponse = {
  Dig: { jobs: 14, parcels: 238 },
  QC: { jobs: 0, parcels: 0 }, // A digitiser would have no QC data for their own view
};

export default function TodayProductionCard() {
  const role = 'Dig'; // <-- Changed role to 'Dig'
  const [data, setData] = useState({ Dig: null, QC: null });
  const [displayData, setDisplayData] = useState({ Dig: null, QC: null });

  // Simplified animation function for a single user object
  function animateSingle(type, from, to) {
    animateCount(from.jobs, to.jobs, 800, (val) =>
      setDisplayData((prev) => ({
        ...prev,
        [type]: { ...prev[type], jobs: val },
      }))
    );
    animateCount(from.parcels, to.parcels, 800, (val) =>
      setDisplayData((prev) => ({
        ...prev,
        [type]: { ...prev[type], parcels: val },
      }))
    );
  }

  useEffect(() => {
    // Simulate fetching data for a single user
    setTimeout(() => {
      setData(mockApiResponse);
      animateSingle(
        'Dig',
        displayData.Dig || { jobs: 0, parcels: 0 },
        mockApiResponse.Dig
      );
      animateSingle(
        'QC',
        displayData.QC || { jobs: 0, parcels: 0 },
        mockApiResponse.QC
      );
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBox = (label, value, color = 'gray') => (
    <div className="flex flex-col items-center justify-center py-1 w-full text-center">
      <div className={`text-2xl font-semibold text-${color}-600`}>{value}</div>
      <div className="text-xs font-medium text-gray-400 mt-0.5">{label}</div>
    </div>
  );

  const renderStat = (typeLabel, jobs, parcels) => (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
        {typeLabel}
      </h4>
      <div className="flex flex-row gap-4 w-full max-w-[200px] justify-around">
        {renderBox('Jobs', jobs, 'blue')}
        {renderBox('Parcels', parcels, 'gray')}
      </div>
    </div>
  );

  return (
    <>
      <h3 className="text-md font-semibold text-black mb-3">
        Today’s Production
      </h3>
      <div className="w-full flex-1">
        {role === 'Dig' &&
          renderStat(
            'Digitising',
            displayData.Dig?.jobs ?? 0,
            displayData.Dig?.parcels ?? 0
          )}
        {role === 'QC' &&
          renderStat(
            'QC',
            displayData.QC?.jobs ?? 0,
            displayData.QC?.parcels ?? 0
          )}
      </div>
    </>
  );
}
