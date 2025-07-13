import React from "react";

export default function WaveSVG({ height = 200, duration = 8 }) {
  return (
    <div style={{ width: "100%", overflow: "hidden", height: `${height}px` }}>
      <svg
        viewBox="0 0 1200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>

        <path
          id="wavePath"
          fill="url(#waveGradient)"
          d="
            M0,100 
            C300,150 600,50 900,100 
            C1200,150 1500,50 1800,100 
            L1800,200 
            L0,200 
            Z"
        >
          <animate
            attributeName="d"
            dur={`${duration}s`}
            repeatCount="indefinite"
            keyTimes="0; 0.5; 1"
            values="
              M0,100 C300,150 600,50 900,100 C1200,150 1500,50 1800,100 L1800,200 L0,200 Z;
              M0,100 C300,50 600,150 900,100 C1200,50 1500,150 1800,100 L1800,200 L0,200 Z;
              M0,100 C300,150 600,50 900,100 C1200,150 1500,50 1800,100 L1800,200 L0,200 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}