const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import the Student model
// POST /api/login
router.post('/', async (req, res) => {
  const { enrollmentNumber, dob } = req.body;

  try {
    // Find the student by enrollment number and date of birth
    const student = await Student.findOne({ enrollmentNumber, dob });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Student not found or incorrect credentials',
      });
    }

    // Return a success message, token, and student details
    res.status(200).json({
      success: true,
      message: 'Login successful',
      // token: token, // Include the token in the response
      user: {
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        dob: student.dob,
        // roomNumber: student.roomNumber.toString,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;