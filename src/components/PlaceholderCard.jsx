import React from 'react';
import { FiLoader } from 'react-icons/fi';

export default function PlaceholderCard({ title }) {
  const cardClass = `
    bg-white rounded-xl shadow p-5 flex flex-col h-full
    min-h-[180px] w-full
  `;

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold mb-2 text-[#008C9E]">{title}</h3>
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <FiLoader className="animate-spin text-4xl mb-2" />
        <p className="text-sm">Data loading in demo...</p>
      </div>
    </div>
  );
}
