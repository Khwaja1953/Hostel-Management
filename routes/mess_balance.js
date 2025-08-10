const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import the Student model

// GET mess balance and transaction history for a specific student
router.get('/', async (req, res) => {
  const enrollmentNumber = req.headers['x-enrollment-number']; // Get enrollmentNumber from header

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    // Find the student by enrollment number
    const student = await Student.findOne(
      { enrollmentNumber },
      'messBalance transactionHistory' // Fetch only messBalance and transactionHistory
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Sort transactionHistory by date in descending order (newest first)
    const sortedTransactions = student.transactionHistory.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Respond with mess balance and sorted transaction history
    res.status(200).json({
      messBalance: student.messBalance,
      transactionHistory: sortedTransactions,
    });
  } catch (err) {
    console.error('Error fetching mess balance and transaction history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
module.exports = router;