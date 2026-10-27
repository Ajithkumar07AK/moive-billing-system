import React from 'react';

export default function TreeBranches({ className = 'w-full h-32', position = 'bottom-left' }) {
  const isRight = position === 'bottom-right';

  return (
    <svg
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} pointer-events-none select-none ${isRight ? '-scale-x-100' : ''}`}
    >
      <path
        d="M 0,300 C 60,260 110,210 140,150 C 160,110 190,80 230,50 M 140,150 C 180,160 220,180 270,195 M 190,80 C 180,40 195,15 220,0 M 110,210 C 150,230 190,260 230,290 M 230,50 C 270,60 310,75 350,90 M 230,50 C 240,25 260,10 290,5"
        stroke="#020108"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M 0,300 C 60,260 110,210 140,150 C 160,110 190,80 230,50 M 140,150 C 180,160 220,180 270,195"
        stroke="#0c0724"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
