import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller.js';

const router = Router();

router.get('/', MovieController.getAll);
router.get('/categories', MovieController.getCategories);
router.get('/:id', MovieController.getById);
router.get('/:id/shows', MovieController.getShowsByMovie);

export default router;
