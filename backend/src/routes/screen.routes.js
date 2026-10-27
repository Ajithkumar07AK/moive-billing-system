import { Router } from 'express';
import { ScreenController } from '../controllers/screen.controller.js';

const router = Router();

router.get('/', ScreenController.getAll);
router.get('/:id', ScreenController.getById);

export default router;
