import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calculateGrandTotal, canSelectSeat, SEAT_LOCK_DURATION_MS } from '../utils/pricing.js';
import { bookingApi } from '../api/booking.api.js';
import { useAuth } from './AuthContext.jsx';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [screen, setScreen] = useState(null);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // Array of { id, row, number, type, price }
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const [latestBooking, setLatestBooking] = useState(null);

  // Compute pricing totals dynamically
  const totals = useMemo(() => {
    return calculateGrandTotal(selectedSeats);
  }, [selectedSeats]);

  // Lock countdown timer
  useEffect(() => {
    if (!lockExpiresAt) {
      setLockSecondsLeft(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((lockExpiresAt - Date.now()) / 1000));
      setLockSecondsLeft(remaining);
      if (remaining <= 0) {
        setLockExpiresAt(null);
        setSelectedSeats([]);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockExpiresAt]);

  const toggleSeat = useCallback(
    (seat, bookedSeats = [], lockedSeats = []) => {
      setSelectedSeats((prev) => {
        const isSelected = prev.some((s) => s.id === seat.id);
        if (isSelected) {
          return prev.filter((s) => s.id !== seat.id);
        }

        const currentlySelectedIds = prev.map((s) => s.id);
        const check = canSelectSeat(
          seat.id,
          currentlySelectedIds,
          bookedSeats,
          lockedSeats,
          user?._id
        );

        if (!check.allowed) {
          throw new Error(check.reason);
        }

        return [...prev, seat];
      });
    },
    [user]
  );

  const lockSeatsOnServer = useCallback(
    async (showId) => {
      if (!selectedSeats.length || !showId) return false;
      const seatIds = selectedSeats.map((s) => s.id);
      try {
        const res = await bookingApi.lockSeats(showId, seatIds);
        const expiry = res?.data?.expiresAt || Date.now() + SEAT_LOCK_DURATION_MS;
        setLockExpiresAt(expiry);
        return true;
      } catch (err) {
        // Fallback local lock if offline
        const expiry = Date.now() + SEAT_LOCK_DURATION_MS;
        setLockExpiresAt(expiry);
        return true;
      }
    },
    [selectedSeats]
  );

  const unlockSeatsOnServer = useCallback(async () => {
    if (show?._id && selectedSeats.length > 0) {
      try {
        await bookingApi.unlockSeats(
          show._id,
          selectedSeats.map((s) => s.id)
        );
      } catch (e) {
        // ignore
      }
    }
    setLockExpiresAt(null);
    setLockSecondsLeft(0);
  }, [show, selectedSeats]);

  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
    unlockSeatsOnServer();
  }, [unlockSeatsOnServer]);

  const resetBookingFlow = useCallback(() => {
    unlockSeatsOnServer();
    setMovie(null);
    setScreen(null);
    setShow(null);
    setSelectedSeats([]);
    setLockExpiresAt(null);
  }, [unlockSeatsOnServer]);

  const value = {
    movie,
    setMovie,
    date,
    setDate,
    screen,
    setScreen,
    show,
    setShow,
    selectedSeats,
    setSelectedSeats,
    toggleSeat,
    clearSeats,
    totals,
    lockExpiresAt,
    lockSecondsLeft,
    lockSeatsOnServer,
    unlockSeatsOnServer,
    latestBooking,
    setLatestBooking,
    resetBookingFlow,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
