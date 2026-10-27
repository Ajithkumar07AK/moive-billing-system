import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';

const router = Router();

router.post('/process', PaymentController.processPayment);

export default router;
