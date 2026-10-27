import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid.jsx';
import BookingSummary from '../components/BookingSummary.jsx';
import Toast from '../components/Toast.jsx';
import Loader from '../components/Loader.jsx';
import { bookingApi } from '../api/booking.api.js';
import { movieApi } from '../api/movie.api.js';
import { INITIAL_MOVIES, INITIAL_SCREENS } from '../utils/constants.js';
import { useBooking } from '../context/BookingContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ChevronLeft } from 'lucide-react';

export default function SelectSeats() {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    movie,
    setMovie,
    screen,
    setScreen,
    show,
    setShow,
    date,
    selectedSeats,
    toggleSeat,
    clearSeats,
    totals,
    lockSecondsLeft,
    lockSeatsOnServer,
    unlockSeatsOnServer,
  } = useBooking();

  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Fetch show seats & layout
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await bookingApi.getShowSeats(showId);
        if (res?.data) {
          const { show: s, screen: sc, bookedSeats: b, lockedSeats: l, movie: m } = res.data;
          setShow(s);
          if (sc) setScreen(sc);
          if (m) setMovie(m);
          setBookedSeats(b || []);
          setLockedSeats(l || []);
        } else {
          // Fallback
          setBookedSeats(['C4', 'C5', 'D6', 'E5']);
          setLockedSeats([]);
          if (!screen) setScreen(INITIAL_SCREENS[0]);
          if (!movie) setMovie(INITIAL_MOVIES[0]);
        }
      } catch (err) {
        setBookedSeats(['C4', 'C5', 'D6', 'E5']);
        setLockedSeats([]);
        if (!screen) setScreen(INITIAL_SCREENS[0]);
        if (!movie) setMovie(INITIAL_MOVIES[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId, setShow, setScreen, setMovie, screen, movie]);

  const handleSeatToggle = (seat) => {
    try {
      toggleSeat(seat, bookedSeats, lockedSeats);
    } catch (err) {
      showToast(err.message || 'Seat unavailable', 'error');
    }
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least 1 seat.', 'error');
      return;
    }

    // Require authentication to proceed
    if (!user) {
      showToast('Please login to reserve and lock seats', 'info');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      await lockSeatsOnServer(showId);
      navigate(`/shows/${showId}/payment`);
    } catch (err) {
      showToast(err.message || 'Failed to lock seats. Please try again.', 'error');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading cinema seat architecture..." />;
  }

  const activeScreen = screen || INITIAL_SCREENS[0];
  const activeMovie = movie || INITIAL_MOVIES[0];

  return (
    <div className="min-h-screen bg-[#05030f] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-indigo-950/60 mb-8">
        <div>
          <button
            onClick={() => {
              unlockSeatsOnServer();
              navigate(-1);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Screens</span>
          </button>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Select Your Seats
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {activeMovie.title} · {activeScreen.name}
          </p>
        </div>
      </div>

      {/* Main Grid & Sticky Booking Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Curved Cinema Screen & Interactive Seats Grid */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-950/80">
          <SeatGrid
            screen={activeScreen}
            bookedSeats={bookedSeats}
            lockedSeats={lockedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleSeatToggle}
            currentUserId={user?._id}
          />
        </div>

        {/* Right Column: Sticky Booking Summary */}
        <div className="lg:col-span-4">
          <BookingSummary
            movie={activeMovie}
            screen={activeScreen}
            show={show}
            date={date}
            selectedSeats={selectedSeats}
            totals={totals}
            lockSecondsLeft={lockSecondsLeft}
            onProceed={handleProceed}
            onClearSeats={clearSeats}
          />
        </div>
      </div>
    </div>
  );
}
