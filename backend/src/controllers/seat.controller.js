import { dbStore } from '../services/store.js';
import { SeatLockService } from '../services/seatLock.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const SeatController = {
  getShowSeats: async (req, res, next) => {
    try {
      const { id: showId } = req.params;
      dbStore.cleanExpiredLocks();

      const show = dbStore.shows.get(showId);
      if (!show) {
        return apiResponse(res, 404, false, 'Showtime not found');
      }

      const screen = dbStore.screens.get(show.screenId);
      const movie = dbStore.movies.get(show.movieId);

      return apiResponse(res, 200, true, 'Seats layout retrieved', {
        show,
        screen,
        movie,
        bookedSeats: show.bookedSeats || [],
        lockedSeats: show.lockedSeats || [],
      });
    } catch (err) {
      next(err);
    }
  },

  lockSeats: async (req, res, next) => {
    try {
      const { id: showId } = req.params;
      const { seats } = req.body;
      const userId = req.user?._id || 'guest';

      if (!seats || !Array.isArray(seats) || seats.length === 0) {
        return apiResponse(res, 400, false, 'Seats array is required');
      }

      const lockResult = SeatLockService.lockSeats(showId, seats, userId);
      return apiResponse(res, 200, true, 'Seats successfully locked for 5 minutes', lockResult);
    } catch (err) {
      return apiResponse(res, 409, false, err.message);
    }
  },

  unlockSeats: async (req, res, next) => {
    try {
      const { id: showId } = req.params;
      const { seats } = req.body;
      const userId = req.user?._id || null;

      SeatLockService.unlockSeats(showId, seats, userId);
      return apiResponse(res, 200, true, 'Seats unlocked');
    } catch (err) {
      next(err);
    }
  },
};
