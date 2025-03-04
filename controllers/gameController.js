import Destination from '../models/Destination.js';
import User from '../models/User.js';


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
}