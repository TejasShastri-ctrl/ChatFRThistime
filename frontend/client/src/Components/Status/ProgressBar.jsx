import React, { useEffect, useState } from 'react'
import "./ProgressBar.css"

export const ProgressBar = ({index, activeIndex, duration}) => {
   const isActive = index === activeIndex;
   const [progress, setProgress] = useState(0);

   useEffect(() => {
    // Set progress only if the bar is active
    if (isActive) {
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(intervalId);  // Clear interval when progress reaches 100%
            return prev;
          }
        });
      }, duration / 100);

      // Cleanup interval on component unmount or when the bar becomes inactive
      return () => clearInterval(intervalId);
    } else {
      // Reset progress when the bar becomes inactive
      setProgress(0);
    }
   }, [isActive, duration]);

  return (
    <div className={`progress-bar-container ${isActive ? "active" : ""}`}>
        <div className={`progress-bar ${isActive ? "active" : ""}`} style={{width: `${progress}%`}}>

        </div>
    </div>
  );
}

export default ProgressBar;
