const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const Staff = require('../models/Staff'); // Staff model

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage });

// GET /api/staff - Fetch all staff details
router.get('/', async (req, res) => {
  try {
    const staffList = await Staff.find(); // Fetch all staff from the database
    res.status(200).json(staffList);
  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/staff/register - Register a new staff member
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { empid, name, designation, phone, type } = req.body;

    // Validate the type field
    const allowedTypes = ['Worker', 'Non-Worker', 'Student'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Allowed values are Worker, Non-Worker, or Student.' });
    }

    // Check if a staff member with the same empid already exists
    const existingStaff = await Staff.findOne({ empid });
    if (existingStaff) {
      return res.status(409).json({ error: 'Staff member already registered' });
    }

    // Convert the uploaded profile photo to Base64
    let profilePhotoBase64 = null;
    if (req.file) {
      profilePhotoBase64 = req.file.buffer.toString('base64');
    }

    // Create a new staff document
    const newStaff = new Staff({
      empid,
      name,
      designation,
      phone,
      type, // Save the type field
      profilePhotoBase64, // Save the Base64-encoded profile photo
    });

    await newStaff.save();

    res.status(201).json({
      message: 'Staff registered successfully',
      staffId: newStaff._id,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/staff/:id - Delete a staff member by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;