const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the photo file
  photoBase64: { type: String, required: true }, // Base64-encoded photo
  uploadedAt: { type: Date, default: Date.now }, // Timestamp for when the photo was uploaded
});

module.exports = mongoose.model('Photo', PhotoSchema);