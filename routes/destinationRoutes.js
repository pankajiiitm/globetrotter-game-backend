import express from 'express';
import { getRandomDestination } from '../controllers/destinationController.js';

const router = express.Router();

router.get('/random', getRandomDestination);

export default router;
