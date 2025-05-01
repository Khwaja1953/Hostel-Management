const mongoose = require('mongoose');

const RegisteredstaffSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Registeredstaff', RegisteredstaffSchema);