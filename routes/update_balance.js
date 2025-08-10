const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET student details by enrollmentNumber
router.get('/:enrollmentNumber', async (req, res) => {
  const { enrollmentNumber } = req.params;
  const hostel = req.headers['x-hostel'];
  // console.log('Received enrollmentNumber:', enrollmentNumber, hostel);

  try {
    const student = await Student.findOne({ enrollmentNumber, hostel });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({
      enrollmentNumber: student.enrollmentNumber,
      roomNumber: student.roomNumber,
      name: student.name,
      department: student.department,
      messBalance: student.messBalance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST to update mess balance
router.post('/update', async (req, res) => {
  const { enrollmentNumber, creditedBalance } = req.body;

  if (!enrollmentNumber || creditedBalance == null) {
    return res.status(400).json({ error: 'Missing enrollmentNumber or creditedBalance' });
  }

  try {
    const student = await Student.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update mess balance
    student.messBalance += creditedBalance;

    student.transactionHistory.push({
      type: 'credit', // Ensure this is in lowercase
      amount: creditedBalance,
      date: new Date(),
    });

    // Save the updated student
    await student.save();

    res.status(200).json({ success: true, message: 'Mess balance updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST to debit mess balance
router.post('/debit', async (req, res) => {
  const { enrollmentNumber, debitedBalance } = req.body;

  if (!enrollmentNumber || debitedBalance == null) {
    return res.status(400).json({ error: 'Missing enrollmentNumber or debitedBalance' });
  }

  try {
    const student = await Student.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.messBalance < debitedBalance) {
      return res.status(400).json({ error: 'Insufficient mess balance' });
    }

    // Update mess balance
    student.messBalance -= debitedBalance;

    student.transactionHistory.push({
      type: 'debit', // Ensure this is in lowercase
      amount: debitedBalance,
      date: new Date(),
    });

    // Save the updated student
    await student.save();

    res.status(200).json({ success: true, message: 'Mess balance debited successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/student/:enrollmentNumber - Delete a student by enrollment number
router.delete('/delete/:enrollmentNumber', async (req, res) => {
  const { enrollmentNumber } = req.params;

  try {
    const deletedStudent = await Student.findOneAndDelete({ enrollmentNumber });
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile updates the student data
router.put('/student_data', async (req, res) => {
  const { enrollmentNumber, ...updatedData } = req.body;

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    // Find the student by enrollment number and update their details
    const student = await Student.findOneAndUpdate(
      { enrollmentNumber },
      { $set: updatedData },
      { new: true } // Return the updated document
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student details updated successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE /api/update_balance/transaction
router.delete('/transaction', async (req, res) => {
  const { enrollmentNumber, transactionId } = req.body;

  if (!enrollmentNumber || !transactionId) {
    return res.status(400).json({ error: 'Enrollment number and transaction ID are required' });
  }

  try {
    const student = await Student.findOne({ enrollmentNumber });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find the transaction to delete
    const transactionToDelete = student.transactionHistory.find(
      (transaction) => transaction._id.toString() === transactionId
    );

    if (!transactionToDelete) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Adjust the messBalance based on the transaction type
    if (transactionToDelete.type === 'debit' || transactionToDelete.type === 'Debit') {
      student.messBalance += transactionToDelete.amount; // Add the amount for debit
    } else if (transactionToDelete.type === 'credit' || transactionToDelete.type === 'Credit') {
      student.messBalance -= transactionToDelete.amount; // Subtract the amount for credit
    }

    // Remove the transaction from the transactionHistory array
    student.transactionHistory = student.transactionHistory.filter(
      (transaction) => transaction._id.toString() !== transactionId
    );

    // Save the updated student
    await student.save();

    res.status(200).json({
      message: 'Transaction deleted successfully',
      updatedMessBalance: student.messBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//deactivate account
router.put('/close_mess', async (req, res) => {
  const { enrollmentNumber } = req.body;

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    const student = await Student.findOne({ enrollmentNumber });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.messBalance !== 0) {
      return res.status(400).json({ error: 'Mess balance must be cleared before closing mess' });
    }

    student.status = 'left';
    await student.save();

    res.status(200).json({ message: 'Mess closed successfully' });
  } catch (error) {
    console.error('Error closing mess:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;