import React, { useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// --- Helper Functions & Data ---
const DURATIONS = [
  '1 Hour',
  '2 Hours',
  '3 Hours',
  '4 Hours',
  '5 Hours',
  '1/2 Day',
  '1 Day',
  '2 Days',
  '3 Days',
  '4 Days',
  '5 Days',
];
const OFFICES = ['NGH', 'AH', 'AP'];
const TRAINING_TYPES = [
  'New Joiners Training',
  'PLCD Training',
  'Refresher Training/QA Feedback',
  'PRINCE2 Foundation',
  'PRINCE2 Practitioner',
];
const CUSTOM_TEAMS = ['Project Team', 'Team 1', 'Team 2', 'Team 3'];

function formatDMY(d) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB');
}

// --- Mock Data Generation ---
const mockNames = [
  ...CUSTOM_TEAMS,
  ...Array.from({ length: 20 }, () => faker.person.fullName()),
];
const generateMockTrainingData = (count = 30) => {
  return Array.from({ length: count }, () => ({
    AUTOID: faker.string.uuid(),
    Name: faker.helpers.arrayElement(mockNames),
    Office: faker.helpers.arrayElement(OFFICES),
    DurationOfTraining: faker.helpers.arrayElement(DURATIONS),
    StartingDateTraining: faker.date
      .past({ years: 2 })
      .toISOString()
      .slice(0, 10),
    TypeOfTraining: faker.helpers.arrayElement(TRAINING_TYPES),
  }));
};

/**
 * A full CRUD (Create, Read, Update, Delete) page for managing training records.
 * This demo version is fully interactive, with all operations happening on the client side.
 */
export default function TrainingRecord() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [names, setNames] = useState([]);
  const [q, setQ] = useState(''); // Search query
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({}); // Form state for add/edit modal

  const isEditing = useMemo(() => Boolean(form?.AUTOID), [form]);

  // Client-side search filtering
  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        (r.Name || '').toLowerCase().includes(term) ||
        (r.TypeOfTraining || '').toLowerCase().includes(term)
    );
  }, [rows, q]);

  // Simulate initial data fetch
  useEffect(() => {
    setTimeout(() => {
      setRows(generateMockTrainingData());
      setNames(mockNames.sort());
      setLoading(false);
    }, 1000);
  }, []);

  const openAdd = () => {
    setForm({
      Name: '',
      Office: OFFICES[0],
      DurationOfTraining: DURATIONS[0],
      StartingDateTraining: '',
      TypeOfTraining: TRAINING_TYPES[0],
    });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      ...row,
      StartingDateTraining: formatDMY(row.StartingDateTraining),
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Simulates creating or updating a record
  async function onSubmit(e) {
    e.preventDefault();
    setModalOpen(false); // Close modal immediately for better UX
    if (isEditing) {
      // Update existing record in state
      setRows(rows.map((r) => (r.AUTOID === form.AUTOID ? form : r)));
    } else {
      // Add new record to state with a fake ID
      setRows([{ ...form, AUTOID: faker.string.uuid() }, ...rows]);
    }
  }

  // Simulates deleting a record
  async function onRemove(row) {
    // We use a simple alert for confirmation in this demo
    if (
      window.confirm(
        `Are you sure you want to remove the training record for ${row.Name}?`
      )
    ) {
      setRows(rows.filter((r) => r.AUTOID !== row.AUTOID));
    }
  }

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        <div className="mb-2 grid gap-3 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Training Record
            </h1>
            <p className="text-sm text-gray-500">
              Create, edit, and export training entries.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-full md:w-72 rounded-xl border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              className="px-3 py-2 rounded-xl shadow bg-emerald-600 text-white hover:opacity-90"
              onClick={openAdd}
            >
              Add Record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-sky-50">
              <tr>
                <th className="p-2 text-left font-semibold text-sky-800">
                  Name
                </th>
                <th className="p-2 text-left font-semibold text-sky-800">
                  Office
                </th>
                <th className="p-2 text-left font-semibold text-sky-800">
                  Duration
                </th>
                <th className="p-2 text-left font-semibold text-sky-800">
                  Start Date
                </th>
                <th className="p-2 text-left font-semibold text-sky-800">
                  Training Type
                </th>
                <th className="p-2 text-center font-semibold text-sky-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-3">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : (
                filteredRows.map((r, idx) => (
                  <tr
                    key={r.AUTOID ?? idx}
                    className="border-t-gray-700 hover:bg-gray-50"
                  >
                    <td className="p-2">{r.Name}</td>
                    <td className="p-2">{r.Office}</td>
                    <td className="p-2">{r.DurationOfTraining}</td>
                    <td className="p-2">{formatDMY(r.StartingDateTraining)}</td>
                    <td className="p-2">{r.TypeOfTraining}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:opacity-90"
                        onClick={() => openEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-md bg-rose-600 text-white hover:opacity-90"
                        onClick={() => onRemove(r)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={closeModal}
          >
            <div
              className="w-[560px] max-w-[95vw] rounded-2xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Edit Training' : 'Add Training Record'}
                </h2>
                <button
                  aria-label="Close"
                  className="px-3 py-1 rounded hover:bg-gray-100"
                  onClick={closeModal}
                >
                  ×
                </button>
              </div>
              <form onSubmit={onSubmit} className="p-4 space-y-4">
                <Select
                  label="Name"
                  name="Name"
                  value={form.Name}
                  onChange={onChange}
                >
                  <option value=""></option>
                  <optgroup label="Custom Teams">
                    {CUSTOM_TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="User Names">
                    {names
                      .filter((n) => !CUSTOM_TEAMS.includes(n))
                      .map((n, i) => (
                        <option key={`${n}-${i}`} value={n}>
                          {n}
                        </option>
                      ))}
                  </optgroup>
                </Select>
                <Select
                  label="Office"
                  name="Office"
                  value={form.Office}
                  onChange={onChange}
                >
                  {OFFICES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Duration of Training"
                  name="DurationOfTraining"
                  value={form.DurationOfTraining}
                  onChange={onChange}
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Starting Date of Training"
                  name="StartingDateTraining"
                  value={form.StartingDateTraining}
                  onChange={onChange}
                  placeholder="DD/MM/YYYY"
                />
                <Select
                  label="Type of Training"
                  name="TypeOfTraining"
                  value={form.TypeOfTraining}
                  onChange={onChange}
                >
                  {TRAINING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border hover:bg-slate-100"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Reusable Form components with "glass" UI
const Label = ({ children }) => (
  <label className="block text-sm font-medium text-slate-700 mb-1">
    {children}
  </label>
);
const Input = (props) => (
  <div>
    <Label>{props.label}</Label>
    <input
      {...props}
      className="mt-1 w-full rounded-xl bg-slate-100 py-2.5 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
    />
  </div>
);
const Select = (props) => (
  <div>
    <Label>{props.label}</Label>
    <select
      {...props}
      className="mt-1 w-full rounded-xl bg-slate-100 py-2.5 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
    >
      {props.children}
    </select>
  </div>
);
