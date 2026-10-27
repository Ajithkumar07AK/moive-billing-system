import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import TicketCard from '../components/TicketCard.jsx';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const { latestBooking, resetBookingFlow } = useBooking();

  // Trigger celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f6bff', '#8b5cf6', '#c084fc', '#38bdf8', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleBackToHome = () => {
    resetBookingFlow();
    navigate('/');
  };

  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  if (!latestBooking) {
    return (
      <div className="min-h-screen bg-[#05030f] pt-32 text-center text-slate-300">
        <p>No recent booking found.</p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs"
        >
          Explore Premieres
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05030f] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Celebration Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Payment Authorized · Seats Reserved</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white neon-text-glow">
          BOOKING CONFIRMED!
        </h1>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Your theatrical pass has been issued and stored in your profile. Scan your QR code at the screen entrance.
        </p>
      </div>

      {/* Ticket Card Component */}
      <TicketCard
        booking={latestBooking}
        onViewBookings={handleViewBookings}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}
