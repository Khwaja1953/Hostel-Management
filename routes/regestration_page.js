const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const Student = require('../models/Student'); // Student model

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage });

// POST /api/register - Register a new student with Base64 profile picture
router.post('/', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      enrollmentNumber,
      name,
      dob,
      parentage,
      address,
      registrationNumber,
      contactNumber,
      emergencyContact,
      email,
      messBalance,
      department,
      roomNumber,
      startDate,
      hostelLeavingDate,
      status,
      batch,
      transactionHistory,
    } = req.body;

    // Check if a student with the same enrollmentNumber already exists
    const existingStudent = await Student.findOne({ enrollmentNumber });
    if (existingStudent) {
      return res.status(409).json({ error: 'Student already registered' });
    }

    // Convert the uploaded profile picture to Base64
    let profilePictureBase64 = null;
    if (req.file) {
      profilePictureBase64 = req.file.buffer.toString('base64');
    }

    // Parse transactionHistory if it's sent as a JSON string
    let parsedTransactionHistory = [];
    try {
      parsedTransactionHistory = transactionHistory
        ? JSON.parse(transactionHistory)
        : [];
    } catch (error) {
      console.error('Error parsing transactionHistory:', error);
      return res.status(400).json({ error: 'Invalid transactionHistory format' });
    }

    // Create a new student document
    const newStudent = new Student({
      enrollmentNumber,
      name,
      dob,
      parentage,
      address,
      registrationNumber,
      contactNumber,
      emergencyContact,
      email,
      messBalance,
      department,
      roomNumber,
      startDate,
      hostelLeavingDate,
      status,
      batch,
      transactionHistory: parsedTransactionHistory,
      profilePictureBase64, // Save the Base64-encoded profile picture
    });

    await newStudent.save();

    res.status(201).json({
      message: 'Student registered successfully',
      studentId: newStudent._id,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/register/student/:enrollmentNumber - Fetch student details by enrollment number
router.get('/student/:enrollmentNumber', async (req, res) => {
  const enrollmentNumber = req.params.enrollmentNumber;

  try {
    const student = await Student.findOne({ enrollmentNumber });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

module.exports = router;