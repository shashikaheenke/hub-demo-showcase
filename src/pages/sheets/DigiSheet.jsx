import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Mock Data Generation ---
const generateMockSheetData = (isPLCD) => {
  return Array.from({ length: 50 }, () => ({
    JobID: `GB${faker.string.numeric(8)}`,
    SBI: isPLCD ? null : faker.string.numeric(10),
    SBICount: isPLCD ? null : faker.number.int({ min: 1, max: 5 }),
    cop: faker.number.int({ min: 1, max: 200 }),
    PriorityNo: isPLCD ? null : faker.number.int({ min: 1, max: 100 }),
    SLADays: faker.number.int({ min: 0, max: 20 }),
    SLADate: faker.date.future().toISOString(),
    Category: isPLCD ? null : faker.helpers.arrayElement(['Cat A', 'Cat B']),
    NewStatus: 'ASSIGNED',
    StatNameDig: `${faker.person
      .firstName()
      .slice(0, 1)}.${faker.person.lastName()}`,
    StatNameQC: `${faker.person
      .firstName()
      .slice(0, 1)}.${faker.person.lastName()}`,
    OnHoldComment: 'NULL',
    RelatedJobID: '',
    status: 'Unassigned',
    FullResolution: Math.random() > 0.5 ? faker.lorem.paragraph() : '',
    InternalQuery: Math.random() > 0.8 ? 'Pending' : '',
    FullReason: Math.random() > 0.8 ? faker.lorem.sentence() : '',
  }));
};

/**
 * An interactive, spreadsheet-like page for managing Digi Sheets.
 * This demo version simulates all API calls and allows for client-side sorting,
 * filtering, and inline editing of the data grid.
 */
