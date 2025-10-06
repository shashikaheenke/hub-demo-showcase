// components/shared/LoadingIndicator.jsx
import React from 'react';

export default function LoadingIndicator({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-[#008C9E]">
      <svg
        className="animate-spin w-12 h-12 text-[#008C9E] mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
}
