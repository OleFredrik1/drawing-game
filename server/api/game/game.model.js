'use strict';

import mongoose from 'mongoose';

var GameSchema = new mongoose.Schema({
  name: String,
  drawnObject: String,
  drawer: String,
  language: {type: String, enum: ["norwegian", "english"]},
  comments: [{
    user: String,
    comment: String,
    createdAt: {type: Date, default: Date.now()}
  }],
  guesses: [{
    user: String,
    createdAt: {type: Date, default: Date.now()},
    guess: String
  }],
  points: [{
    x: Number,
    y: Number,
    color: Number,
    order: Number
  }],
  password: {type: String, default: ""}
});

export default mongoose.model('Game', GameSchema);
