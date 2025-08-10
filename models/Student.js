const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  enrollmentNumber: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  parentage: { type: String, required: true },
  address: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  emergencyContact: { type: Number, required: true },
  email: { type: String, required: true },
messBalance: { type: Number, required: true },
  department: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  startDate: { type: String, required: true },
  hostelLeavingDate: { type: String, default: null },
  status: { type: String, enum: ['active', 'left'], required: true },
  batch: {type: Number, required: true},
  hostel: {type: String, required: true},


   transactionHistory: [
     {
       type: {
         type: String, // 'credit' or 'debit'
         enum: ['credit', 'debit'],
         required: true,
       },
       amount: { type: Number, required: true }, // Amount credited or debited
       date: { type: Date, default: Date.now }, // Date of the transaction
      
     },
     
   ],
   profilePictureId: { type: mongoose.Schema.Types.ObjectId },
   profilePictureBase64: { type: String },
});

module.exports = mongoose.model('Student', studentSchema);