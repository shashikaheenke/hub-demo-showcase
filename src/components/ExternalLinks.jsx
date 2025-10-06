import React from 'react';
import { ExternalLink, Map, Compass } from 'lucide-react';

// For the demo, we replace real links with '#' and images with icons.
const links = [
  {
    href: '#',
    icon: <Map className="h-12 w-12 text-cyan-600" />,
    label: 'LMS',
    desc: 'Land Management System',
  },
  {
    href: '#',
    icon: <Compass className="h-12 w-12 text-cyan-600" />,
    label: 'Compass',
    desc: 'Protocol Guidance',
  },
];

export default function ExternalLinks() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <div className="grid gap-4 grid-cols-2 justify-items-center w-full">
        {links.map(({ href, icon, label, desc }) => (
          <a
            key={label}
            href={href}
            onClick={(e) => e.preventDefault()}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center bg-white/80 border border-cyan-100 rounded-xl p-4 hover:scale-105 transition-transform hover:shadow-lg shadow w-full max-w-[190px] cursor-pointer"
            style={{
              minHeight: 140,
              boxShadow: '0 2px 14px 0 rgba(0,140,158,0.07)',
            }}
          >
            <span className="absolute top-2 right-2 text-cyan-400 group-hover:text-cyan-600 transition">
              <ExternalLink className="w-4 h-4" />
            </span>
            <div className="relative mb-2 mt-2">{icon}</div>
            <span className="text-base font-bold text-gray-900 mb-0.5">
              {label}
            </span>
            <span className="text-xs text-gray-600 text-center">{desc}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
