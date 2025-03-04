import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  inviter: { type: String, required: true },
  invitee: { type: String, required: false },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invitation', InvitationSchema);
