import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  Check,
  AlertTriangle,
  Loader2,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { faker } from '@faker-js/faker';
import Layout from '../../components/Layout';

/**
 * A page for adding a new user.
 * In this demo version, the form submission is simulated to show the complete UI flow,
 * including loading states and success messages with generated credentials.
 */
export default function AddUser() {
  const navigate = useNavigate();

  // This state object holds all the data from the form's input fields.
  const [formData, setFormData] = useState({
    fname: '',
    sname: '',
    email: '',
    corpId: '',
    digitiserId: '',
    lmsUserId: '',
    startDate: '',
    agency: '',
    credentialId: '',
    team: '',
  });

  // State for managing UI feedback, like loading spinners and toast messages.
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [newUserCredentials, setNewUserCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Updates the formData state whenever an input field changes.
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Simulates submitting the form data to a backend.
   * It includes a fake network delay to mimic a real API call.
   */
  async function handleSubmit(e) {
    e.preventDefault(); // Prevents the browser from reloading the page on submit.
    setLoading(true);
    setNewUserCredentials(null);
    setToast(null);

    // Fake a 1.5-second network delay to show the loading state.
    setTimeout(() => {
      // On success, we generate fake credentials for the demo.
      setNewUserCredentials({
        email: formData.email,
        password: faker.internet.password(10),
        userId: faker.string.uuid().slice(0, 8).toUpperCase(),
      });

      // Trigger a success toast notification.
      setToast({
        type: 'success',
        message: 'User added successfully! Credentials are shown below.',
      });

      // Clear the form fields for the next entry.
      setFormData({
        fname: '',
        sname: '',
        email: '',
        corpId: '',
        digitiserId: '',
        lmsUserId: '',
        startDate: '',
        agency: '',
        credentialId: '',
        team: '',
      });

      setLoading(false); // Deactivate the loading spinner.
    }, 1500);
  }

  // Handles the "Copy" button functionality for the generated credentials.
  async function copyCredentials() {
    if (!newUserCredentials) return;
    try {
      const text = `Email: ${newUserCredentials.email}\nTemporary Password: ${newUserCredentials.password}\nUser ID: ${newUserCredentials.userId}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Revert the "Copied!" text back to "Copy" after 2 seconds.
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy credentials:', err);
    }
  }

  return (
    <Layout>
      {/* The sticky header provides a consistent title and navigation. */}
      <div className="sticky top-0 z-20 shadow-sm bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-cyan-700" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
                Add New User
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* The main content area contains the form itself. */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Form sections are used to group related fields. */}
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Basic information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  name="fname"
                  value={formData.fname}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name *"
                  name="sname"
                  value={formData.sname}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="sm:col-span-2"
                />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                IDs & access
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Corp ID"
                  name="corpId"
                  value={formData.corpId}
                  onChange={handleInputChange}
                />
                <Input
                  label="Digitiser ID"
                  name="digitiserId"
                  value={formData.digitiserId}
                  onChange={handleInputChange}
                />
                <Input
                  label="LMS UserID"
                  name="lmsUserId"
                  value={formData.lmsUserId}
                  onChange={handleInputChange}
                />
                <Input
                  label="Credential ID"
                  name="credentialId"
                  placeholder="e.g. SYMC96824125"
                  value={formData.credentialId}
                  onChange={handleInputChange}
                />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Assignment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Agency"
                  name="agency"
                  value={formData.agency}
                  onChange={handleInputChange}
                >
                  <option value="">Select Agency</option>
                  <option value="Cyient">Cyient</option>
                  <option value="Kinect">Kinect</option>
                </Select>
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
                <Select
                  label="Team"
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  className="sm:col-span-2"
                >
                  <option value="">Select Team</option>
                  <option value="Team 1">Team 1</option>
                  <option value="Team 2">Team 2</option>
                  <option value="Team 3">Team 3</option>
                  <option value="Management">Management</option>
                </Select>
              </div>
            </section>

            {/* This block is conditionally rendered only after a successful submission. */}
            {newUserCredentials && (
              <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-yellow-900">
                      New User Credentials
                    </p>
                    <p className="text-xs text-yellow-800 mb-2">
                      Copy and share securely with the user.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyCredentials}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-yellow-100"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-white px-3 py-2">
                    <span className="text-slate-500">Email:</span>{' '}
                    <span className="font-medium">
                      {newUserCredentials.email}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2">
                    <span className="text-slate-500">Temp Password:</span>{' '}
                    <span className="font-mono">
                      {newUserCredentials.password}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2">
                    <span className="text-slate-500">User ID:</span>{' '}
                    <span className="font-medium">
                      {newUserCredentials.userId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Form action buttons are aligned to the right. */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 text-white px-5 py-2 text-sm font-medium hover:bg-cyan-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding User…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Add User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* The toast notification appears at the bottom on success or error. */}
      {toast && (
        <Toast type={toast.type} onClose={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </Layout>
  );
}

// --- Reusable Form Helper Components ---

// A standard label for a form input.
function Label({ children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

// A styled text input component.
function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
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
        placeholder={placeholder}
        // Uses a borderless, "glass" UI style with an inner shadow and a focus ring.
        className="mt-1 w-full rounded-xl bg-slate-100 py-2.5 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
        autoComplete="off"
      />
    </div>
  );
}

// A styled dropdown/select component.
function Select({ label, name, value, onChange, children, className = '' }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        // Uses the same borderless, glass-style look as the input fields.
        className="mt-1 w-full rounded-xl bg-slate-100 py-2.5 px-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-cyan-400"
      >
        {children}
      </select>
    </div>
  );
}

// A toast notification component for displaying success or error messages.
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
          aria-label="Close notification"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
