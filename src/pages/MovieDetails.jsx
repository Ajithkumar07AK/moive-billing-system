import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieApi } from '../api/movie.api.js';
import { INITIAL_MOVIES } from '../utils/constants.js';
import { useBooking } from '../context/BookingContext.jsx';
import Loader from '../components/Loader.jsx';
import { formatDuration, formatDate } from '../utils/formatters.js';
import {
  Star,
  Clock,
  Globe,
  Film,
  Calendar,
  Play,
  ArrowRight,
  ChevronLeft,
  Users,
} from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setMovie, date, setDate } = useBooking();

  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate the next 7 days for the date picker
  const availableDates = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      iso: d.toISOString().slice(0, 10),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieApi.getMovieById(id);
        if (res?.data) {
          setMovieData(res.data);
          setMovie(res.data);
        } else {
          const fallback = INITIAL_MOVIES.find((m) => m._id === id) || INITIAL_MOVIES[0];
          setMovieData(fallback);
          setMovie(fallback);
        }
      } catch (err) {
        const fallback = INITIAL_MOVIES.find((m) => m._id === id) || INITIAL_MOVIES[0];
        setMovieData(fallback);
        setMovie(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, setMovie]);

  if (loading) {
    return <Loader fullScreen message="Loading premiere details..." />;
  }

  if (!movieData) {
    return (
      <div className="min-h-screen bg-[#05030f] pt-32 text-center text-slate-300">
        <p>Movie details not found.</p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs"
        >
          Return to Movies
        </button>
      </div>
    );
  }

  const isComingSoon = movieData.status === 'coming_soon';

  const handleProceedToScreens = () => {
    setMovie(movieData);
    navigate(`/movies/${movieData._id}/select-screen?date=${date}`);
  };

  return (
    <div className="min-h-screen bg-[#05030f] text-slate-100">
      {/* Cinematic Banner Background with Dark Scrim */}
      <div className="relative h-[48vh] sm:h-[58vh] w-full overflow-hidden">
        <img
          src={movieData.bannerUrl || movieData.posterUrl}
          alt={movieData.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 saturate-125"
          onError={(e) => {
            e.currentTarget.src = '/src/assets/images/bg_hero_limitless_1793082495818.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05030f] via-[#05030f]/60 to-black/40" />

        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-xs font-medium text-slate-200 hover:text-white border border-slate-700/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-44 z-30 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Poster Card */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="rounded-2xl overflow-hidden glass-panel border border-indigo-500/40 shadow-2xl shadow-black/80 aspect-[3/4]">
              <img
                src={movieData.posterUrl}
                alt={movieData.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Trailer CTA */}
            {movieData.trailerUrl && (
              <a
                href={movieData.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3 px-4 rounded-xl glass-panel hover:bg-indigo-900/40 border border-indigo-950/80 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-red-600/80 group-hover:bg-red-500 flex items-center justify-center text-white">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span>Watch Theatrical Trailer</span>
              </a>
            )}
          </div>

          {/* Right Column: Title, Metadata, Synopsis, Cast, Date Picker, CTA */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
                <span>{movieData.category}</span>
                <span aria-hidden="true">·</span>
                <span>{movieData.genres?.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span>{movieData.certification || 'PG-13'}</span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white [text-wrap:balance]">
                {movieData.title}
              </h1>

              {movieData.tagline && (
                <p className="text-sm text-indigo-300 italic mt-2">
                  "{movieData.tagline}"
                </p>
              )}
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-6 py-3 border-y border-indigo-950/60 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white text-sm tabular-nums">
                  {movieData.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">/ 10</span>
              </div>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{formatDuration(movieData.duration)}</span>
              </div>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{movieData.language}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-300 uppercase tracking-wider mb-2">
                Synopsis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {movieData.description}
              </p>
            </div>

            {/* Cast & Crew */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Principal Cast & Director</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movieData.cast?.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 rounded-lg text-xs bg-[#0a0820] border border-indigo-950/70 text-slate-300"
                  >
                    {actor}
                  </span>
                ))}
                {movieData.director && (
                  <span className="px-3 py-1 rounded-lg text-xs bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 font-medium">
                    Dir. {movieData.director}
                  </span>
                )}
              </div>
            </div>

            {/* Date Picker (Select Date) */}
            {!isComingSoon && (
              <div className="pt-4 border-t border-indigo-950/60">
                <h3 className="font-display font-semibold text-sm text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Choose Screening Date</span>
                </h3>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {availableDates.map((d) => {
                    const isSelected = date === d.iso;
                    return (
                      <button
                        key={d.iso}
                        onClick={() => setDate(d.iso)}
                        className={`px-4 py-3 rounded-xl flex flex-col items-center min-w-[72px] border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-indigo-600/30'
                            : 'bg-[#0a0820] hover:bg-indigo-950/40 text-slate-300 border-indigo-950/80 hover:border-indigo-500/30'
                        }`}
                      >
                        <span className="text-[11px] font-semibold uppercase opacity-80">
                          {d.dayName}
                        </span>
                        <span className="text-lg font-bold font-display my-0.5 tabular-nums">
                          {d.dayNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 opacity-90">
                          {d.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book Tickets CTA Button */}
            <div className="pt-4">
              {isComingSoon ? (
                <div className="p-4 rounded-xl glass-panel border border-indigo-950/80 text-sm text-indigo-300">
                  Tickets will open soon. Sign up or save to watch list.
                </div>
              ) : (
                <button
                  onClick={handleProceedToScreens}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5"
                >
                  <Film className="w-4 h-4" />
                  <span>Select Screen & Showtimes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
