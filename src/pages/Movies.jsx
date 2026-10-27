import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import Loader from '../components/Loader.jsx';
import { movieApi } from '../api/movie.api.js';
import { INITIAL_MOVIES } from '../utils/constants.js';
import { useBooking } from '../context/BookingContext.jsx';
import { Film } from 'lucide-react';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setMovie } = useBooking();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') || 'all';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await movieApi.getMovies();
        if (res?.data && res.data.length > 0) {
          setMovies(res.data);
        } else {
          setMovies(INITIAL_MOVIES);
        }
      } catch (err) {
        setMovies(INITIAL_MOVIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (activeTab === 'available') {
      result = result.filter((m) => m.status === 'now_showing');
    } else if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }

    if (selectedCategory !== 'All') {
      result = result.filter(
        (m) =>
          m.category.toLowerCase() === selectedCategory.toLowerCase() ||
          m.genres?.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.cast?.some((actor) => actor.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'title_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration_desc') {
      result.sort((a, b) => b.duration - a.duration);
    } else {
      result.sort((a, b) => {
        if (a.status === 'now_showing' && b.status !== 'now_showing') return -1;
        if (a.status !== 'now_showing' && b.status === 'now_showing') return 1;
        return b.rating - a.rating;
      });
    }

    return result;
  }, [movies, activeTab, statusFilter, selectedCategory, searchQuery, sortBy]);

  const handleSelectMovie = (movie) => {
    setMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#09090e] pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans-clean">
      <div className="mb-8 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Repertory Schedule
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
            {activeTab === 'available'
              ? 'Now Showing'
              : activeTab === 'categories'
              ? 'Genre Archive'
              : 'All Screenings'}
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0a0820] p-1.5 rounded-xl border border-indigo-500/30 text-xs font-display">
          <button
            onClick={() => {
              setStatusFilter('all');
              setSearchParams({});
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              statusFilter === 'all' && activeTab === 'all'
                ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(79,107,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({movies.length})
          </button>
          <button
            onClick={() => {
              setStatusFilter('now_showing');
              setSearchParams({ tab: 'available' });
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'available' || statusFilter === 'now_showing'
                ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(79,107,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => {
              setStatusFilter('coming_soon');
              setSearchParams({ tab: 'coming_soon' });
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              statusFilter === 'coming_soon'
                ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(79,107,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Coming Soon
          </button>
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {loading ? (
        <Loader message="Loading theatrical schedule..." />
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-white/10 bg-[#12111a] p-8">
          <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-base text-slate-300">
            No Screenings Match Your Criteria
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or genre filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onSelect={handleSelectMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
}
