const express = require('express');
const router = express.Router();
const Main = require('../models/Main');

// Fetch details
router.get('/', async (req, res) => {
  try {
    const mainDetails = await Main.findOne();
    if (!mainDetails) {
      return res.status(404).json({ message: 'No details found' });
    }
    res.status(200).json(mainDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching details', error: error.message });
  }
});

// Insert details
router.post('/insert', async (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(400).json({ message: 'Name and About are required' });
  }

  try {
    const mainDetails = new Main({ name, about });
    await mainDetails.save();
    res.status(200).json({ message: 'Details inserted successfully', mainDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting details', error: error.message });
  }
});

// Delete details
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDetail = await Main.findByIdAndDelete(id);
    if (!deletedDetail) {
      return res.status(404).json({ message: 'Detail not found' });
    }
    res.status(200).json({ message: 'Detail deleted successfully', deletedDetail });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting detail', error: error.message });
  }
});

module.exports = router;