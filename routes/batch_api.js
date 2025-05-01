const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import the Student model

// GET /api/batches - Fetch unique batches
router.get('/', async (req, res) => {
  try {
    // Use MongoDB's distinct method to fetch unique batch values
    const batches = await Student.distinct('batch');
    res.status(200).json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/batches/:batch - Fetch students for a specific batch
router.get('/:batch', async (req, res) => {
  const { batch } = req.params;
  try {
    // Fetch only the required fields
    const students = await Student.find({ batch }).select('enrollmentNumber roomNumber name department messBalance');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students for batch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;