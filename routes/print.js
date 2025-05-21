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
      // Add lastTransaction field to each student
    const studentsWithLastTransaction = students.map(student => {
      // Convert to plain array
      const history = Array.isArray(student.transactionHistory)
        ? student.transactionHistory.map(t => t.toObject ? t.toObject() : t)
        : [];
      // Sort by date descending and pick the first (most recent)
      const lastTransaction = history.length > 0
        ? history.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null;
      return {
        enrollmentNumber: student.enrollmentNumber,
        roomNumber: student.roomNumber,
        name: student.name,
        department: student.department,
        messBalance: student.messBalance,
        lastTransaction, // will be null if no transaction
      };
    });
    res.status(200).json(studentsWithLastTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;