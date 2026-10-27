import { jsPDF } from 'jspdf';
import { TicketService } from './ticket.service.js';
import { formatCurrency, formatTime } from '../utils/formatters.js';

export class PdfService {
  static async generateTicketPdf(booking) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [105, 148], // A6 pocket ticket format
    });

    // Dark background
    doc.setFillColor(5, 3, 15);
    doc.rect(0, 0, 105, 148, 'F');

    // Header border glow
    doc.setDrawColor(79, 107, 255);
    doc.setLineWidth(0.8);
    doc.roundedRect(5, 5, 95, 138, 4, 4, 'S');

    // Brand Title
    doc.setTextColor(192, 132, 252);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('INFINITY CINEMA', 52.5, 16, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('LIMITLESS THEATRICAL PASS', 52.5, 21, { align: 'center' });

    // Line
    doc.setDrawColor(30, 27, 75);
    doc.line(10, 25, 95, 25);

    // Movie Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(booking.movieTitle || 'Movie Ticket', 85);
    doc.text(splitTitle, 52.5, 32, { align: 'center' });

    // Details Grid
    let y = 43;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Booking ID:', 12, y);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.bookingId || 'INF-0000', 93, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Screen:', 12, y);
    doc.setTextColor(96, 165, 250);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.screenName || 'Screen 1', 93, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Date & Time:', 12, y);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${booking.date} · ${formatTime(booking.startTime || '18:00')}`, 93, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Seats:', 12, y);
    doc.setTextColor(192, 132, 252);
    doc.setFont('helvetica', 'bold');
    doc.text((booking.seats || []).join(', '), 93, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Guest Name:', 12, y);
    doc.setTextColor(255, 255, 255);
    doc.text(booking.userName || 'Guest', 93, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.text('Total Paid:', 12, y);
    doc.setTextColor(52, 211, 153);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(booking.totalAmount || 0), 93, y, { align: 'right' });

    // QR Code
    const qrDataUrl = await TicketService.generateQrCodeDataUrl(booking);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 37.5, 92, 30, 30);
    }

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Scan at auditorium entrance terminal', 52.5, 127, { align: 'center' });
    doc.text('Infinity Cinema · Limitless Theatrical Journey', 52.5, 132, { align: 'center' });

    return doc.output('arraybuffer');
  }
}
