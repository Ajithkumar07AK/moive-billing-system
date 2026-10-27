import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatTime } from '../utils/formatters.js';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { Download, CheckCircle, Ticket, Home } from 'lucide-react';

export default function TicketCard({
  booking,
  onViewBookings,
  onBackToHome,
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!booking) return;
    const qrPayload = JSON.stringify({
      id: booking.bookingId,
      movie: booking.movieTitle,
      screen: booking.screenName,
      seats: booking.seats,
      date: booking.date,
      time: booking.startTime,
      user: booking.userName,
    });

    QRCode.toDataURL(qrPayload, {
      width: 200,
      margin: 1,
      color: {
        dark: '#09090e',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [booking]);

  const handleDownloadPdf = () => {
    if (!booking) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [105, 148],
    });

    doc.setFillColor(15, 14, 23);
    doc.rect(0, 0, 105, 148, 'F');

    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.roundedRect(6, 6, 93, 136, 3, 3, 'S');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('INFINITY CINEMA', 52.5, 16, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL THEATRICAL PASS', 52.5, 21, { align: 'center' });

    doc.setDrawColor(40, 38, 55);
    doc.line(12, 25, 93, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(booking.movieTitle, 80);
    doc.text(splitTitle, 52.5, 33, { align: 'center' });

    let y = 44;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Booking ID:', 14, y);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.bookingId, 91, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Auditorium:', 14, y);
    doc.setTextColor(255, 255, 255);
    doc.text(booking.screenName, 91, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.text('Date & Time:', 14, y);
    doc.setTextColor(255, 255, 255);
    doc.text(`${booking.date} · ${formatTime(booking.startTime)}`, 91, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.text('Seats:', 14, y);
    doc.setTextColor(165, 180, 252);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.seats.join(', '), 91, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Guest:', 14, y);
    doc.setTextColor(255, 255, 255);
    doc.text(booking.userName || 'Guest', 91, y, { align: 'right' });

    y += 7;
    doc.setTextColor(148, 163, 184);
    doc.text('Amount Paid:', 14, y);
    doc.setTextColor(52, 211, 153);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(booking.totalAmount), 91, y, { align: 'right' });

    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 38.5, 93, 28, 28);
    }

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Scan at auditorium turnstile for entry', 52.5, 128, { align: 'center' });

    doc.save(`InfinityCinema-${booking.bookingId}.pdf`);
  };

  if (!booking) return null;

  return (
    <div className="max-w-md mx-auto font-sans">
      <div className="relative rounded-2xl overflow-hidden glass-panel-glow border border-indigo-500/30 shadow-[0_0_35px_rgba(79,107,255,0.25)]">
        <div className="p-6 text-center border-b border-dashed border-indigo-500/30 bg-indigo-950/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <InfinitySymbol className="w-5 h-5 text-cyan-400" animated={true} />
            <span className="font-display font-bold text-xs tracking-widest uppercase bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              Infinity Cinema
            </span>
          </div>
          <h2 className="font-display font-extrabold text-xl text-white">
            {booking.movieTitle}
          </h2>
          <p className="text-[11px] text-cyan-400 mt-0.5 font-display uppercase tracking-wider">Limitless Void Pass</p>
        </div>

        <div className="p-6 space-y-5 bg-[#0a0820]/70">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-display">Booking ID</span>
              <span className="font-mono font-bold text-cyan-300">
                {booking.bookingId}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-display">Status</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Confirmed
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-display">Auditorium</span>
              <span className="font-semibold text-white">{booking.screenName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-display">Showtime</span>
              <span className="font-semibold text-white">
                {booking.date} · {formatTime(booking.startTime)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-display">Seats</span>
              <span className="font-mono font-bold text-indigo-300 text-sm">
                {booking.seats.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-display">Void Traveler</span>
              <span className="font-semibold text-white truncate block">
                {booking.userName}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-500/20 flex flex-col items-center justify-center space-y-2">
            {qrDataUrl ? (
              <div className="p-2.5 rounded-xl bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <img src={qrDataUrl} alt="Ticket QR code" className="w-24 h-24" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-slate-800 animate-pulse rounded-xl" />
            )}
            <p className="text-[10px] text-slate-400 text-center font-display uppercase tracking-wider">
              Scan barcode at turnstiles for express limitless entry
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleDownloadPdf}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-electric shadow-[0_0_20px_rgba(79,107,255,0.4)] font-display"
        >
          <Download className="w-4 h-4" />
          Download PDF Pass
        </button>

        <button
          onClick={onViewBookings}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-white glass-panel hover:border-cyan-400/50 transition-all font-display"
        >
          <Ticket className="w-4 h-4" />
          My Tickets
        </button>

        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      </div>
    </div>
  );
}
