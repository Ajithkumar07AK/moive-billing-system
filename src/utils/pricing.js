/**
 * Seat pricing calculations, locking validation, and reference generators
 */

export const DEFAULT_SEAT_PRICING = {
  standard: 250,
  premium: 400,
  recliner: 650,
};

export const CONVENIENCE_FEE_RATE = 0.08; // 8% convenience fee
export const TAX_RATE = 0.18; // 18% tax on convenience fee
export const MAX_SEATS_ALLOWED = 8;
export const SEAT_LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function calculateSubtotal(seats = []) {
  return seats.reduce((sum, seat) => sum + (seat.price || 0), 0);
}

export function calculateConvenienceFee(subtotal) {
  if (!subtotal || subtotal <= 0) return 0;
  return Math.round(subtotal * CONVENIENCE_FEE_RATE);
}

export function calculateTaxes(convenienceFee) {
  if (!convenienceFee || convenienceFee <= 0) return 0;
  return Math.round(convenienceFee * TAX_RATE);
}

export function calculateGrandTotal(seats = []) {
  const subtotal = calculateSubtotal(seats);
  const convenienceFee = calculateConvenienceFee(subtotal);
  const taxes = calculateTaxes(convenienceFee);
  const grandTotal = subtotal + convenienceFee + taxes;

  return { subtotal, convenienceFee, taxes, grandTotal };
}

export function canSelectSeat(
  seatId,
  currentlySelected = [],
  bookedSeats = [],
  lockedSeats = [],
  currentUserId = null
) {
  if (bookedSeats.includes(seatId)) {
    return { allowed: false, reason: 'Seat is already booked' };
  }

  const now = Date.now();
  const activeLock = lockedSeats.find(
    (l) => l.seat === seatId && l.expiresAt > now && (!currentUserId || l.userId !== currentUserId)
  );
  if (activeLock) {
    return { allowed: false, reason: 'Seat is temporarily reserved by another guest' };
  }

  const isAlreadySelected = currentlySelected.includes(seatId);
  if (!isAlreadySelected && currentlySelected.length >= MAX_SEATS_ALLOWED) {
    return { allowed: false, reason: `Maximum ${MAX_SEATS_ALLOWED} seats can be selected per booking` };
  }

  return { allowed: true };
}

export function generateBookingId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INF-${dateStr}-${rand}`;
}

export function getRemainingLockSeconds(expiresAt) {
  const diffMs = (expiresAt || 0) - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}
