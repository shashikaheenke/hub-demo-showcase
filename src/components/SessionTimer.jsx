import React, { useEffect, useState } from 'react';

/**
 * A simple timer to display elapsed time in HH:MM:SS format.
 * For this demo, the timer starts from zero when the component mounts.
 */
export default function SessionTimer() {
  // State to hold the total elapsed seconds.
  const [sessionTime, setSessionTime] = useState(0);

  // This effect sets up a recurring timer.
  useEffect(() => {
    // Set an interval to increment the sessionTime every second.
    const timer = setInterval(() => {
      setSessionTime((prevTime) => prevTime + 1);
    }, 1000);

    // Cleanup function: React will call this when the component is unmounted.
    // This is crucial to prevent memory leaks.
    return () => clearInterval(timer);
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  /**
   * Formats a total number of seconds into a HH:MM:SS string.
   * @param {number} seconds - The total seconds to format.
   * @returns {string} The formatted time string.
   */
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    // The styling is copied directly from the original component for visual accuracy.
    <div
      style={{
        background: '#E0F7FA',
        color: '#008C9E',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: '1.2em',
        fontWeight: 'bolder',
        padding: '6px 18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        zIndex: 100,
      }}
    >
      {formatTime(sessionTime)}
    </div>
  );
}
