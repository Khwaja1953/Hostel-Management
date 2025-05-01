const mongoose = require('mongoose');

// Define the User schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

// Create the User model
const admin = mongoose.model('admin', adminSchema);

module.exports = admin;