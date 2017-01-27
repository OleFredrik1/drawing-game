'use strict';

import mongoose from 'mongoose';

var GuessSchema = new mongoose.Schema({
  userId: String,
  guess: String,
  gameId: String
});

export default mongoose.model('Guess', GuessSchema);
