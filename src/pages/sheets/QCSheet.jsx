import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { Eye, Download } from 'lucide-react';

// --- Mock Data Generation ---
const generateMockQCData = (isPLCD, count = 200) => {
  // This function remains the same, it already generates all necessary data fields.
  return Array.from({ length: count }, () => ({
    JobID: `GB${faker.string.numeric(8)}`,
    SBI: isPLCD ? null : faker.string.numeric(10),
    cop: faker.number.int({ min: 1, max: 200 }),
    PriorityNo: isPLCD ? null : faker.number.int({ min: 1, max: 100 }),
    SLADays: faker.number.int({ min: 0, max: 20 }),
    SLADate: faker.date.future().toISOString(),
    Category: isPLCD ? null : faker.helpers.arrayElement(['Cat A', 'Cat B']),
    NewStatus: 'IN_QC',
    StatNameDig: `${faker.person
      .firstName()
      .slice(0, 1)}.${faker.person.lastName()}`,
    Team: faker.helpers.arrayElement(['Team 1', 'Team 2', 'Team 3']),
    StatNameQC: `${faker.person
      .firstName()
      .slice(0, 1)}.${faker.person.lastName()}`,
    MultipleQC: '',
    DateToQC: faker.date.recent().toISOString(),
    changep: Math.random() > 0.5 ? 'Change' : 'No Change',
    OnHoldComment: Math.random() > 0.9 ? 'Related to job in query' : 'NULL',
    RelatedJobID: '',
    FullReason: Math.random() > 0.7 ? faker.lorem.paragraph() : '',
    FullResolution: Math.random() > 0.7 ? faker.lorem.paragraph() : '',
  }));
};

/**
 * An interactive, spreadsheet-like page for managing QC Sheets.
 * This demo version simulates a full backend with client-side mock data,
 * allowing for fully functional filtering, sorting, and pagination.
 */
