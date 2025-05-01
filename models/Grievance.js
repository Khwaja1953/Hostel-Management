const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  enrollmentNumber: { type: String, required: true },
  name: { type: String, required: true },
  roomNumber: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Grievance', GrievanceSchema);