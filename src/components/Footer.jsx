import React from 'react';
import { Link } from 'react-router-dom';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-indigo-950/60 bg-[#05030f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <InfinitySymbol className="w-7 h-7" />
              <span className="font-display font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Infinity Cinema
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Where cinematic artistry transcends the boundaries of perception. Experience cutting-edge IMAX Laser, Dolby Atmos spatial soundscapes, and luxurious comfort curated for anime and cinematic lovers.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span>Dual 4K Laser</span>
              <span aria-hidden="true">·</span>
              <span>Dolby Atmos Sphere</span>
              <span aria-hidden="true">·</span>
              <span>Limitless Experience</span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-slate-200 tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/movies" className="hover:text-indigo-400 transition-colors">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?tab=available" className="hover:text-indigo-400 transition-colors">
                  Upcoming Premieres
                </Link>
              </li>
              <li>
                <Link to="/movies?tab=categories" className="hover:text-indigo-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-slate-200 tracking-wider mb-3">
              Screen Types
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Screen 1 — IMAX Laser</li>
              <li>Screen 2 — Dolby Atmos</li>
              <li>Screen 3 — Prestige Standard</li>
              <li className="pt-2 text-xs text-slate-500">
                Box Office Support: 10:00 AM – 11:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Infinity Cinema. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/help" className="hover:text-slate-400 transition-colors">
              Terms of Booking
            </Link>
            <Link to="/help" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/help" className="hover:text-slate-400 transition-colors">
              Customer Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
