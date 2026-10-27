import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm.jsx';
import Toast from '../components/Toast.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { bookingApi } from '../api/booking.api.js';
import { formatCurrency, formatFullDate, formatTime } from '../utils/formatters.js';
import { generateBookingId } from '../utils/pricing.js';
import { ShieldCheck, ChevronLeft, Film } from 'lucide-react';

export default function Payment() {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    movie,
    screen,
    show,
    date,
    selectedSeats,
    totals,
    setLatestBooking,
  } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
  };

  if (!movie || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-[#05030f] pt-32 text-center text-slate-300">
        <p>No active booking found or session expired.</p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs"
        >
          Browse Movies
        </button>
      </div>
    );
  }

  const handleProcessPayment = async (paymentPayload) => {
    if (isProcessing) return; // Prevent double submission
    setIsProcessing(true);

    try {
      // 1. Send to simulated payment gateway
      const paymentResponse = await bookingApi.processPayment({
        ...paymentPayload,
        showId,
        userId: user?._id || 'guest',
        seats: selectedSeats.map((s) => s.id),
      });

      // 2. Create the confirmed booking record
      const bookingData = {
        bookingId: paymentResponse?.data?.bookingId || generateBookingId(),
        userId: user?._id || 'guest_123',
        userName: user?.name || 'Gojo Satoru',
        userEmail: user?.email || 'demo@cinema.com',
        movieId: movie._id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        screenId: screen?._id || 'scr_imax_1',
        screenName: screen?.name || 'Screen 1 — IMAX Laser',
        screenType: screen?.type || 'IMAX',
        showId: show?._id || showId,
        date: date,
        startTime: show?.startTime || '14:30',
        seats: selectedSeats.map((s) => s.id),
        seatType: selectedSeats[0]?.type || 'Standard',
        subtotal: totals.subtotal,
        convenienceFee: totals.convenienceFee,
        taxes: totals.taxes,
        totalAmount: totals.grandTotal,
        paymentStatus: 'completed',
        paymentMethod: paymentPayload.paymentMethod,
        transactionId: paymentResponse?.data?.transactionId || `TXN_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const bookingRes = await bookingApi.createBooking(bookingData);
      const finalizedBooking = bookingRes?.data || bookingData;

      // Save to context
      setLatestBooking(finalizedBooking);

      // Navigate to Step 7 – Booking Success
      navigate('/booking-success');
    } catch (err) {
      showToast(err.message || 'Payment processing failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05030f] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <div className="pb-6 border-b border-indigo-950/60 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Seat Selection</span>
        </button>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Complete Your Reservation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your order summary and authorize secure checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order Summary Card */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-indigo-950/80 space-y-5">
          <div className="flex gap-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-20 h-28 object-cover rounded-xl border border-indigo-950/80 shrink-0"
            />
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                {movie.category}
              </span>
              <h3 className="font-display font-bold text-base text-white mt-0.5 line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{screen?.name}</p>
              <p className="text-xs text-slate-300 font-mono mt-1">
                {date} · {show ? formatTime(show.startTime) : '14:30'}
              </p>
            </div>
          </div>

          <div className="border-t border-indigo-950/60 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Seats ({selectedSeats.length})</span>
              <span className="font-mono font-semibold text-white">
                {selectedSeats.map((s) => s.id).join(', ')}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-200 tabular-nums">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Convenience Fee (8%)</span>
              <span className="text-slate-200 tabular-nums">
                {formatCurrency(totals.convenienceFee)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Taxes (18%)</span>
              <span className="text-slate-200 tabular-nums">
                {formatCurrency(totals.taxes)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-indigo-950/40 text-sm font-bold">
              <span className="text-white">Total Amount</span>
              <span className="font-display font-extrabold text-lg text-emerald-400 tabular-nums">
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Simulated checkout mode. No real card charge will occur.</span>
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="lg:col-span-7">
          <PaymentForm
            amount={totals.grandTotal}
            onSubmitPayment={handleProcessPayment}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
