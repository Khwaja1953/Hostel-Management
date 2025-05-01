const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');

// POST /api/grievance - Submit a grievance request
router.post('/', async (req, res) => {
  const { enrollmentNumber, name, roomNumber, message, status } = req.body;

  if (!enrollmentNumber || !name || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const grievance = new Grievance({ enrollmentNumber, name, roomNumber, message, status });
    await grievance.save();
    res.status(200).json({ message: 'Grievance request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit grievance request' });
  }
});

// GET /api/grievance - Fetch grievance requests by enrollment number
router.get('/', async (req, res) => {
  const { enrollmentNumber } = req.query;

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    const grievances = await Grievance.find({ enrollmentNumber });
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grievance requests' });
  }
});

// GET /api/grievance/pending - Fetch all pending grievances
router.get('/pending', async (req, res) => {
  try {
    const pendingGrievances = await Grievance.find({ status: 'Pending' });
    res.status(200).json(pendingGrievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending grievances', details: error.message });
  }
});

// GET /api/grievance/resolved - Fetch all resolved grievances
router.get('/resolved', async (req, res) => {
  try {
    const resolvedGrievances = await Grievance.find({ status: 'Resolved' }).select('roomNumber name message enrollmentNumber');
    res.status(200).json(resolvedGrievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resolved grievances', details: error.message });
  }
});

// GET /api/grievance/rejected - Fetch all rejected grievances
router.get('/rejected', async (req, res) => {
  try {
    const rejectedGrievances = await Grievance.find({ status: 'Rejected' }).select('roomNumber name message enrollmentNumber');
    res.status(200).json(rejectedGrievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rejected grievances', details: error.message });
  }
});

// POST /api/grievance/delete - Delete a grievance by ID
router.post('/delete', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await Grievance.findByIdAndDelete(id);
    res.status(200).json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grievance', details: error.message });
  }
});

// POST /api/grievance/update - Update grievance status by ID
router.post('/update', async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'ID and status are required' });
  }

  try {
    const grievance = await Grievance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    res.status(200).json({ message: 'Grievance status updated successfully', grievance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grievance status', details: error.message });
  }
});

module.exports = router;
