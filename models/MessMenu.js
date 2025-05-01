const mongoose = require('mongoose');

const MessMenuSchema = new mongoose.Schema({
  image: {
    type: Buffer, // Store the image as a binary buffer
    required: true,
  },
  imageType: {
    type: String, // Store the MIME type of the image (e.g., 'image/jpeg')
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

MessMenuSchema.virtual('imageUrl').get(function () {
  if (this.image && this.imageType) {
    return `data:${this.imageType};base64,${this.image.toString('base64')}`;
  }
});

module.exports = mongoose.model('MessMenu', MessMenuSchema);