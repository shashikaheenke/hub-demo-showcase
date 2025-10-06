import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaChartBar,
  FaTools,
  FaFileAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const mainItems = [
  { label: 'Home', icon: <FaHome size={20} />, type: 'link', path: '/' },
  {
    label: 'MIR',
    icon: <FaBriefcase size={15} />,
    type: 'link',
    path: '/mir/dashboard',
  },
  { label: 'Users', icon: <FaUsers size={15} />, type: 'button' },
  { label: 'Stats', icon: <FaChartBar size={15} />, type: 'button' },
  { label: 'Tools', icon: <FaTools size={15} />, type: 'button' },
  { label: 'Sheets', icon: <FaFileAlt size={15} />, type: 'button' },
  { label: 'Dashboards', icon: <FaTachometerAlt size={15} />, type: 'button' },
  { label: 'My Account', icon: <FaUserCircle size={15} />, type: 'button' },
];

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 120 },
  }),
  hover: { scale: 1.08 },
  tap: { scale: 0.97 },
};

export default function Sidebar({ onSelectMenu, activeMenu }) {
  const location = useLocation();

  return (
    <aside
      className="h-full w-24 bg-gray-50 border-r border-gray-200 rounded-xl shadow-xl flex flex-col items-center pt-4"
      style={{ minWidth: '96px' }}
    >
      {mainItems.map((item, i) => {
        const isActive =
          (item.path && location.pathname === item.path) ||
          activeMenu === item.label;

        // This object holds the animation props for framer-motion.
        const motionProps = {
          custom: i,
          initial: 'hidden',
          animate: 'visible',
          whileHover: 'hover',
          whileTap: 'tap',
          variants: itemVariants,
        };

        const content = (
          <div
            className={`flex flex-col items-center w-full py-3 px-1 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-cyan-100 border-l-4 border-cyan-500 text-cyan-900 font-bold shadow'
                : 'text-cyan-700 hover:bg-cyan-50'
            }`}
            title={item.label}
          >
            {item.icon}
            <span className="mt-1 text-xs">{item.label}</span>
          </div>
        );

        if (item.type === 'link') {
          // The 'key' prop is now passed directly to the motion.div, not spread inside motionProps.
          return (
            <motion.div
              key={item.label}
              {...motionProps}
              onClick={() => onSelectMenu(null)}
            >
              <Link to={item.path}>{content}</Link>
            </motion.div>
          );
        }

        // The 'key' is also passed directly here for the motion.button.
        return (
          <motion.button
            key={item.label}
            {...motionProps}
            onClick={() =>
              onSelectMenu(item.label === activeMenu ? null : item.label)
            }
          >
            {content}
          </motion.button>
        );
      })}

      <motion.button
        onClick={() => alert('Logout is disabled.')}
        /* ... */ className="flex flex-col items-center w-full py-5 rounded-lg text-red-700 hover:bg-red-50 transition mt-auto mb-6"
      >
        <FaSignOutAlt size={12} />
        <span className="mt-1 text-xs">Logout</span>
      </motion.button>
    </aside>
  );
}