export default function DigiSheet() {
  const { sheetname } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'SLADays',
    direction: 'asc',
  });
  const [searchJobId, setSearchJobId] = useState('');
  const [filterOnHoldComment, setFilterOnHoldComment] = useState('');

  // State for the "View IQ" modal
  const [viewIQOpen, setViewIQOpen] = useState(false);
  const [viewIQJobId, setViewIQJobId] = useState('');
  const [viewIQText, setViewIQText] = useState('');

  const isPLCD = sheetname?.toLowerCase() === 'plcd';

  // This effect simulates fetching the sheet data.
  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setData(generateMockSheetData(isPLCD));
      setLoading(false);
    }, 1200);
  }, [sheetname, isPLCD]);

  // Handles the client-side sorting of the table data.
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  // This memoized value performs all filtering and sorting on the client side.
  const sortedData = useMemo(() => {
    let filtered = data.filter((row) => {
      const jobIdMatch = (row.JobID || '')
        .toLowerCase()
        .includes(searchJobId.toLowerCase());
      const commentMatch =
        filterOnHoldComment === '' ||
        (row.OnHoldComment || 'NULL') === filterOnHoldComment;
      return jobIdMatch && commentMatch;
    });
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal =
        sortConfig.key === 'SLADate'
          ? new Date(a[sortConfig.key])
          : a[sortConfig.key];
      const bVal =
        sortConfig.key === 'SLADate'
          ? new Date(b[sortConfig.key])
          : b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, searchJobId, filterOnHoldComment]);

  // This function handles inline edits and updates the local state instantly.
  const handleInputChange = (index, field, value) => {
    const rowToUpdate = sortedData[index];
    const originalIndex = data.findIndex(
      (item) => item.JobID === rowToUpdate.JobID
    );
    if (originalIndex !== -1) {
      const updatedData = [...data];
      updatedData[originalIndex][field] = value;
      setData(updatedData);
    }
  };

  // Simulates opening the various modals.
  const openRaiseQueryModal = (jobId) =>
    alert(
      `This would open the 'Raise Internal Query' modal for Job ID: ${jobId}`
    );
  const openViewIQ = (jobId, fullReason) => {
    setViewIQJobId(jobId);
    setViewIQText(fullReason || '(No details provided)');
    setViewIQOpen(true);
  };
  const closeViewIQ = () => setViewIQOpen(false);

  return (
    <Layout>
      <div className="p-6 max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-hub-cyan mb-6">
          Digi Sheet: {sheetname?.toUpperCase()}
        </h1>
        <div className="mb-4 flex justify-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Filter by Job ID"
            value={searchJobId}
            onChange={(e) => setSearchJobId(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-64"
          />
          <select
            value={filterOnHoldComment}
            onChange={(e) => setFilterOnHoldComment(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-64 appearance-none"
          >
            <option value="">Filter by On Hold Comment</option>
            {(isPLCD
              ? ['NULL', 'Linked Job Edited', 'Linked Job Discarded']
              : ['NULL', 'Related to job in qc', 'Related to job in query']
            ).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="rounded-xl shadow-lg bg-white overflow-x-auto">
            <table className="w-full table-auto text-sm text-center border-collapse">
              <thead className="bg-hub-cyan-light text-hub-cyan font-semibold sticky top-0">
                <tr>
                  <th className="border-b border-gray-200 px-2 py-2">Job ID</th>
                  {!isPLCD && (
                    <th className="border-b border-gray-200 px-2 py-2">SBI</th>
                  )}
                  {!isPLCD && (
                    <th className="border-b border-gray-200 px-2 py-2">
                      SBI Count
                    </th>
                  )}
                  <th
                    onClick={() => handleSort('cop')}
                    className="cursor-pointer border-b border-gray-200 px-2 py-2"
                  >
                    Parcel Count{' '}
                    {sortConfig.key === 'cop' &&
                      (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  {!isPLCD && (
                    <th className="border-b border-gray-200 px-2 py-2">
                      Priority
                    </th>
                  )}
                  <th
                    onClick={() => handleSort('SLADays')}
                    className="cursor-pointer border-b border-gray-200 px-2 py-2"
                  >
                    SLA Days{' '}
                    {sortConfig.key === 'SLADays' &&
                      (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('SLADate')}
                    className="cursor-pointer border-b border-gray-200 px-2 py-2"
                  >
                    SLA Deadline{' '}
                    {sortConfig.key === 'SLADate' &&
                      (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  {!isPLCD && (
                    <th className="border-b border-gray-200 px-2 py-2">
                      Category
                    </th>
                  )}
                  <th className="border-b border-gray-200 px-2 py-2">
                    Latest Status
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    StatNameDig
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    StatNameQC
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    On Hold Comment
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Related Job ID
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Related Job Status
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Resolution
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Internal Query
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr
                    key={row.JobID}
                    className="hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-2 py-1 text-cyan-700 font-medium">
                      {row.JobID}
                    </td>
                    {!isPLCD && <td className="px-2 py-1">{row.SBI}</td>}
                    {!isPLCD && <td className="px-2 py-1">{row.SBICount}</td>}
                    <td className="px-1 py-1 w-20">
                      <input
                        type="number"
                        value={row.cop}
                        onChange={(e) =>
                          handleInputChange(idx, 'cop', e.target.value)
                        }
                        className="w-full border rounded px-1 text-center"
                      />
                    </td>
                    {!isPLCD && <td className="px-2 py-1">{row.PriorityNo}</td>}
                    <td className="px-2 py-1">{row.SLADays}</td>
                    <td className="px-2 py-1">
                      {row.SLADate
                        ? new Date(row.SLADate).toISOString().split('T')[0]
                        : '-'}
                    </td>
                    {!isPLCD && <td className="px-2 py-1">{row.Category}</td>}
                    <td className="px-2 py-1">
                      <select
                        value={row.NewStatus}
                        onChange={(e) =>
                          handleInputChange(idx, 'NewStatus', e.target.value)
                        }
                        className="w-full border rounded text-sm"
                      >
                        {' '}
                        {[
                          'ASSIGNED',
                          'IN_PROGRESS',
                          'IN_QC',
                          'IN_QUERY',
                          'INTERNAL_QUERY',
                        ].map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}{' '}
                      </select>
                    </td>
                    <td className="px-2 py-1">{row.StatNameDig}</td>
                    <td className="px-2 py-1">{row.StatNameQC}</td>
                    <td className="px-2 py-1">
                      <select
                        value={row.OnHoldComment || 'NULL'}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            'OnHoldComment',
                            e.target.value
                          )
                        }
                        className="w-full border rounded text-sm"
                      >
                        {(isPLCD
                          ? [
                              'NULL',
                              'Linked Job Edited',
                              'Linked Job Discarded',
                            ]
                          : [
                              'NULL',
                              'Related to job in qc',
                              'Related to job in query',
                            ]
                        ).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={row.RelatedJobID || ''}
                        onChange={(e) =>
                          handleInputChange(idx, 'RelatedJobID', e.target.value)
                        }
                        className="w-full border rounded px-1 text-sm"
                      />
                    </td>
                    <td className="px-2 py-1">{row.status}</td>
                    <td className="px-2 py-1">{row.FullResolution}</td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openRaiseQueryModal(row.JobID)}
                          className="bg-hub-cyan text-white px-3 py-1 rounded hover:opacity-90 text-xs"
                        >
                          Raise IQ
                        </button>
                        {row.FullReason && (
                          <button
                            onClick={() =>
                              openViewIQ(row.JobID, row.FullReason)
                            }
                            className="border border-hub-cyan text-hub-cyan px-3 py-1 rounded hover:bg-hub-cyan-light text-xs"
                          >
                            View IQ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* This is the modal for viewing the FullReason text */}
        {viewIQOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={closeViewIQ}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-hub-cyan">
                  Original Internal Query — {viewIQJobId}
                </h2>
                <button
                  onClick={closeViewIQ}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="border rounded p-3 bg-gray-50 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                {viewIQText}
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={closeViewIQ}
                  className="bg-hub-cyan text-white px-4 py-1.5 rounded hover:opacity-90 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
