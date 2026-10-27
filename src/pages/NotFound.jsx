import React from 'react';
import { Link } from 'react-router-dom';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05030f] flex flex-col items-center justify-center p-4 text-center">
      <InfinitySymbol className="w-16 h-16 mb-4 animate-infinity" />
      <h1 className="font-display font-black text-6xl sm:text-7xl text-white mb-2">
        404
      </h1>
      <h2 className="font-display font-semibold text-xl text-indigo-300 mb-4">
        Boundary of the Infinite Void
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The cinematic timeline you requested does not exist or has collapsed. Return safely to the main lobby.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Cinema Lobby</span>
      </Link>
    </div>
  );
}
