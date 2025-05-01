const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  document: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Upload', uploadSchema);