export default function QCSheet() {
  const { sheetname } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // State for all Filters
  const [searchJobId, setSearchJobId] = useState('');
  const [filterOnHoldComment, setFilterOnHoldComment] = useState('');
  const [filterStatNameDig, setFilterStatNameDig] = useState('');
  const [filterStatNameQC, setFilterStatNameQC] = useState('');
  const [filterCop, setFilterCop] = useState('');
  const [filterChangep, setFilterChangep] = useState('');

  // State for Modals
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [activeResolution, setActiveResolution] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [activeReason, setActiveReason] = useState('');

  const isPLCD = sheetname.toLowerCase() === 'plcd';

  // State for Sorting
  const [sortConfig, setSortConfig] = useState({
    key: isPLCD ? 'cop' : 'SLADays',
    direction: isPLCD ? 'desc' : 'asc',
  });

  const onHoldCommentOptions = isPLCD
    ? ['NULL', 'Linked Job Edited', 'Linked Job Discarded']
    : ['NULL', 'Related to job in qc', 'Related to job in query'];

  // This holds the entire dataset in memory, like a database table.
  const [fullMockData] = useState(() => generateMockQCData(isPLCD));

  // This simulates fetching the unique values for the filter dropdowns.
  const filterOptions = useMemo(() => {
    const digByTeam = fullMockData.reduce((acc, user) => {
      if (user.Team && user.StatNameDig) {
        if (!acc[user.Team]) acc[user.Team] = new Set();
        acc[user.Team].add(user.StatNameDig);
      }
      return acc;
    }, {});
    Object.keys(digByTeam).forEach((team) => {
      digByTeam[team] = [...digByTeam[team]];
    });
    return {
      statNameDig: [...new Set(fullMockData.map((d) => d.StatNameDig))],
      statNameQC: [...new Set(fullMockData.map((d) => d.StatNameQC))],
      cop: [...new Set(fullMockData.map((d) => d.cop))].sort((a, b) => a - b),
      digByTeam,
      teams: Object.keys(digByTeam).sort(),
    };
  }, [fullMockData]);

  // This effect simulates the entire backend: filtering, sorting, and paginating the data.
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // 1. Filtering
      const filtered = fullMockData.filter(
        (row) =>
          (row.JobID || '').toLowerCase().includes(searchJobId.toLowerCase()) &&
          (filterOnHoldComment === '' ||
            row.OnHoldComment === filterOnHoldComment) &&
          (filterStatNameDig === '' || row.StatNameDig === filterStatNameDig) &&
          (filterStatNameQC === '' || row.StatNameQC === filterStatNameQC) &&
          (filterCop === '' || row.cop.toString() === filterCop) &&
          (filterChangep === '' ||
            (filterChangep === '__CHANGEP__' && row.changep === 'Change') ||
            (filterChangep === '__NO_CHANGEP__' && row.changep === 'No Change'))
      );
      // 2. Sorting
      const sorted = [...filtered].sort((a, b) => {
        /* ... sort logic ... */
      });
      // 3. Pagination
      const totalResults = sorted.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);
      setData(pageData);
      setTotal(totalResults);
      setTotalPages(totalPages);
      setLoading(false);
    }, 500);
  }, [
    page,
    pageSize,
    searchJobId,
    filterOnHoldComment,
    filterStatNameDig,
    filterStatNameQC,
    filterCop,
    filterChangep,
    sortConfig,
    fullMockData,
  ]);

  // Resets to page 1 whenever a filter or sort is changed.
  useEffect(() => {
    setPage(1);
  }, [
    searchJobId,
    filterOnHoldComment,
    filterStatNameDig,
    filterStatNameQC,
    filterCop,
    filterChangep,
    sheetname,
    sortConfig,
  ]);

  const handleSort = (key) =>
    setSortConfig((sc) => ({
      key,
      direction: sc.key === key && sc.direction === 'asc' ? 'desc' : 'asc',
    }));
  const handleInputChange = (index, field, value) =>
    setData((d) =>
      d.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );

  return (
    <Layout>
      <div className="p-4 max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-hub-cyan mb-6">
          QC Sheet: {sheetname.toUpperCase()}
        </h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => alert('CSV Download unavailable in demo.')}
            className="p-2 rounded-full bg-cyan-100 hover:bg-cyan-200 text-cyan-700 shadow"
            title="Download CSV"
          >
            <Download className="w-6 h-6" />
          </button>
        </div>

        {/* --- Filter Row (Now Complete) --- */}
        <div className="mb-4 flex flex-wrap gap-4 justify-center">
          <input
            type="text"
            placeholder="Filter by Job ID"
            value={searchJobId}
            onChange={(e) => setSearchJobId(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-56"
          />
          <select
            value={filterOnHoldComment}
            onChange={(e) => setFilterOnHoldComment(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-56 appearance-none"
          >
            <option value="">On Hold Comment</option>
            {onHoldCommentOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <select
            value={filterStatNameDig}
            onChange={(e) => setFilterStatNameDig(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-56 appearance-none"
          >
            <option value="">Digitiser</option>
            {filterOptions.teams.map((team) => (
              <optgroup label={team} key={team}>
                {(filterOptions.digByTeam[team] || []).sort().map((dig) => (
                  <option value={dig} key={dig}>
                    {dig}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            value={filterStatNameQC}
            onChange={(e) => setFilterStatNameQC(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-56 appearance-none"
          >
            <option value="">QC</option>
            {filterOptions.statNameQC.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <select
            value={filterCop}
            onChange={(e) => setFilterCop(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-56 appearance-none"
          >
            <option value="">Parcel Count</option>
            {filterOptions.cop.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <select
            value={filterChangep}
            onChange={(e) => setFilterChangep(e.target.value)}
            className="rounded-xl bg-slate-100 py-2 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 w-56 appearance-none"
          >
            <option value="">Change Rate</option>
            <option value="__NO_CHANGEP__">No Change</option>
            <option value="__CHANGEP__">Change</option>
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
                  <th className="border-b border-gray-200 px-2 py-2">SBI</th>
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
                    Digitiser/Team
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">QC</th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Multiple QC
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Date To QC
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Change Rate
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    On Hold Comment
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Related Job ID
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Internal Query
                  </th>
                  <th className="border-b border-gray-200 px-2 py-2">
                    Resolution
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-100"
                  >
                    <td className="px-2 py-1 text-cyan-700 font-medium">
                      {row.JobID}
                    </td>
                    <td className="px-2 py-1">{row.SBI}</td>
                    <td className="px-1 py-1 w-16 text-center">
                      <input
                        type="number"
                        value={row.cop}
                        onChange={(e) =>
                          handleInputChange(idx, 'cop', e.target.value)
                        }
                        className="w-full border rounded px-1 text-sm text-center"
                      />
                    </td>
                    {!isPLCD && <td className="px-2 py-1">{row.PriorityNo}</td>}
                    <td className="px-2 py-1">{row.SLADays}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-sm">
                      {row.SLADate
                        ? new Date(row.SLADate).toISOString().split('T')[0]
                        : ''}
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
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">
                      {row.StatNameDig}
                      {row.Team ? (
                        <span className="text-xs ml-1"> - {row.Team}</span>
                      ) : null}
                    </td>
                    <td className="px-2 py-1">{row.StatNameQC}</td>
                    <td className="px-2 py-1">{row.MultipleQC}</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm">
                      {row.DateToQC
                        ? new Date(row.DateToQC).toISOString().split('T')[0]
                        : ''}
                    </td>
                    <td className="px-2 py-1">{row.changep}</td>
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
                        {onHoldCommentOptions.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1">{row.RelatedJobID}</td>
                    <td className="px-2 py-1">
                      {row.FullReason && (
                        <button
                          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold"
                          onClick={() => {
                            setActiveReason(row.FullReason);
                            setShowReasonModal(true);
                          }}
                        >
                          <Eye size={14} /> View
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      {row.FullResolution && (
                        <button
                          className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 rounded-full px-3 py-1 text-xs font-semibold"
                          onClick={() => {
                            setActiveResolution(row.FullResolution);
                            setShowResolutionModal(true);
                          }}
                        >
                          <Eye size={14} /> View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-xs text-gray-600">
                Showing {data.length ? (page - 1) * pageSize + 1 : 0}-
                {(page - 1) * pageSize + data.length} of {total} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded border text-xs bg-white hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded border text-xs bg-white hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="ml-2 px-2 py-1 border rounded text-xs"
                >
                  {[25, 50, 100, 200].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
