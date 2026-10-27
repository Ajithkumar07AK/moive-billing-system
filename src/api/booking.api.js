import api from './axios.js';

export const bookingApi = {
  getShowSeats: async (showId) => {
    return api.get(`/shows/${showId}/seats`);
  },
  lockSeats: async (showId, seats) => {
    return api.post(`/shows/${showId}/lock`, { seats });
  },
  unlockSeats: async (showId, seats) => {
    return api.post(`/shows/${showId}/unlock`, { seats });
  },
  createBooking: async (bookingData) => {
    return api.post('/bookings', bookingData);
  },
  processPayment: async (paymentData) => {
    return api.post('/payments/process', paymentData);
  },
  getMyBookings: async () => {
    return api.get('/bookings/my');
  },
  getBookingById: async (id) => {
    return api.get(`/bookings/${id}`);
  },
  getBookingPdfUrl: (bookingId) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${base}/bookings/${bookingId}/pdf`;
  },
  submitSupportTicket: async (ticketData) => {
    return api.post('/support', ticketData);
  },
};
