import React from 'react';

export default function CrowSilhouette({ className = 'w-12 h-12', style = {} }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} opacity-85 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
      style={style}
    >
      {/* Mystical anime raven silhouette */}
      <path d="M 10,25 C 25,18 42,22 55,30 C 65,22 80,10 95,5 C 88,18 78,28 70,36 C 78,42 86,52 92,60 C 80,55 70,48 62,42 C 58,54 48,68 38,75 C 40,65 44,55 46,46 C 36,44 26,40 18,34 C 12,30 8,26 10,25 Z" />
    </svg>
  );
}
