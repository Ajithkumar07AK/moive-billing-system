import React from 'react';
import { formatCurrency, formatTime, formatDate } from '../utils/formatters.js';
import { Clock, ArrowRight, Trash2 } from 'lucide-react';

export default function BookingSummary({
  movie,
  screen,
  show,
  date,
  selectedSeats = [],
  totals,
  lockSecondsLeft = 0,
  onProceed,
  onClearSeats,
  isProceedDisabled = false,
}) {
  const minutes = Math.floor(lockSecondsLeft / 60);
  const seconds = lockSecondsLeft % 60;
  const isTimerActive = lockSecondsLeft > 0;

  return (
    <div className="rounded-xl p-6 bg-[#12111a] border border-white/10 sticky top-24 space-y-5 font-sans-clean">
      <div className="border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-base text-white">Order Summary</h3>
        <p className="text-xs text-slate-400 mt-0.5">{movie?.title || 'No film selected'}</p>
      </div>

      {/* Screen & Showtime Info */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Auditorium</span>
          <span className="font-medium text-slate-200">{screen?.name || '—'}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Format</span>
          <span className="text-slate-200 font-medium">{screen?.type || '—'}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Date</span>
          <span className="text-slate-200">{formatDate(date)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Showtime</span>
          <span className="text-slate-200">{show ? formatTime(show.startTime) : '—'}</span>
        </div>
      </div>

      {/* Selected Seats List */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-slate-300">
            Selected Seats ({selectedSeats.length})
          </span>
          {selectedSeats.length > 0 && (
            <button
              onClick={onClearSeats}
              className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>

        {selectedSeats.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-1">
            Choose up to 8 seats from the auditorium layout.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 py-1">
            {selectedSeats.map((seat) => (
              <span
                key={seat.id}
                className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-white/5 text-slate-200 border border-white/10"
              >
                {seat.id}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Seat Lock Countdown */}
      {isTimerActive && (
        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300/90">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            <span>Held for: </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Tickets Subtotal</span>
          <span className="text-slate-200 tabular-nums">
            {formatCurrency(totals?.subtotal || 0)}
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Booking Fee</span>
          <span className="text-slate-200 tabular-nums">
            {formatCurrency(totals?.convenienceFee || 0)}
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Taxes</span>
          <span className="text-slate-200 tabular-nums">
            {formatCurrency(totals?.taxes || 0)}
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-white/10 text-sm">
          <span className="font-semibold text-white">Grand Total</span>
          <span className="font-display font-bold text-base text-white tabular-nums">
            {formatCurrency(totals?.grandTotal || 0)}
          </span>
        </div>
      </div>

      {/* Proceed CTA */}
      <button
        onClick={onProceed}
        disabled={isProceedDisabled || selectedSeats.length === 0}
        className="w-full py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <span>Proceed to Payment</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
