import React from 'react';

export default function Seat({
  id,
  row,
  number,
  type = 'standard',
  price,
  status = 'available',
  onToggle,
}) {
  const isBooked = status === 'booked';
  const isLocked = status === 'locked';
  const isSelected = status === 'selected';
  const isDisabled = isBooked || isLocked;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onToggle({ id, row, number, type, price })}
      title={`${row}${number} · ${type.toUpperCase()} (₹${price})`}
      aria-label={`Seat ${row}${number}, ${type}, price ₹${price}, ${status}`}
      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-xs flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all ${
        isSelected
          ? 'bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-500 text-white shadow-[0_0_15px_#22d3ee] scale-105 z-10 border border-cyan-300'
          : isBooked
          ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-20'
          : isLocked
          ? 'bg-amber-950/40 text-amber-400 border border-amber-500/40 cursor-not-allowed opacity-60 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
          : 'bg-[#120f29] hover:bg-indigo-900/40 text-slate-200 hover:text-cyan-300 border border-indigo-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(79,107,255,0.4)]'
      }`}
    >
      {number}
    </button>
  );
}
