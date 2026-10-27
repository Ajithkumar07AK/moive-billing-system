import { Router } from 'express';
import { SeatController } from '../controllers/seat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:id/seats', SeatController.getShowSeats);
router.post('/:id/lock', authMiddleware, SeatController.lockSeats);
router.post('/:id/unlock', SeatController.unlockSeats);

export default router;
