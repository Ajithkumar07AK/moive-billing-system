import { dbStore } from '../services/store.js';
import { generateBookingId } from '../utils/generateBookingId.js';
import { apiResponse } from '../utils/apiResponse.js';
import { PdfService } from '../services/pdf.service.js';
import { TicketService } from '../services/ticket.service.js';
import {
  calculateGrandTotal,
  canSelectSeat,
} from '../utils/pricing.js';

export const BookingController = {
  createBooking: async (req, res, next) => {
    try {
      const {
        showId,
        seats,
        paymentMethod = 'card',
        transactionId,
      } = req.body;

      if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
        return apiResponse(res, 400, false, 'Invalid booking request. ShowId and seats are required.');
      }

      dbStore.cleanExpiredLocks();
      const show = dbStore.shows.get(showId);
      if (!show) {
        return apiResponse(res, 404, false, 'Show not found');
      }

      const screen = dbStore.screens.get(show.screenId);
      const movie = dbStore.movies.get(show.movieId);
      const userId = req.user?._id || req.body.userId || 'guest';
      const userName = req.user?.name || req.body.userName || 'Guest User';
      const userEmail = req.user?.email || req.body.userEmail || 'guest@infinitycinema.com';

      // Atomic validation to prevent double booking
      for (const seatId of seats) {
        if (show.bookedSeats.includes(seatId)) {
          return apiResponse(res, 409, false, `Seat ${seatId} was just booked by another user`);
        }
      }

      // Re-calculate price on server (never trust client total)
      const seatObjects = seats.map((seatId) => {
        const row = seatId.charAt(0);
        const rowIndex = (screen?.rows || []).indexOf(row);
        let seatType = 'standard';
        if (rowIndex <= 1) seatType = 'recliner';
        else if (rowIndex <= 4) seatType = 'premium';

        const pricing = screen?.seatTypePricing || { standard: 250, premium: 400, recliner: 650 };
        return {
          id: seatId,
          type: seatType,
          price: pricing[seatType] || pricing.standard,
        };
      });

      const { subtotal, convenienceFee, taxes, grandTotal } = calculateGrandTotal(seatObjects);

      const bookingId = generateBookingId();
      const newBooking = {
        _id: `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        bookingId,
        userId,
        userName,
        userEmail,
        movieId: movie?._id || show.movieId,
        movieTitle: movie?.title || 'Feature Film',
        moviePoster: movie?.posterUrl || '',
        screenId: screen?._id || show.screenId,
        screenName: screen?.name || show.screenName,
        screenType: screen?.type || 'IMAX',
        showId: show._id,
        date: show.date,
        startTime: show.startTime,
        seats,
        seatType: seatObjects[0]?.type || 'Standard',
        subtotal,
        convenienceFee,
        taxes,
        totalAmount: grandTotal,
        paymentStatus: 'completed',
        paymentMethod,
        transactionId: transactionId || `TXN_${Date.now()}`,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // Add to booked seats on the show and clear user locks
      show.bookedSeats.push(...seats);
      show.lockedSeats = (show.lockedSeats || []).filter((l) => l.userId !== userId);

      // Save to store
      dbStore.bookings.set(newBooking.bookingId, newBooking);

      // Generate QR Code URL
      const qrCodeDataUrl = await TicketService.generateQrCodeDataUrl(newBooking);
      newBooking.qrCodeDataUrl = qrCodeDataUrl;

      return apiResponse(res, 201, true, 'Booking confirmed', newBooking);
    } catch (err) {
      next(err);
    }
  },

  getMyBookings: async (req, res, next) => {
    try {
      const userId = req.user?._id;
      const allBookings = Array.from(dbStore.bookings.values());

      let myBookings = [];
      if (userId) {
        myBookings = allBookings.filter((b) => b.userId === userId || b.userEmail === req.user?.email);
      } else {
        myBookings = allBookings;
      }

      // Sort newest first
      myBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return apiResponse(res, 200, true, 'Bookings fetched', myBookings);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const booking = dbStore.bookings.get(id);
      if (!booking) {
        return apiResponse(res, 404, false, 'Booking not found');
      }
      return apiResponse(res, 200, true, 'Booking found', booking);
    } catch (err) {
      next(err);
    }
  },

  downloadPdf: async (req, res, next) => {
    try {
      const { id } = req.params;
      const booking = dbStore.bookings.get(id);
      if (!booking) {
        return apiResponse(res, 404, false, 'Booking not found');
      }

      const pdfBuffer = await PdfService.generateTicketPdf(booking);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="InfinityCinema-Ticket-${booking.bookingId}.pdf"`
      );
      return res.send(Buffer.from(pdfBuffer));
    } catch (err) {
      next(err);
    }
  },
};
