import QRCode from 'qrcode';

export class TicketService {
  static async generateQrCodeDataUrl(booking) {
    const payload = JSON.stringify({
      id: booking.bookingId,
      movie: booking.movieTitle,
      screen: booking.screenName,
      seats: booking.seats,
      date: booking.date,
      time: booking.startTime,
      user: booking.userName,
    });

    return QRCode.toDataURL(payload, {
      width: 250,
      margin: 1,
      color: {
        dark: '#05030f',
        light: '#ffffff',
      },
    });
  }
}
