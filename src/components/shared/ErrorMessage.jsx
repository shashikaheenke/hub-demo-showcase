// components/shared/ErrorMessage.jsx
import React from 'react';

export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-red-600">
      <svg
        className="w-12 h-12 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        />
      </svg>
      <p className="text-lg font-semibold">{message}</p>
      <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
    </div>
  );
}
