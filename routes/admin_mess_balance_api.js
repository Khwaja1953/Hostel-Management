const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all active students sorted by roomNumber
router.get('/', async (req, res) => {
  try {
    const students = await Student.find(
      { status: 'active' }, // Filter students with status 'active'
      'enrollmentNumber roomNumber name department messBalance'
    ).sort({ roomNumber: 1 }); // Sort by roomNumber
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST attendance data
router.post('/', async (req, res) => {
  const { enrollmentNumber, attendance, guest, total } = req.body;
  if (!enrollmentNumber || attendance == null || guest == null || total == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    // console.log(`Attendance for Enrollment Number ${enrollmentNumber}: att=${attendance}, guest=${guest}, total=${total}`);
    // Optionally save or update in DB
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST to update mess balance and add transaction history
router.post('/update', async (req, res) => {
  const updates = req.body; // Array of updates [{ enrollmentNumber, total }]
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty updates array' });
  }

  try {
    for (const update of updates) {
      const { enrollmentNumber, total } = update;

      if (!enrollmentNumber || total == null) {
        return res.status(400).json({ error: 'Missing enrollmentNumber or total in update' });
      }

      // Find the student and update their messBalance and transactionHistory
      const student = await Student.findOne({ enrollmentNumber, status: 'active' });
      if (!student) {
        return res.status(404).json({ error: `Student with enrollmentNumber ${enrollmentNumber} not found` });
      }

      // Deduct the total from messBalance
      student.messBalance -= total;

      // Add a transaction history entry
      student.transactionHistory.push({
        type: 'debit',
        amount: total,
        date: new Date().toISOString().split('T')[0], // Format: yyyy-mm-dd
      });

      // Save the updated student
      await student.save();
    }

    res.status(200).json({ success: true, message: 'Students updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;