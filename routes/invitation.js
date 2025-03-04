import express from 'express';
import { generateInviteLink, getInviterScore, acceptInvite } from '../controllers/generateInviteLink.js';

const router = express.Router();

router.post('/generateInviteLink', generateInviteLink);
router.post('/acceptInvite', acceptInvite);
router.post('/getInviterScore/:inviter', getInviterScore);

export default router