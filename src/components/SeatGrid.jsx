import React from 'react';
import Seat from './Seat.jsx';

export default function SeatGrid({
  screen,
  bookedSeats = [],
  lockedSeats = [],
  selectedSeats = [],
  onToggleSeat,
  currentUserId,
}) {
  const rows = screen?.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = screen?.seatsPerRow || 10;
  const pricing = screen?.seatTypePricing || { standard: 250, premium: 400, recliner: 650 };

  const getSeatType = (row) => {
    const rowIndex = rows.indexOf(row);
    if (rowIndex <= 1) return 'recliner';
    if (rowIndex <= 4) return 'premium';
    return 'standard';
  };

  const selectedSeatIds = selectedSeats.map((s) => s.id);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 select-none font-sans">
      {/* Curved Glowing Anime Void Cinema Screen */}
      <div className="w-full flex flex-col items-center relative">
        <div className="relative w-full max-w-2xl h-16 flex flex-col items-center justify-center">
          {/* Ambient Screen Light Spill onto Floor */}
          <div className="absolute inset-x-8 top-6 h-12 bg-gradient-to-b from-cyan-400/20 via-indigo-500/10 to-transparent blur-xl pointer-events-none" />
          
          <svg viewBox="0 0 500 45" className="w-full h-12 filter drop-shadow-[0_0_15px_#4f6bff]">
            <defs>
              <linearGradient id="screenBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f6bff" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M 20,38 Q 250,8 480,38"
              fill="none"
              stroke="url(#screenBeamGrad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex items-center gap-2 -mt-3">
            <span className="text-[10px] font-display font-bold tracking-widest text-cyan-300 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              CURVED LIMITLESS SCREEN · ALL EYES TOWARD THE VOID
            </span>
          </div>
        </div>
      </div>

      {/* Seat Layout Grid */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className="space-y-2.5 min-w-fit px-4">
          {rows.map((row) => {
            const seatType = getSeatType(row);
            const price = pricing[seatType] || pricing.standard;

            return (
              <div key={row} className="flex items-center gap-2">
                <span className="w-5 text-center text-xs font-mono font-medium text-slate-500">
                  {row}
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: seatsPerRow }).map((_, idx) => {
                    const number = idx + 1;
                    const seatId = `${row}${number}`;

                    let status = 'available';
                    if (selectedSeatIds.includes(seatId)) {
                      status = 'selected';
                    } else if (bookedSeats.includes(seatId)) {
                      status = 'booked';
                    } else {
                      const isLocked = lockedSeats.some(
                        (l) => l.seat === seatId && l.expiresAt > Date.now() && (!currentUserId || l.userId !== currentUserId)
                      );
                      if (isLocked) status = 'locked';
                    }

                    const isAisle = idx === Math.floor(seatsPerRow / 2) - 1;

                    return (
                      <React.Fragment key={seatId}>
                        <Seat
                          id={seatId}
                          row={row}
                          number={number}
                          type={seatType}
                          price={price}
                          status={status}
                          onToggle={onToggleSeat}
                        />
                        {isAisle && <div className="w-4 sm:w-6" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                <span className="w-5 text-center text-xs font-mono font-medium text-slate-500">
                  {row}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Status & Price Tier Legend */}
      <div className="w-full max-w-xl mx-auto pt-6 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-t bg-[#161522] border border-white/20" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-t bg-indigo-600 border border-indigo-500 text-white" />
          <span className="text-white font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-t bg-white/5 border border-white/10 opacity-30" />
          <span className="text-slate-600">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-t bg-amber-950/40 border border-amber-500/40" />
          <span className="text-amber-400/80">Reserved</span>
        </div>
      </div>
    </div>
  );
}
