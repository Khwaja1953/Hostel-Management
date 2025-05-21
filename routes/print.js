const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all active students sorted by roomNumber
router.get('/', async (req, res) => {
  try {
    const students = await Student.find(
      { status: 'active' }, // Filter students with status 'active'
      'enrollmentNumber roomNumber name department transactionHistory messBalance'
    ).sort({ roomNumber: 1 }); // Sort by roomNumber
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;