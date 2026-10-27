/**
 * Show Schema definition
 * Fields: { movieId, screenId, date, startTime, endTime, basePrice, bookedSeats[], lockedSeats[{seat, userId, expiresAt}] }
 */

export const ShowSchema = {
  movieId: { type: String, required: true },
  screenId: { type: String, required: true },
  screenName: { type: String, required: true },
  screenType: { type: String, default: 'Standard' },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  basePrice: { type: Number, required: true },
  bookedSeats: [{ type: String }],
  lockedSeats: [
    {
      seat: { type: String, required: true },
      userId: { type: String, required: true },
      expiresAt: { type: Number, required: true },
    },
  ],
};
