import User from '../models/User.js';
import Destination from '../models/Destination.js';

// Create or get user
export const registerUser = async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, score: 0 });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Get user score
export const getUserScore = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ score: user.score });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching score' });
  }
};

// Update user score
export const updateUserScore = async (req, res) => {
  const { username, correctClues, incorrectClues } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.score += correctClues * 5 - incorrectClues * 2; // Scoring logic
    await user.save();
    res.json({ score: user.score });
  } catch (error) {
    res.status(500).json({ message: 'Error updating score' });
  }
};



export const playGame = async (req, res) => {
  const { username, city, selectedClues } = req.body;

  try {
    // Find the user
    let user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the destination by city name
    const destination = await Destination.findOne({ city });
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    // Identify correct and incorrect clues
    const correctClues = destination.clues;
    const correctSelected = selectedClues.filter(clue => correctClues.includes(clue));
    const incorrectSelected = selectedClues.filter(clue => !correctClues.includes(clue));

    // Calculate score
    const prevScore = user.score;
    const scoreGained = correctSelected.length * 5;
    const scoreLost = incorrectSelected.length * 2;
    user.score += scoreGained - scoreLost;
    await user.save();

    // Pick a random fun fact
    const funFact = destination.fun_fact[Math.floor(Math.random() * destination.fun_fact.length)];

    res.json({
      message: 'Answer submitted!',
      prevScore,
      correctSelected,
      incorrectSelected,
      gainedPoints: scoreGained,
      lostPoints: scoreLost,
      updatedScore: user.score,
      funFact
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing answer' });
  }
};
