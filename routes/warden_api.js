const express = require('express');
const warden = require('../models/Registeredstaff'); // Import the warden model

const router = express.Router();

// Warden Login Route
router.post('/', async (req, res) => {
  const { username, password, designation } = req.body;

  try {
    // Check if the warden exists with the given username
    const user = await warden.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Warden not found' });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    if (user.designation.toLowerCase() !== designation.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Role mismatch' });
    }


    // If login is successful
    res.json({ success: true, message: 'Login successful', user: { username: user.username } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

module.exports = router;