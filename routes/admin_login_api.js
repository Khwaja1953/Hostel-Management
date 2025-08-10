const express = require('express');
const admin = require('../models/admin'); // Import the admin model 

const router = express.Router();

// POST /api/admin/login
router.post('/', async (req, res) => {
  const {hostel, username, password, designation } = req.body;

  if (!hostel || !username || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const hosteladmin = await admin.findOne({hostel});
    if(!hosteladmin){
      return res.status(401).json({success: false, message: 'Invalid hostel'})
    }

    // Find the admin by username and designation
    const useradmin = await admin.findOne({ username});
    if (!useradmin) {
      return res.status(401).json({ success: false, message: 'Invalid username or designation' });
    }

    // Check if the provided password matches
    if (useradmin.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // If credentials are valid, return success
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST: Change Password
router.post('/changepassword', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  // Validate input
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing username, old password, or new password' });
  }

  try {
    // Find the admin user by username
    const adminUser = await admin.findOne({ username });
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid username or old password' });
    }

    // Compare the old password directly
    if (adminUser.password !== oldPassword) {
      return res.status(401).json({ error: 'Invalid username or old password' });
    }

    // Update the password and explicitly set the designation to "admin"
    adminUser.password = newPassword;
    adminUser.designation = "admin"; // Ensure designation is set to "admin"
    await adminUser.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error during password change:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;