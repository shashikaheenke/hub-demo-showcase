import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';

// Hardcoded mock notifications for the demo.
const mockNotifications = [
  { message: "New 'High Priority' job added", jobId: 'BPS-2023-XYZ' },
  { message: "Your 'Weekly Report' is ready for review", jobId: null },
  { message: 'System maintenance scheduled for tonight', jobId: null },
];

/**
 * A notification bell component that displays a list of mock notifications.
 * The bell shows a badge for unseen items, which clears when the bell is clicked.
 */
export default function NotificationBell() {
  const [notifications] = useState(mockNotifications);
  const [showList, setShowList] = useState(false);
  const [unseenCount, setUnseenCount] = useState(mockNotifications.length);

  // Refs are used to detect clicks outside of the component.
  const bellRef = useRef(null);
  const listRef = useRef(null);

  // This effect handles the "click outside to close" functionality.
  useEffect(() => {
    // Don't do anything if the list isn't open.
    if (!showList) return;

    function handleClickOutside(event) {
      // Check if the click was outside both the bell and the dropdown list.
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target) &&
        listRef.current &&
        !listRef.current.contains(event.target)
      ) {
        setShowList(false);
      }
    }

    // Add the event listener when the component mounts or the list opens.
    document.addEventListener('mousedown', handleClickOutside);
    // Remove the event listener on cleanup.
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showList]);

  // When the bell is clicked, toggle the list and clear the unseen count.
  const handleBellClick = () => {
    setShowList((prev) => !prev);
    setUnseenCount(0);
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={handleBellClick}
        title="Show notifications"
        className="relative group bg-white/60 backdrop-blur border border-cyan-100 rounded-full p-2 shadow transition hover:bg-cyan-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
      >
        <Bell
          size={14}
          className="text-cyan-700 group-hover:text-cyan-800 transition"
          strokeWidth={2}
        />
        {unseenCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow">
            {unseenCount}
          </span>
        )}
      </button>

      {/* The dropdown list, which shows if showList is true */}
      {showList && (
        <div
          ref={listRef}
          className="absolute right-0 mt-2 bg-blue-50/90 backdrop-blur-md shadow-lg rounded-lg w-80 p-3 z-50"
        >
          {notifications.map((n, i) => (
            <div
              key={i}
              className="mb-2 border-b border-blue-200/50 pb-2 last:border-none last:pb-0"
            >
              <div className="font-semibold text-sm text-gray-800">
                {n.message}
              </div>
              {n.jobId && (
                <div className="text-xs text-gray-500 mt-1">
                  Job ID: {n.jobId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
