import React, { useEffect, useState } from 'react';

/**
 * A component that animates a number counting up from 0 to a target value.
 * @param {{ value: number, duration: number }} props
 */
function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;

    // The animation function that runs on each frame.
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(progress * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation if the component unmounts.
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default AnimatedNumber;
