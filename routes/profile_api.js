const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Student = require('../models/Student'); // Import the Student model

// GET /api/profile - Fetch student details by enrollment number
router.get('/', async (req, res) => {
  const { enrollmentNumber } = req.query;
  const hostel = req.headers['x-hostel'];

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    const student = await Student.findOne({ enrollmentNumber, hostel });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({
      enrollmentNumber: student.enrollmentNumber,
      name: student.name,
      dob: student.dob,
      parentage: student.parentage,
      address: student.address,
      registrationNumber: student.registrationNumber,
      contactNumber: student.contactNumber,
      emergencyContact: student.emergencyContact,
      email: student.email,
      department: student.department,
      roomNumber: student.roomNumber,
      startDate: student.startDate,
      hostelLeavingDate: student.hostelLeavingDate,
      status: student.status,
      batch: student.batch,
      transactionHistory: student.transactionHistory,
      profilePictureBase64: student.profilePictureBase64, // Return Base64-encoded profile picture
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/profile/delete/:enrollmentNumber - Delete student by enrollment number
router.delete('/delete/:enrollmentNumber', async (req, res) => {
  const { enrollmentNumber } = req.params;

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    const deletedStudent = await Student.findOneAndDelete({ enrollmentNumber });

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;