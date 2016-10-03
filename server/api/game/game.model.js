'use strict';

import mongoose from 'mongoose';

var GameSchema = new mongoose.Schema({
  name: String,
  drawnObject: String,
  comments: [{
    userId: String,
    comment: String,
    createdAt: {type: Date, default: Day.now()}
  }],
  guesses: [{
    userId: String,
    guess: String,
    createdAt: {type: Date, default: Day.now()}
  }],
  points: [{
    x: Number,
    y: Number,
    color: Number,
    order: Number
  }]
});

export default mongoose.model('Game', GameSchema);
