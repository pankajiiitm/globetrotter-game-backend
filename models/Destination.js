import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  clues: [String],
  fun_fact: [String],
  trivia: [String]
});

export default mongoose.model('Destination', DestinationSchema);