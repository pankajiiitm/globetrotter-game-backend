import Destination from '../models/Destination.js';



// Get random destination with clues
export const getRandomDestination = async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(randomIndex);

    if (!destination) {
      return res.status(404).json({ message: "No destinations found" });
    }

    const allDestinations = await Destination.find();
    const incorrectClues = allDestinations
      .filter((d) => d.city !== destination.city)
      .flatMap((d) => d.clues);

    const shuffledIncorrectClues = incorrectClues.sort(() => 0.5 - Math.random());
    const selectedIncorrectClues = shuffledIncorrectClues.slice(0, 2);
    
    const correctClues = destination.clues.sort(() => 0.5 - Math.random()).slice(0, 2);
    const mixedClues = [...correctClues, ...selectedIncorrectClues].sort(() => 0.5 - Math.random());

    res.json({
      city: destination.city,
      country: destination.country,
      clues: mixedClues,
      correctClues: correctClues, 
      funFact: destination.fun_fact[Math.floor(Math.random() * destination.fun_fact.length)],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching destination" });
  }
};

