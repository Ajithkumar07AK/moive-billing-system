import React from 'react';

export default function InfinitySymbol({
  className = 'w-6 h-6',
  strokeWidth = 2.2,
  glow = true,
  animated = false,
}) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} inline-block shrink-0 ${animated ? 'animate-pulse-glow' : ''}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="infinityGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f6bff" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        {glow && (
          <filter id="infinityNeonFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <path
        d="M 15 12 C 7 3 2 7 2 12 C 2 17 7 21 15 12 L 33 12 C 41 3 46 7 46 12 C 46 17 41 21 33 12 Z"
        stroke="url(#infinityGlowGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? 'url(#infinityNeonFilter)' : undefined}
      />
    </svg>
  );
}

