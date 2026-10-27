import { dbStore } from './store.js';
import { canSelectSeat, SEAT_LOCK_DURATION_MS } from '../utils/pricing.js';

export class SeatLockService {
  static lockSeats(showId, seatIds = [], userId = 'guest') {
    dbStore.cleanExpiredLocks();
    const show = dbStore.shows.get(showId);
    if (!show) {
      throw new Error('Showtime not found');
    }

    const now = Date.now();
    const expiresAt = now + SEAT_LOCK_DURATION_MS;

    // Check availability
    for (const seatId of seatIds) {
      const check = canSelectSeat(
        seatId,
        [],
        show.bookedSeats || [],
        (show.lockedSeats || []).filter((l) => l.userId !== userId)
      );
      if (!check.allowed) {
        throw new Error(check.reason || `Seat ${seatId} is unavailable`);
      }
    }

    // Release any existing locks by this user on other seats
    show.lockedSeats = (show.lockedSeats || []).filter((l) => l.userId !== userId);

    // Apply new locks
    for (const seatId of seatIds) {
      show.lockedSeats.push({
        seat: seatId,
        userId,
        expiresAt,
      });
    }

    return {
      lockedSeats: seatIds,
      expiresAt,
      lockDurationMs: SEAT_LOCK_DURATION_MS,
    };
  }

  static unlockSeats(showId, seatIds = [], userId = null) {
    const show = dbStore.shows.get(showId);
    if (!show) return false;

    if (seatIds.length > 0) {
      show.lockedSeats = (show.lockedSeats || []).filter(
        (l) => !(seatIds.includes(l.seat) && (!userId || l.userId === userId))
      );
    } else if (userId) {
      show.lockedSeats = (show.lockedSeats || []).filter((l) => l.userId !== userId);
    }
    return true;
  }
}
