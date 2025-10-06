import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import {
  Search,
  ShieldCheck,
  UserRoundPen,
  RefreshCw,
  Mail,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowUpDown,
} from 'lucide-react';

// --- Mock Data Generation ---
// Generates a list of realistic-looking users for the demo.
function generateMockUsers(count = 50) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const fname = faker.person.firstName();
    const sname = faker.person.lastName();
    users.push({
      AutoID: i + 1,
      fname,
      sname,
      email: faker.internet
        .email({ firstName: fname, lastName: sname })
        .toLowerCase(),
      team: faker.helpers.arrayElement([
        'Team 1',
        'Team 2',
        'Team 3',
        'Management',
      ]),
      role: faker.helpers.arrayElement(['Dig', 'QC', 'Team Leader']),
    });
  }
  return users;
}

const mockUsers = generateMockUsers();

/**
 * A feature-rich page for managing users. This demo version is fully interactive,
 * with client-side search, filtering, sorting, and a functional modal confirmation flow.
 */
export default function UserManagement() {
  const navigate = useNavigate();

  // State for data and loading status.
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for UI controls like search and filters.
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'fname', dir: 'asc' });

  // State for the password reset modal.
  const [activeUser, setActiveUser] = useState(null);
  const [resetting, setResetting] = useState(false);

  // State for toast notifications.
  const [toast, setToast] = useState(null);

  // This effect simulates fetching the initial list of users.
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // useMemo is used for performance. These calculations only re-run when the 'users' array changes.
  const teamOptions = useMemo(() => {
    const set = new Set(users.map((u) => u.team).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [users]);
  const roleOptions = useMemo(() => {
    const set = new Set(users.map((u) => u.role).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [users]);

  // This performs the client-side filtering and sorting of the user list.
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => {
        const matchesQuery =
          !q || `${u.fname} ${u.sname} ${u.email}`.toLowerCase().includes(q);
        const matchesTeam = teamFilter === 'all' || u.team === teamFilter;
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesQuery && matchesTeam && matchesRole;
      })
      .sort((a, b) => {
        const { key, dir } = sort;
        const valA = (a[key] ?? '').toLowerCase();
        const valB = (b[key] ?? '').toLowerCase();
        return dir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  }, [users, query, teamFilter, roleFilter, sort]);

  // Toggles the sort direction when a column header is clicked.
  function toggleSort(key) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  }

  // Simulates the password reset API call.
  async function confirmReset() {
    if (!activeUser) return;
    setResetting(true);

    // Fake a 1.5-second network delay.
    setTimeout(() => {
      setToast({
        type: 'success',
        message: `Password for ${activeUser.fname} has been reset.`,
      });
      setResetting(false);
      setActiveUser(null); // Close the modal on success.
    }, 1500);
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-120px)] bg-slate-50">
        <div className="sticky top-0 z-20 shadow-sm bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-cyan-100 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-cyan-700" />
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
                  User Management
                </h1>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or email…"
                    className="w-full sm:w-72 rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-500"
                  />
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                </div>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm outline-none focus:border-cyan-500"
                >
                  {teamOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'all' ? 'All teams' : opt}
                    </option>
                  ))}
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm outline-none focus:border-cyan-500"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'all' ? 'All roles' : opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl bg-white shadow-sm">
            {loading ? (
              <div className="p-6">
                <LoadingIndicator />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorMessage message={error} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 shadow-sm">
                    <tr>
                      <Th
                        onClick={() => toggleSort('fname')}
                        active={sort.key === 'fname'}
                        dir={sort.dir}
                      >
                        Name
                      </Th>
                      <Th
                        onClick={() => toggleSort('team')}
                        active={sort.key === 'team'}
                        dir={sort.dir}
                      >
                        Team
                      </Th>
                      <Th
                        onClick={() => toggleSort('role')}
                        active={sort.key === 'role'}
                        dir={sort.dir}
                      >
                        Role
                      </Th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, idx) => (
                      <tr
                        key={u.AutoID}
                        className={idx % 2 ? 'bg-white' : 'bg-slate-50/40'}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={`${u.fname} ${u.sname}`} />
                            <div className="leading-tight">
                              <div className="font-medium text-slate-800">
                                {u.fname} {u.sname}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge text={u.team || '—'} />
                        </td>
                        <td className="px-4 py-3">
                          <Badge text={u.role || '—'} tone="cyan" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate('/users/edit/placeholder')
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 text-slate-700 px-3 py-1.5 hover:bg-slate-300 transition text-xs"
                            >
                              <UserRoundPen className="h-4 w-4" /> Edit
                            </button>
                            <button
                              onClick={() => setActiveUser(u)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 text-white px-3 py-1.5 hover:bg-cyan-700 transition text-xs"
                            >
                              <RefreshCw className="h-4 w-4" /> Reset Password
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="p-12 text-center text-slate-600">
                    <p>No users match your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={!!activeUser} onClose={() => setActiveUser(null)}>
        {activeUser && (
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-cyan-50 p-2 text-cyan-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Reset password?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  This will generate a new password for{' '}
                  <span className="font-medium">
                    {activeUser.fname} {activeUser.sname}
                  </span>
                  .
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                className="rounded-lg border px-4 py-2 text-sm"
                onClick={() => setActiveUser(null)}
                disabled={resetting}
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 text-white px-4 py-2 text-sm hover:bg-cyan-700 disabled:opacity-60"
                disabled={resetting}
              >
                {resetting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Resetting…
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" /> Confirm reset
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <Toast type={toast.type} onClose={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </Layout>
  );
}

// --- Self-Contained UI Helper Components ---
function Th({ children, onClick, active, dir }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
      <button
        onClick={onClick}
        className={`group inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-slate-200/60`}
      >
        <span className="text-slate-600">{children}</span>
        <ArrowUpDown
          className={`h-3.5 w-3.5 text-slate-400 transition ${
            active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
          }`}
          style={{
            transform: active && dir === 'desc' ? 'rotate(180deg)' : '',
          }}
        />
      </button>
    </th>
  );
}
function Avatar({ name }) {
  const initials = (name || '')
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
  return (
    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 text-slate-800 flex items-center justify-center font-semibold text-sm flex-shrink-0">
      {initials || '?'}
    </div>
  );
}
function Badge({ text, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    cyan: 'bg-cyan-100 text-cyan-800',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
        tones[tone] || tones.slate
      }`}
    >
      {text}
    </span>
  );
}
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
function Toast({ type = 'success', onClose, children }) {
  const styles = {
    success: 'border-emerald-200 bg-white',
    error: 'border-red-200 bg-white',
  };
  const Icon = type === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        className={`flex max-w-xl items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${styles}`}
      >
        <Icon
          className={`h-5 w-5 ${
            type === 'success' ? 'text-emerald-600' : 'text-red-600'
          }`}
        />
        <div className="text-sm text-slate-800">{children}</div>
        <button
          onClick={onClose}
          className="ml-2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
