/**
 * SupportTicket Schema definition
 * Fields: { name, email, subject, message, status, createdAt }
 */

export const SupportTicketSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
};
