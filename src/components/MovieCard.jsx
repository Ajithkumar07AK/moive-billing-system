import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Sparkles } from 'lucide-react';
import { formatDuration } from '../utils/formatters.js';

export default function MovieCard({ movie, onSelect }) {
  const isComingSoon = movie.status === 'coming_soon';

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel-glow border border-indigo-500/20 glass-card-hover transition-all duration-300">
      {/* Poster Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#09090e]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Cinematic Anime Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0820] via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-mono shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {movie.certification && (
            <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-indigo-500/30 text-cyan-300 text-[11px] font-mono">
              {movie.certification}
            </span>
          )}
        </div>

        {isComingSoon && (
          <div className="absolute bottom-3 left-3 right-3 py-1.5 text-center bg-violet-950/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-cyan-300 rounded-lg border border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.5)] font-display">
            Coming Soon
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#0a0820]/60">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-medium mb-1.5 font-display tracking-wider uppercase">
            <span>{movie.category}</span>
            <span aria-hidden="true" className="text-indigo-400">·</span>
            <span className="text-slate-300">{movie.genres?.slice(0, 2).join(' / ')}</span>
          </div>

          <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2.5 text-xs text-slate-300 mt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatDuration(movie.duration)}</span>
            </div>
            <span aria-hidden="true" className="text-indigo-500">·</span>
            <span className="truncate">{movie.language}</span>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-indigo-500/20">
          <Link
            to={`/movies/${movie._id}`}
            onClick={() => onSelect?.(movie)}
            className="w-full block py-2.5 px-3 text-center rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-600/70 hover:btn-electric transition-all border border-indigo-500/30 hover:border-transparent font-display shadow-[0_0_15px_rgba(79,107,255,0.2)] hover:shadow-[0_0_25px_rgba(79,107,255,0.5)]"
          >
            {isComingSoon ? 'Domain Details' : 'Book Tickets'}
          </Link>
        </div>
      </div>
    </div>
  );
}

