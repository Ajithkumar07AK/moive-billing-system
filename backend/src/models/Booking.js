/**
 * Booking Schema definition
 * Fields: { bookingId, userId, showId, movieId, screenName, seats[], amount, paymentStatus, paymentMethod, transactionId, status, createdAt }
 */

export const BookingSchema = {
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String },
  screenId: { type: String, required: true },
  screenName: { type: String, required: true },
  screenType: { type: String },
  showId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  seats: [{ type: String, required: true }],
  seatType: { type: String, default: 'Standard' },
  subtotal: { type: Number, required: true },
  convenienceFee: { type: Number, required: true },
  taxes: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
};
