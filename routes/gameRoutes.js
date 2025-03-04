import express from 'express';
import { playGame } from '../controllers/gameController.js';

const router = express.Router();

router.post('/play', playGame);

export default router;