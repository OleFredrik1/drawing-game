'use strict';

import mongoose from 'mongoose';

var PointSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Point', PointSchema);
