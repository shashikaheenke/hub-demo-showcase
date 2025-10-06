import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';
import {
  UserRoundPen,
  ArrowLeft,
  Check,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';

// A mock user object to pre-fill the form, simulating data fetched from an API.
const mockUser = {
  fname: 'Shashika',
  sname: 'Heenkende',
  email: 'shashika.h@example.com',
  team: 'Team 1',
  role: 'Dig',
  StatNameDig: 'S.HeenkendeDI',
  StatNameQC: 'S.HeenkendeQC',
  StatNameTL: '',
  LMSDIUserID: 'sh73404',
};

/**
 * A page for editing an existing user's details.
 * This demo version simulates fetching the user's current data to populate the form
 * and then simulates saving the updated information.
 */
export default function EditUser() {
  const { id } = useParams(); // Gets the user ID from the URL, e.g., /users/edit/1
  const navigate = useNavigate();

  // State to hold the user data being edited in the form.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // This effect simulates fetching the user's data when the page loads.
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser); // Load our mock user data into the form.
      setLoading(false);
    }, 800);
  }, [id]); // Re-runs if the ID in the URL changes.

  // Updates the user state as the form fields are edited.
  function handleChange(e) {
    const { name, value } = e.target;
    setUser((u) => ({ ...u, [name]: value }));
  }

  // Simulates saving the updated user data.
  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    // Fake a 1.5-second network delay for saving.
    setTimeout(() => {
      setToast({ type: 'success', message: 'User updated successfully.' });
      setSaving(false);
    }, 1500);
  }

  return (
    <Layout>
      {/* Sticky header with the corrected "glass" UI (no border). */}
      <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <UserRoundPen className="h-5 w-5 text-cyan-700" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
                Edit User
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Main form container with the corrected "glass" UI (no border). */}
        <div className="rounded-2xl bg-white shadow-lg">
          {loading ? (
            <div className="p-6">
              <LoadingIndicator />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorMessage message={error} />
            </div>
          ) : !user ? (
            <div className="p-6 text-slate-600">User not found.</div>
          ) : (
            <form onSubmit={handleSubmit} className="divide-y divide-slate-200">
              <section className="p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">
                  Basic information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="fname"
                    value={user.fname || ''}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="sname"
                    value={user.sname || ''}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={user.email || ''}
                    onChange={handleChange}
                    required
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Team"
                    name="team"
                    value={user.team || ''}
                    onChange={handleChange}
                  />
                  <div>
                    <Label>Role</Label>
                    <Select
                      name="role"
                      value={user.role || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Dig">Dig</option>
                      <option value="QC">QC</option>
                      <option value="Team Leader">Team Leader</option>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">
                  System identifiers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Digitiser ID"
                    name="StatNameDig"
                    value={user.StatNameDig || ''}
                    onChange={handleChange}
                  />
                  <Input
                    label="QC ID"
                    name="StatNameQC"
                    value={user.StatNameQC || ''}
                    onChange={handleChange}
                  />
                  <Input
                    label="TL ID"
                    name="StatNameTL"
                    value={user.StatNameTL || ''}
                    onChange={handleChange}
                  />
                  <Input
                    label="LMS UserID"
                    name="LMSDIUserID"
                    value={user.LMSDIUserID || ''}
                    onChange={handleChange}
                  />
                </div>
              </section>

              <div className="flex items-center justify-end gap-2 p-6 bg-slate-50/60">
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 text-white px-5 py-2 text-sm font-medium hover:bg-cyan-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Update User
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} onClose={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </Layout>
  );
}

// --- Helper Components with corrected "glass" UI ---
function Label({ children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}
function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  className = '',
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 w-full rounded-xl bg-slate-100 py-2.5 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
      />
    </div>
  );
}
function Select({ label, name, value, onChange, children, className = '' }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl bg-slate-100 py-2.5 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
      >
        {children}
      </select>
    </div>
  );
}
function Toast({ type = 'success', onClose, children }) {
  const styles = {
    success: 'border-emerald-200 bg-white',
    error: 'border-red-200 bg-white',
  };
  const Icon = type === 'success' ? Check : AlertTriangle;
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
