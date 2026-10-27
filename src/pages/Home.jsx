import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ParallaxHero from '../components/ParallaxHero.jsx';
import MovieCard from '../components/MovieCard.jsx';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { movieApi } from '../api/movie.api.js';
import { INITIAL_MOVIES, INITIAL_SCREENS } from '../utils/constants.js';
import { useBooking } from '../context/BookingContext.jsx';
import { ChevronRight, ArrowRight, Monitor, Volume2, Armchair, Sparkles, Compass, ShieldCheck, QrCode } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { setMovie } = useBooking();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await movieApi.getMovies({ status: 'now_showing' });
        if (res?.data && res.data.length > 0) {
          setFeaturedMovies(res.data);
        } else {
          setFeaturedMovies(INITIAL_MOVIES);
        }
      } catch (err) {
        setFeaturedMovies(INITIAL_MOVIES);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    setMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#05030f] text-slate-100">
      {/* 1. Limitless Parallax Hero */}
      <ParallaxHero onBookNowClick={() => navigate('/movies')} />

      {/* Section Divider with Glowing Infinity */}
      <div className="relative py-8 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="relative z-10 px-6 py-2 rounded-full bg-[#05030f] border border-indigo-500/30 flex items-center gap-3 shadow-[0_0_20px_rgba(79,107,255,0.3)]">
          <InfinitySymbol className="w-5 h-5 text-cyan-400" animated={true} />
          <span className="text-[11px] font-display font-semibold uppercase tracking-widest text-cyan-300">
            NOW SHOWING IN THE VOID
          </span>
          <InfinitySymbol className="w-5 h-5 text-violet-400" animated={true} />
        </div>
      </div>

      {/* 2. Featured Movies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-4 border-b border-indigo-500/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 font-display">
                Curated anime & global spectacles
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Now Showing <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">In Theatres</span>
            </h2>
          </div>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-xs font-display font-bold text-cyan-300 hover:text-white transition-colors uppercase tracking-wider group"
          >
            <span>View All 12 Screenings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredMovies.slice(0, 4).map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onSelect={handleSelectMovie}
            />
          ))}
        </div>
      </section>

      {/* 3. How It Works: The 3 Realm Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-cyan-400 block mb-2">
            THREE STEPS TO TRANSCENDENCE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase">
            How To Enter The <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Void</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass-panel-glow rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-400/50 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <div className="absolute top-4 right-4 text-4xl font-display font-black text-indigo-500/20 group-hover:text-cyan-400/30 transition-colors">
              01
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">
              Select Your Realm
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Choose from visionary anime sagas, cosmic blockbusters, and 4K remasters screened in pristine uncompressed fidelity.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel-glow rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-400/50 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]">
            <div className="absolute top-4 right-4 text-4xl font-display font-black text-indigo-500/20 group-hover:text-indigo-400/30 transition-colors">
              02
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">
              Lock Your Domain & Seats
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Pick your auditorium format (IMAX Laser or Dolby Atmos) and recliners. Seats lock instantly for 5 minutes with real-time countdown.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel-glow rounded-2xl p-8 relative overflow-hidden group hover:border-violet-400/50 transition-all hover:shadow-[0_0_30px_rgba(167,139,250,0.25)]">
            <div className="absolute top-4 right-4 text-4xl font-display font-black text-indigo-500/20 group-hover:text-violet-400/30 transition-colors">
              03
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-400/30 flex items-center justify-center text-violet-400 mb-6 shadow-[0_0_15px_rgba(167,139,250,0.3)]">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">
              Instant Void QR Pass
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Authorize payment via Card, UPI, or Net Banking. Instant digital boarding pass with scannable QR ticket and downloadable PDF.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Theatrical Auditoriums (The Three Domains) */}
      <section className="py-20 border-t border-indigo-500/20 bg-[#070518]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-cyan-400 block mb-2">
              AUDITORIUM ARCHITECTURE
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase">
              The Three Domains of <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Immersion</span>
            </h2>
            <p className="text-sm text-slate-300 mt-3 font-sans">
              Custom-engineered acoustic chambers delivering infinite contrast, high-frequency spatial clarity, and VIP zero-gravity seating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_SCREENS.map((sc) => (
              <div
                key={sc._id}
                className="rounded-2xl p-7 glass-panel-glow border border-indigo-500/25 flex flex-col justify-between hover:border-cyan-400/50 transition-all hover:shadow-[0_0_35px_rgba(79,107,255,0.3)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-display font-bold uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30">
                      {sc.type} Experience
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {sc.totalSeats} Recliners
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    {sc.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                    {sc.tagline}
                  </p>
                </div>

                <div className="space-y-3 pt-5 border-t border-indigo-500/20 text-xs text-slate-300 font-sans">
                  <div className="flex items-center gap-2.5">
                    <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{sc.features[0]}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{sc.features[1]}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Armchair className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>{sc.features[2]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom Call To Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-panel-glow rounded-3xl p-10 sm:p-14 border border-indigo-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(79,107,255,0.25)]">
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />
          
          <InfinitySymbol className="w-12 h-12 text-cyan-400 mx-auto mb-6" animated={true} />
          
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase mb-4 [text-wrap:balance]">
            Ready To Expand Your <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">Domain?</span>
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
            Reserve your seats across 70mm Laser IMAX, Dolby Atmos, and VIP Recliners with real-time 5-minute locking.
          </p>

          <Link
            to="/movies"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white btn-electric shadow-[0_0_30px_rgba(79,107,255,0.5)] cursor-pointer font-display"
          >
            <span>Explore All Movies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

