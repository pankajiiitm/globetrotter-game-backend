import Destination from '../models/Destination.js';



// Get random destination with clues
export const getRandomDestination = async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);

    if (!destination) return res.status(404).json({ message: 'No destinations found' });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destination' });
  }
};


// // @desc    Get random destinations
// // @route   GET /api/destinations/random
// // @access  Public
// export const getRandomDestinations = async (req, res) => {
//   try {
//     const destinations = await Destination.aggregate([{ $sample: { size: 3 } }]);
//     res.json(destinations);
//   } catch (error) {
//     console.error('Error fetching destinations:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// import Destination from '../models/Destination.js';
