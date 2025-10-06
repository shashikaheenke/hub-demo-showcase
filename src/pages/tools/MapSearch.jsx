import React, { useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import ErrorMessage from '../../components/shared/ErrorMessage';

/* --- SVG Icons for different file types --- */
const Icon = {
  map: (cls = '') => (
    <svg
      className={`h-7 w-7 ${cls}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="1.6" d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3Z" />
      <path strokeWidth="1.6" d="M9 6v12M15 9v12" />
    </svg>
  ),
  pdf: (cls = '') => (
    <svg className={`w-5 h-5 ${cls}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V9h5" />
    </svg>
  ),
  img: (cls = '') => (
    <svg className={`w-5 h-5 ${cls}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8 13l2.5 3 3.5-4.5L19 19H5l3-4z" />
    </svg>
  ),
  doc: (cls = '') => (
    <svg className={`w-5 h-5 ${cls}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V9h5" />
    </svg>
  ),
  xls: (cls = '') => (
    <svg className={`w-5 h-5 ${cls}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h12v20H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM9 8h6M9 12h6M9 16h6" />
    </svg>
  ),
  file: (cls = '') => (
    <svg className={`w-5 h-5 ${cls}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h12v20H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    </svg>
  ),
};

// Determines which icon to show based on the file extension.
function fileIconFor(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg', 'png', 'gif', 'svg'].includes(ext))
    return Icon.img('text-emerald-600');
  if (ext === 'pdf') return Icon.pdf('text-rose-600');
  if (['doc', 'docx'].includes(ext)) return Icon.doc('text-sky-600');
  if (['xls', 'xlsx', 'csv'].includes(ext)) return Icon.xls('text-green-700');
  return Icon.file('text-gray-400');
}

// --- Mock Data Generation ---
const generateMockResults = () =>
  Array.from({ length: 12 }, () => {
    const fileType = faker.helpers.arrayElement([
      '.pdf',
      '.jpg',
      '.docx',
      '.xlsx',
    ]);
    return {
      filename: `${faker.lorem.word()}_${faker.string.alphanumeric(
        8
      )}${fileType}`,
      relativePath: '#',
      modifiedDate: faker.date.past({ years: 2 }).toLocaleDateString('en-GB'),
      type: faker.helpers.arrayElement(['Map', 'Ortho', 'Vector']),
      year: faker.helpers.arrayElement(['2023', '2024', '2025']),
    };
  });
const mockResults = generateMockResults();

/**
 * A search page for finding map files. This demo version is fully interactive,
 * simulating an API search and providing client-side filtering and grouping of results.
 */
export default function MapSearch() {
  const [q, setQ] = useState('123456789'); // Pre-fill with a demo search term
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [touched, setTouched] = useState(false);
  const [inputRef, setInputRef] = useState(null);

  const clearSearch = () => {
    setQ('');
    setTouched(false);
    setResults([]);
    setErr('');
  };

  // This function simulates the API search call.
  async function onSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setTouched(true);
    setBusy(true);
    setErr('');
    setResults([]);
    // Fake a 1.5-second network delay.
    setTimeout(() => {
      // In a real app, you'd filter results. Here, we just return the full mock set.
      setResults(mockResults);
      setBusy(false);
    }, 1500);
  }

  // Client-side filtering and grouping logic.
  const years = useMemo(
    () => [...new Set(results.map((r) => r.year))].sort((a, b) => b - a),
    [results]
  );
  const types = useMemo(
    () => [...new Set(results.map((r) => r.type))].sort(),
    [results]
  );
  const [yearFilter, setYearFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const filtered = results.filter(
    (r) =>
      (yearFilter === 'all' || r.year === yearFilter) &&
      (typeFilter === 'all' || r.type === typeFilter)
  );
  const grouped = Object.entries(
    filtered.reduce((acc, f) => {
      const key = `${f.year}__${f.type}`;
      (acc[key] ||= []).push(f);
      return acc;
    }, {})
  ).sort(
    ([a], [b]) =>
      parseInt(b.split('__')[0], 10) - parseInt(a.split('__')[0], 10)
  );

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur shadow-sm bg-[radial-gradient(30%_60%_at_100%_0%,theme(colors.sky.50),transparent_60%),radial-gradient(40%_60%_at_0%_100%,theme(colors.teal.50),transparent_60%)]">
          <div className="relative flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 ring-1 ring-sky-200">
              {Icon.map('h-7 w-7')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Map Search</h1>
              <p className="text-slate-600 text-sm mt-0.5">
                Find maps by SBI, FRN, Job ID, or Parcel ID.
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-4 z-20">
          <div className="rounded-2xl  bg-white/85 backdrop-blur shadow-sm focus-within:ring-2 focus-within:ring-sky-500">
            <form
              onSubmit={onSearch}
              className="flex flex-wrap items-center gap-3 p-3"
            >
              <div className="relative flex-1 min-w-[260px]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="1.8"
                      d="m21 21-4.2-4.2M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </span>
                <input
                  ref={setInputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by SBI, FRN, Job ID..."
                  className="w-full rounded-full  px-10 py-3 focus:outline-none"
                  autoFocus
                />
                {q && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full  bg-slate-50 px-2 py-1">
                  <span className="text-xs text-slate-500">Year</span>
                  <select
                    className="bg-transparent text-sm px-1 py-1 focus:outline-none"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 rounded-full  bg-slate-50 px-2 py-1">
                  <span className="text-xs text-slate-500">Type</span>
                  <select
                    className="bg-transparent text-sm px-1 py-1 focus:outline-none"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-full bg-sky-600 text-white px-5 py-2.5 font-semibold hover:bg-sky-700 disabled:opacity-60"
                disabled={busy}
              >
                {busy ? 'Searching…' : 'Search'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {err && <ErrorMessage message={err} />}
          {busy && !err && (
            <div className="rounded-2xl  bg-white/80 p-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          )}
          {!busy && !err && touched && results.length === 0 && (
            <div className="rounded-2xl  bg-white/80 p-10 text-center">
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                {Icon.file('text-slate-400')}
              </div>
              <div className="text-slate-800 font-semibold">No maps found</div>
              <div className="text-slate-500 text-sm mt-1">
                Try a different search term.
              </div>
            </div>
          )}
          {!busy && !err && grouped.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {grouped.map(([key, files]) => {
                const [year, type] = key.split('__');
                return (
                  <section
                    key={key}
                    className="rounded-2xl  bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition"
                  >
                    <header className="flex items-center justify-between px-5 py-4 -b">
                      <h3 className="text-lg font-semibold text-slate-800">
                        <span className="text-[#008C9E]">{year}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="uppercase tracking-wide">{type}</span>
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {files.length} file{files.length !== 1 ? 's' : ''}
                      </span>
                    </header>
                    <ul className="px-5 py-3 divide-y">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 py-3">
                          {fileIconFor(f.filename)}
                          <a
                            href={f.relativePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-800 hover:text-sky-700 hover:underline truncate"
                            title={f.filename}
                          >
                            {f.filename}
                          </a>
                          <div className="ml-auto flex items-center gap-2 text-xs flex-shrink-0">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {f.modifiedDate}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {f.type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {f.year}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
