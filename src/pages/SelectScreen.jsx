import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ScreenCard from '../components/ScreenCard.jsx';
import Loader from '../components/Loader.jsx';
import { movieApi } from '../api/movie.api.js';
import { INITIAL_MOVIES, INITIAL_SCREENS } from '../utils/constants.js';
import { useBooking } from '../context/BookingContext.jsx';
import { formatDate } from '../utils/formatters.js';
import { Calendar, ChevronLeft, Film } from 'lucide-react';

export default function SelectScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { movie, setMovie, date, setDate, setScreen, setShow } = useBooking();

  const [movieData, setMovieData] = useState(movie);
  const [screenShows, setScreenShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryDate = searchParams.get('date') || date || new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (queryDate !== date) {
      setDate(queryDate);
    }
  }, [queryDate, date, setDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movie if not present
        if (!movieData || movieData._id !== id) {
          const mRes = await movieApi.getMovieById(id);
          if (mRes?.data) {
            setMovieData(mRes.data);
            setMovie(mRes.data);
          } else {
            const fallback = INITIAL_MOVIES.find((m) => m._id === id) || INITIAL_MOVIES[0];
            setMovieData(fallback);
            setMovie(fallback);
          }
        }

        // Fetch shows for this movie on the chosen date
        const showsRes = await movieApi.getMovieShows(id, queryDate);
        if (showsRes?.data) {
          setScreenShows(showsRes.data);
        } else {
          // Fallback generate mock shows
          setScreenShows(generateFallbackShows(id, queryDate));
        }
      } catch (err) {
        setScreenShows(generateFallbackShows(id, queryDate));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, queryDate]);

  const generateFallbackShows = (movieId, chosenDate) => {
    return INITIAL_SCREENS.map((sc, sIdx) => ({
      screen: sc,
      shows: [
        {
          _id: `show_${movieId}_${sc._id}_${chosenDate}_1100`,
          movieId,
          screenId: sc._id,
          screenName: sc.name,
          screenType: sc.type,
          date: chosenDate,
          startTime: '11:00',
          endTime: '13:30',
          basePrice: sc.seatTypePricing.standard,
          bookedSeats: ['C4', 'C5', 'D6'],
          lockedSeats: [],
        },
        {
          _id: `show_${movieId}_${sc._id}_${chosenDate}_1430`,
          movieId,
          screenId: sc._id,
          screenName: sc.name,
          screenType: sc.type,
          date: chosenDate,
          startTime: '14:30',
          endTime: '17:00',
          basePrice: sc.seatTypePricing.standard,
          bookedSeats: ['E5', 'E6', 'F7', 'F8'],
          lockedSeats: [],
        },
        {
          _id: `show_${movieId}_${sc._id}_${chosenDate}_1800`,
          movieId,
          screenId: sc._id,
          screenName: sc.name,
          screenType: sc.type,
          date: chosenDate,
          startTime: '18:00',
          endTime: '20:30',
          basePrice: sc.seatTypePricing.standard,
          bookedSeats: ['B3', 'B4', 'G5'],
          lockedSeats: [],
        },
      ],
    }));
  };

  const handleSelectShow = (selectedShow, selectedScreen) => {
    setShow(selectedShow);
    setScreen(selectedScreen);
    navigate(`/shows/${selectedShow._id}/select-seats`);
  };

  if (loading) {
    return <Loader fullScreen message="Loading available auditoriums & showtimes..." />;
  }

  return (
    <div className="min-h-screen bg-[#05030f] pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Movie Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-950/60 mb-8">
        <div>
          <button
            onClick={() => navigate(`/movies/${id}`)}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Movie Info</span>
          </button>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {movieData?.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{movieData?.language}</span>
            <span aria-hidden="true">·</span>
            <span>{movieData?.genres?.join(', ')}</span>
          </div>
        </div>

        {/* Selected Date Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300">Selected Date:</span>
          <span className="font-semibold text-white font-mono">{formatDate(queryDate)}</span>
        </div>
      </div>

      {/* Screen Selection Cards List */}
      <div className="space-y-6">
        {screenShows.map(({ screen, shows }) => (
          <ScreenCard
            key={screen._id}
            screen={screen}
            shows={shows}
            onSelectShow={handleSelectShow}
          />
        ))}
      </div>
    </div>
  );
}
