import React, { useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import ErrorMessage from '../../components/shared/ErrorMessage';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

/**
 * A tool for checking the agreement status of multiple Parcel IDs.
 * This demo version simulates the API call, generating random results
 * for each ID entered by the user, showcasing the complete interactive flow.
 */
export default function AgreementSearch() {
  const [input, setInput] = useState('GB12345678\nGB98765432\nINVALID_ID');
  const [results, setResults] = useState([]);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // This memoized value splits the textarea content into an array of trimmed, non-empty lines.
  const lines = useMemo(
    () =>
      input
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    [input]
  );

  /**
   * Simulates the search submission. It generates mock results based on the user's input.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!lines.length) return;
    setTouched(true);
    setBusy(true);
    setErr('');
    setResults([]);

    // Fake a 1.5-second network delay to show the loading skeleton.
    setTimeout(() => {
      // For each line the user entered, create a random result.
      const mockResults = lines.map((line) => {
        const random = Math.random();
        if (line.toLowerCase().includes('invalid')) {
          return {
            valid: false,
            formatted: line,
            message: 'Invalid Parcel ID format.',
          };
        }
        if (random < 0.6) {
          // 60% chance of success
          return {
            valid: true,
            found: false,
            formatted: line,
            message: 'No agreement found. OK to proceed.',
          };
        } else if (random < 0.9) {
          // 30% chance of failure
          return {
            valid: true,
            found: true,
            formatted: line,
            message: 'Agreement found. Do not use.',
          };
        } else {
          // 10% chance of warning/invalid
          return {
            valid: false,
            formatted: line,
            message: 'Could not validate ID.',
          };
        }
      });
      setResults(mockResults);
      setBusy(false);
    }, 1500);
  }

  const Empty = touched && !busy && !err && results.length === 0;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Parcel Agreement Checker
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Enter one Parcel ID per line to check agreement status.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mb-8 space-y-3 bg-white/80 backdrop-blur rounded-xl shadow-lg p-5"
        >
          <textarea
            className="w-full min-h-[120px] rounded-lg border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder={`Enter Parcel IDs, one per line\nExample:\nGB12345678\nGB98765432`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-700 text-white py-3 font-semibold hover:bg-slate-800 disabled:opacity-60 transition-colors"
            disabled={busy || !lines.length}
          >
            {busy ? 'Searching…' : 'Search'}
          </button>
        </form>

        <div className="space-y-6">
          {err && <ErrorMessage message={err} />}

          {/* This shows skeleton cards while "searching". */}
          {busy && !err && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-white/80 p-5 shadow-sm"
                >
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {Empty && (
            <div className="rounded-xl border bg-white/80 p-10 text-center">
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                <FaExclamationTriangle className="text-yellow-500" />
              </div>
              <div className="text-slate-800 font-semibold">
                No results found
              </div>
              <div className="text-slate-500 text-sm mt-1">
                Check the IDs and try again.
              </div>
            </div>
          )}

          {!busy && !err && results.length > 0 && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r, idx) => {
                let Icon;
                if (!r.valid)
                  Icon = (
                    <FaExclamationTriangle className="text-yellow-500 text-xl" />
                  );
                else if (r.found)
                  Icon = <FaTimesCircle className="text-red-500 text-xl" />;
                else
                  Icon = <FaCheckCircle className="text-green-500 text-xl" />;

                return (
                  <li
                    key={idx}
                    className="rounded-xl border bg-white/80 backdrop-blur shadow-sm p-5 flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">{Icon}</div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 font-mono">
                        {r.formatted}
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-800 break-words">
                        {r.message}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
