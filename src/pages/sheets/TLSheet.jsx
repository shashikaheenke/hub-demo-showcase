import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Helper Data ---
const newStatusOptions = [
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_QC',
  'IN_QUERY',
  'INTERNAL_QUERY',
];
const onHoldOptions = {
  plcd: ['Linked Job Edited', 'Linked Job Discarded'],
  default: ['Related to job in qc', 'Related to job in query'],
};

// --- Mock Data Generation ---
const generateMockTLData = (isPLCD, count = 200) => {
  return Array.from({ length: count }, () => ({
    JobID: `GB${faker.string.numeric(8)}`,
    StatNameQC:
      faker.person.firstName().slice(0, 1) + '.' + faker.person.lastName(),
    StatNameDig:
      faker.person.firstName().slice(0, 1) + '.' + faker.person.lastName(),
    NewStatus: faker.helpers.arrayElement(newStatusOptions),
    Comment: faker.helpers.arrayElement(
      isPLCD ? onHoldOptions.plcd : onHoldOptions.default
    ),
    SBI: isPLCD ? faker.string.numeric(10) : faker.string.numeric(10),
    SBICount: isPLCD ? faker.number.int({ min: 1, max: 5 }) : null,
    SLADays: faker.number.int({ min: 0, max: 20 }),
    MultipleQC: '',
    FRN: isPLCD ? null : faker.string.numeric(9),
    CreatedDate: isPLCD ? null : faker.date.past().toISOString(),
    Category: isPLCD ? null : 'Cat A',
  }));
};

/**
 * A filter-driven page for Team Leaders to search for specific jobs.
 * This demo simulates the debounced search functionality, showing results
 * only after the user has typed in the filter fields.
 */
export default function TLSheet() {
  const { sheetname } = useParams();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isPLCD = sheetname.toLowerCase() === 'plcd';
  const debounceTimer = useRef(null);

  // This holds the entire dataset in memory, which we will search on the client side.
  const [fullMockData] = useState(() => generateMockTLData(isPLCD));

  const fields = isPLCD
    ? [
        { label: 'Job ID', field: 'JobID' },
        { label: 'StatNameQC', field: 'StatNameQC' },
        { label: 'StatNameDigi', field: 'StatNameDig' },
        {
          label: 'New Status',
          field: 'NewStatus',
          isSelect: true,
          options: newStatusOptions,
        },
        {
          label: 'On Hold Comment',
          field: 'Comment',
          isSelect: true,
          options: onHoldOptions.plcd,
        },
        { label: 'SBI', field: 'SBI' },
        { label: 'SBI Count', field: 'SBICount' },
        { label: 'SLA Days', field: 'SLADays' },
        { label: 'Multiple QC', field: 'MultipleQC' },
      ]
    : [
        { label: 'Job ID', field: 'JobID' },
        { label: 'SBI', field: 'SBI' },
        { label: 'FRN', field: 'FRN' },
        { label: 'StatNameQC', field: 'StatNameQC' },
        { label: 'StatNameDigi', field: 'StatNameDig' },
        { label: 'Created Date', field: 'CreatedDate' },
        { label: 'SLA Days', field: 'SLADays' },
        {
          label: 'New Status',
          field: 'NewStatus',
          isSelect: true,
          options: newStatusOptions,
        },
        { label: 'Category', field: 'Category' },
        { label: 'Multiple QC', field: 'MultipleQC' },
        {
          label: 'On Hold Comment',
          field: 'Comment',
          isSelect: true,
          options: onHoldOptions.default,
        },
      ];

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  // This effect simulates the debounced backend search on the client side.
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const hasAnyFilter = Object.values(filters).some(
        (v) => v?.toString().trim() !== ''
      );
      if (!hasAnyFilter) {
        setData([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Fake a short network delay for the search.
      setTimeout(() => {
        const results = fullMockData.filter((row) =>
          Object.entries(filters).every(
            ([key, value]) =>
              !value ||
              (row[key] || '')
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
          )
        );
        setData(results);
        setLoading(false);
      }, 800);
    }, 500); // 500ms debounce time
    return () => clearTimeout(debounceTimer.current);
  }, [filters, sheetname, fullMockData]);

  const renderInput = (label, field, isSelect = false, options = []) => (
    <div key={field}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isSelect ? (
        <select
          className="w-full rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
          value={filters[field] || ''}
          onChange={(e) => handleFilterChange(field, e.target.value)}
        >
          <option value="">-- All --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="w-full rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
          value={filters[field] || ''}
          onChange={(e) => handleFilterChange(field, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-hub-cyan mb-6">
          TL Sheet: {sheetname.toUpperCase()}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
          {fields.map((f) =>
            renderInput(f.label, f.field, f.isSelect, f.options)
          )}
        </div>

        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}

        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="table-auto w-full text-sm text-center">
            <thead className="bg-hub-cyan-light text-hub-cyan font-semibold">
              <tr>
                {fields.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-2 border-b border-gray-200"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <tr
                    key={`${row.JobID}-${idx}`}
                    className="hover:bg-hub-cyan-lighter border-b border-gray-100 last:border-b-0"
                  >
                    {fields.map((col) => (
                      <td key={col.field} className="px-3 py-2">
                        {String(row[col.field] ?? '').trim()}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={fields.length}
                    className="px-3 py-12 text-gray-500"
                  >
                    Enter filter criteria to see results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
