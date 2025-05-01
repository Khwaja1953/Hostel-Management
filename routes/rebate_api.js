const express = require('express');
const router = express.Router();
const Rebate = require('../models/Rebate');
  
// POST /api/rebate - Submit a rebate request
router.post('/', async (req, res) => {
  const { enrollmentNumber, name, roomNumber, message, status } = req.body;

  if (!enrollmentNumber || !name || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const rebate = new Rebate({ enrollmentNumber, name, roomNumber, message, status });
    await rebate.save();
    res.status(200).json({ message: 'Rebate request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rebate request' });
  }
});

// GET /api/rebate - Fetch rebate requests by enrollment number
router.get('/', async (req, res) => {
  const { enrollmentNumber } = req.query;

  if (!enrollmentNumber) {
    return res.status(400).json({ error: 'Enrollment number is required' });
  }

  try {
    const rebates = await Rebate.find({ enrollmentNumber });
    res.status(200).json(rebates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rebate requests' });
  }
});

// API endpoint to fetch all pending rebates
router.get('/pending', async (req, res) => {
  try {
    const pendingRebates = await Rebate.find({ status: 'Pending' });
    res.status(200).json(pendingRebates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending rebates', details: error.message });
  }
});

// API endpoint to fetch all accepted rebates
router.get('/accepted', async (req, res) => {
  try {
    const acceptedRebates = await Rebate.find({ status: 'Accepted' }).select('roomNumber name message enrollmentNumber');
    res.status(200).json(acceptedRebates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accepted rebates', details: error.message });
  }
});

// API endpoint to fetch all rejected rebates
router.get('/rejected', async (req, res) => {
  try {
    const rejectedRebates = await Rebate.find({ status: 'Rejected' }).select('roomNumber name message enrollmentNumber');
    res.status(200).json(rejectedRebates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rejected rebates', details: error.message });
  }
});

// API endpoint to delete a rebate by ID
router.post('/delete', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await Rebate.findByIdAndDelete(id);
    res.status(200).json({ message: 'Rebate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rebate', details: error.message });
  }
});

// API endpoint to update rebate status by ID
router.post('/update', async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'ID and status are required' });
  }

  try {
    const rebate = await Rebate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!rebate) {
      return res.status(404).json({ error: 'Rebate not found' });
    }

    res.status(200).json({ message: 'Rebate status updated successfully', rebate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rebate status', details: error.message });
  }
});

module.exports = router;