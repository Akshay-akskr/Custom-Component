import React, { useEffect, useState } from 'react';
import '../styles/animation.css';

const ProgressBar: React.FC<{ duration?: number }> = ({ duration = 5000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 100); // update every 100ms

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="progress-wrapper">
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-label">Please wait. Loading resources: {Math.round(progress)}%</div>
    </div>
  );
};

export default ProgressBar;
