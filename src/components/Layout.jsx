import { useState } from 'react';
import Sidebar from './Sidebar';
import SubmenuPanel from './SubmenuPanel';
import SessionTimer from './SessionTimer';
import NotificationBell from './NotificationBell';

export default function Layout({ children }) {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gray-50" aria-hidden="true" />

      {/* --- ADDED COMPONENTS --- */}
      <div className="fixed top-4 right-32 z-50">
        <NotificationBell />
      </div>
      <div className="fixed top-4 right-6 z-40">
        <SessionTimer />
      </div>
      {/* ------------------------ */}

      <Sidebar onSelectMenu={setActiveMenu} activeMenu={activeMenu} />

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          activeMenu ? 'w-64' : 'w-0'
        }`}
      >
        {activeMenu && <SubmenuPanel activeMenu={activeMenu} />}
      </div>

      <main className="flex-1 p-6 overflow-auto bg-gray-50 rounded-xl shadow-xl m-4 border border-white border-opacity-30">
        {children}
      </main>
    </div>
  );
}
