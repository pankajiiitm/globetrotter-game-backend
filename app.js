import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import destinationRoutes from './routes/destinationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import inviteRoutes from './routes/invitation.js'

dotenv.config();

const app = express();

//8wccrBTNIsucYu4Z
// Username - vermapankaj1234567890

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/invite', inviteRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
