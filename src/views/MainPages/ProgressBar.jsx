import React from 'react';
import './ProgressBar.css';

const ProgressBar = () => {
  const currentPoints = 1400;
  const pointsNeeded = 3500;
  const progressPercentage = (currentPoints / pointsNeeded) * 100;
  const currentBelt = "Green Belt";

  return (
    <div className="progress-container">
      <div className="belt-progress-bar">
        <div className="progress-text">
          <span className="current-belt">Current Belt: {currentBelt}</span>
          <span className="points">{currentPoints} / {pointsNeeded} pts to Black</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;