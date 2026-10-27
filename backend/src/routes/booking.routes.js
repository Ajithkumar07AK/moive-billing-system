import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', BookingController.createBooking);
router.get('/my', authMiddleware, BookingController.getMyBookings);
router.get('/:id', BookingController.getById);
router.get('/:id/pdf', BookingController.downloadPdf);

export default router;
