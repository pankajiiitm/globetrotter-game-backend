import express from 'express';
import { registerUser, getUserScore, updateUserScore, playGame } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/:username/score', getUserScore);
router.post('/update-score', updateUserScore);
router.post('/play', playGame);


export default router;
