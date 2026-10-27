import { Router } from 'express';
import { SupportController } from '../controllers/support.controller.js';

const router = Router();

router.post('/', SupportController.createTicket);

export default router;
