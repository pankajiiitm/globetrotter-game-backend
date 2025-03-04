import Invitation from '../models/Invitation.js';
import User from "../models/User.js";

// Generate invite link
export const generateInviteLink = async (req, res) => {
  const { inviter, invitee } = req.body;

  try {
    const user = await User.findOne({ username: invitee });
    // if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user) {
          user = new User({ username: invitee, score: 0 });
          await user.save();
        }

    const inviteLink = `https://localhost:3000/game?inviter=${inviter}&invitee=${invitee}&score=${user.score}`;

    // Store invitation in DB
    const newInvite = new Invitation({ inviter, score: user.score , invitee});
    await newInvite.save();

    res.json({ inviteLink, invitee });
  } catch (error) {
    res.status(500).json({ message: 'Error generating invite link' });
  }
};

// Accept invitation & register invitee
export const acceptInvite = async (req, res) => {
  const { inviter, invitee } = req.body;

  try {
    // Check if invitee already exists
    let user = await User.findOne({ username: invitee });

    // If not found, create a new user
    if (!user) {
      user = new User({ username: invitee, score: 0 });
      await user.save();
    }

    // Update invitation record with invitee's name
    await Invitation.findOneAndUpdate(
      { inviter, invitee: null }, // Find an unused invite
      { invitee }, // Update with invitee's name
      { new: true }
    );

    res.json({ message: `Welcome, ${invitee}! You’ve accepted the challenge.` });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting invite' });
  }
};

// Fetch inviter's score before invitee starts playing
export const getInviterScore = async (req, res) => {
  const  inviter = req.params.inviter;

  try {
    const user = await User.findOne({ username: inviter });

    if (!user) return res.status(404).json({ message: 'Inviter not found' });

    res.json({ inviter, score: user.score });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inviter score' });
  }
};
