const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  image: {
    type: Buffer,
    required: true,
  },
  imageType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
});

AboutSchema.virtual('imageUrl').get(function () {
  if (this.image && this.imageType) {
    return `data:${this.imageType};base64,${this.image.toString('base64')}`;
  }
});

module.exports = mongoose.model('About', AboutSchema);