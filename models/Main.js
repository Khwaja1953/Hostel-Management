const mongoose = require('mongoose');

const mainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Main', mainSchema);