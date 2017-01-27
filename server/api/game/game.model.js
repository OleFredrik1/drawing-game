'use strict';

import mongoose from 'mongoose';

var GameSchema = new mongoose.Schema({
  name: String,
  drawnObject: String,
  drawer: String,
  drawerToken: {type: String, default: (Math.random() * 1000000000000000).toString(36) + (Math.random() * 1000000000000000).toString(36)},
  language: {type: String, enum: ["norwegian", "english"]},
  createdAt: {type: Date, default: Date.now()},
  comments: [{
    user: String,
    comment: String,
    createdAt: Number
  }],
  guesses: [{
    user: String,
    createdAt: Number,
    guess: String
  }],
  points: [{
    x: Number,
    y: Number,
    color: String,
    size: Number,
    order: Number,
    startPoint: Boolean
  }],
  password: {type: String, default: ""}
});

export default mongoose.model('Game', GameSchema);
