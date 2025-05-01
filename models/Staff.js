const mongoose = require('mongoose');

// Define the schema for storing staff details
const StaffSchema = new mongoose.Schema({
  empid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  phone: { type: String, required: true },
  type: {type: String, required: true, enum: ['Worker', 'Non-Worker', 'Student'],},
  profilePhotoBase64: { type: String }, // Base64-encoded profile photo
});

module.exports = mongoose.model('Staff', StaffSchema);