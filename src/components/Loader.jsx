import React from 'react';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';

export default function Loader({ message = 'Traversing the Infinite Void...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <InfinitySymbol className="w-16 h-16 animate-infinity" />
        <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse pointer-events-none" />
      </div>
      <p className="text-sm tracking-widest uppercase font-mono text-indigo-300 animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05030f]/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
