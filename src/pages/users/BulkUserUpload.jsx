import React, { useState } from 'react';
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorMessage from '../../components/shared/ErrorMessage';

// These are the fake results we'll show after the simulated upload.
const mockResults = [
  { email: 'shashika.h@example.com', status: 'added' },
  { email: 'alex.drake@example.com', status: 'added' },
  {
    email: 'jane.doe@example.com',
    status: 'failed',
    reason: 'Email already exists',
  },
  { email: 'sam.jones@example.com', status: 'added' },
  { email: 'invalid-email', status: 'failed', reason: 'Invalid email format' },
];

/**
 * A page for bulk-uploading users via a CSV file.
 * In this demo, the file upload is simulated to showcase the UI flow
 * for processing and displaying batch results.
 */
export default function BulkUserUpload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Simulates the file upload process.
   * It shows a loading indicator for a short duration and then displays mock results.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setError('');
    setResults([]);
    setLoading(true);

    // Fake a 2-second network delay to simulate the file being uploaded and processed.
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <CloudArrowUpIcon className="w-6 h-6 text-blue-500" />
          Bulk User Upload
        </h2>

        {/* Display general error messages here */}
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              !file || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </form>

        {/* The loading indicator is shown here during the fake upload */}
        {loading && (
          <div className="pt-8">
            <LoadingIndicator message="Processing file..." />
          </div>
        )}

        {/* The results list appears here after the upload is complete */}
        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Upload Results
            </h3>
            <ul className="space-y-2 text-sm">
              {results.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center space-x-2 p-2 rounded-md bg-gray-50"
                >
                  {r.status === 'added' ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="truncate">
                    <strong className="font-medium text-gray-800">
                      {r.email}
                    </strong>
                    : {r.status}
                    {r.reason && (
                      <span className="text-gray-500"> – {r.reason}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
