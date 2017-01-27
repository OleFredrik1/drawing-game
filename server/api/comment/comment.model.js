'use strict';

import mongoose from 'mongoose';

var CommentSchema = new mongoose.Schema({
  userId: String,
  comment: String
});

export default mongoose.model('Comment', CommentSchema);
