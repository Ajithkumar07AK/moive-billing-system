import { DEMO_USER, INITIAL_MOVIES, INITIAL_SCREENS } from '../utils/constants.js';

class InMemoryDB {
  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.screens = new Map();
    this.shows = new Map();
    this.bookings = new Map();
    this.supportTickets = new Map();
    this.seed();
  }

  seed() {
    // 1. Seed Demo User
    this.users.set(DEMO_USER.email.toLowerCase(), {
      _id: DEMO_USER._id,
      name: DEMO_USER.name,
      email: DEMO_USER.email.toLowerCase(),
      phone: DEMO_USER.phone,
      passwordHash: DEMO_USER.password,
      role: DEMO_USER.role,
      createdAt: new Date().toISOString(),
    });

    // 2. Seed Screens
    INITIAL_SCREENS.forEach((screen) => {
      this.screens.set(screen._id, { ...screen });
    });

    // 3. Seed Movies
    INITIAL_MOVIES.forEach((movie) => {
      this.movies.set(movie._id, { ...movie });
    });

    // 4. Generate shows across 7 days
    this.generateShows();
  }

  generateShows() {
    const today = new Date();
    const movieIds = Array.from(this.movies.keys());
    const screenList = Array.from(this.screens.values());

    const timeSlots = [
      { start: '10:30', end: '13:00' },
      { start: '14:00', end: '16:30' },
      { start: '17:30', end: '20:00' },
      { start: '21:00', end: '23:30' },
    ];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dateStr = d.toISOString().slice(0, 10);

      movieIds.forEach((mId, mIdx) => {
        const movie = this.movies.get(mId);
        if (movie?.status !== 'now_showing') return;

        screenList.forEach((screen, sIdx) => {
          if ((mIdx + sIdx + dayOffset) % 2 === 0) {
            timeSlots.forEach((slot, slotIdx) => {
              if ((mIdx + slotIdx) % 2 === 0) {
                const showId = `show_${mId}_${screen._id}_${dateStr}_${slot.start.replace(':', '')}`;
                
                const preBooked = [];
                if (dayOffset === 0) {
                  const sampleSeats = ['C4', 'C5', 'E6', 'E7', 'F5'];
                  sampleSeats.forEach((s) => {
                    if ((slotIdx + sIdx) % 2 === 0) preBooked.push(s);
                  });
                }

                this.shows.set(showId, {
                  _id: showId,
                  movieId: mId,
                  screenId: screen._id,
                  screenName: screen.name,
                  screenType: screen.type,
                  date: dateStr,
                  startTime: slot.start,
                  endTime: slot.end,
                  basePrice: screen.seatTypePricing.standard,
                  bookedSeats: preBooked,
                  lockedSeats: [],
                });
              }
            });
          }
        });
      });
    }
  }

  cleanExpiredLocks() {
    const now = Date.now();
    this.shows.forEach((show) => {
      if (show.lockedSeats && show.lockedSeats.length > 0) {
        show.lockedSeats = show.lockedSeats.filter((lock) => lock.expiresAt > now);
      }
    });
  }
}

export const dbStore = new InMemoryDB();
