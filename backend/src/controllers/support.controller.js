import { dbStore } from '../services/store.js';
import { apiResponse } from '../utils/apiResponse.js';

export const SupportController = {
  createTicket: async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return apiResponse(res, 400, false, 'All fields are required to file a ticket');
      }

      const ticketId = `TCK_${Date.now()}`;
      const newTicket = {
        _id: ticketId,
        name,
        email,
        subject,
        message,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      dbStore.supportTickets.set(ticketId, newTicket);
      return apiResponse(res, 201, true, 'Support ticket created successfully', newTicket);
    } catch (err) {
      next(err);
    }
  },
};
