import React from 'react';
import { formatCurrency, formatTime } from '../utils/formatters.js';
import { Sparkles, Armchair, Volume2, Monitor } from 'lucide-react';

export default function ScreenCard({
  screen,
  shows = [],
  selectedShow,
  onSelectShow,
}) {
  const isIMAX = screen.type === 'IMAX';
  const isDolby = screen.type === 'Dolby';

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 glass-panel border transition-all ${
        isIMAX
          ? 'border-blue-500/30 shadow-[0_0_25px_rgba(79,107,255,0.15)]'
          : isDolby
          ? 'border-purple-500/30 shadow-[0_0_25px_rgba(192,132,252,0.15)]'
          : 'border-indigo-950/70'
      }`}
    >
      {/* Screen Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-950/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-bold text-lg text-white">
              {screen.name}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isIMAX
                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                  : isDolby
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              {screen.type} Experience
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{screen.tagline}</p>
        </div>

        {/* Pricing Tiers unboxed */}
        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Standard</span>
            <span className="font-semibold text-white tabular-nums">
              {formatCurrency(screen.seatTypePricing.standard)}
            </span>
          </div>
          <span className="text-slate-600" aria-hidden="true">|</span>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Premium</span>
            <span className="font-semibold text-indigo-300 tabular-nums">
              {formatCurrency(screen.seatTypePricing.premium)}
            </span>
          </div>
          <span className="text-slate-600" aria-hidden="true">|</span>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Recliner</span>
            <span className="font-semibold text-purple-300 tabular-nums">
              {formatCurrency(screen.seatTypePricing.recliner)}
            </span>
          </div>
        </div>
      </div>

      {/* Screen Audio/Visual Features */}
      <div className="py-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-blue-400" />
          <span>{screen.features[0]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{screen.features[1]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Armchair className="w-3.5 h-3.5 text-indigo-400" />
          <span>{screen.features[2]}</span>
        </div>
      </div>

      {/* Available Showtimes Strip */}
      <div className="mt-2 pt-3 border-t border-indigo-950/40">
        <p className="text-xs font-medium text-slate-400 mb-2.5">Select Showtime:</p>

        {shows.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No shows scheduled on this screen for the selected date.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {shows.map((show) => {
              const isSelected = selectedShow?._id === show._id;
              const totalSeats = screen.rows.length * screen.seatsPerRow;
              const bookedCount = (show.bookedSeats || []).length;
              const seatsLeft = Math.max(0, totalSeats - bookedCount);
              const isFastFilling = seatsLeft < 20;

              return (
                <button
                  key={show._id}
                  onClick={() => onSelectShow(show, screen)}
                  className={`px-3.5 py-2.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-indigo-950/30 hover:bg-indigo-900/40 text-slate-200 border-indigo-950/80 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="font-display font-semibold text-sm">
                    {formatTime(show.startTime)}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <span className={isFastFilling ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                      {seatsLeft} seats left
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
