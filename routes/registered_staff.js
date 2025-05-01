const express = require('express');
const Registeredstaff = require('../models/Registeredstaff'); // Correct model import

const router = express.Router();

// Register Staff Route
router.post('/register', async (req, res) => {
  const { designation, name, username, password } = req.body;

  // Validate the request body
  if (!designation || !name || !username || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the username already exists
    const existingStaff = await Registeredstaff.findOne({ username });
    if (existingStaff) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Create a new staff member
    const newStaff = new Registeredstaff({
      designation,
      name,
      username,
      password,
    });

    await newStaff.save();
    res.status(200).json({ success: true, message: 'Staff registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    console.error('Error registering staff:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/staff_registration/list - Fetch all registered staff
router.get('/list', async (req, res) => {
  try {
    const staffList = await Registeredstaff.find({}, 'designation name username'); // Fetch specific fields
    res.status(200).json(staffList);
  } catch (error) {
    console.error('Error fetching staff list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE /api/staff_registration/delete/:empId - Delete staff by empId
router.delete('/delete/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const deletedStaff = await Registeredstaff.findOneAndDelete({ username });

    if (!deletedStaff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;