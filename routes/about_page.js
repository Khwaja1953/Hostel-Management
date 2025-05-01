const express = require('express');
const multer = require('multer');
const About = require('../models/AboutPage');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/about/upload - Upload an image and message, and save it to MongoDB
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file || !req.body.message) {
    return res.status(400).json({ error: 'No file or message uploaded' });
  }

  try {
    const newAbout = new About({
      image: req.file.buffer,
      imageType: req.file.mimetype,
      message: req.body.message,
      uploadedAt: new Date(),
    });
    await newAbout.save();

    res.status(200).json({ message: 'Image and message uploaded successfully', about: newAbout });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image and message', details: error.message });
  }
});

// GET /api/about - Fetch all uploaded about entries
router.get('/', async (req, res) => {
  try {
    const aboutEntries = await About.find().sort({ uploadedAt: -1 });

    const formattedEntries = aboutEntries.map(entry => ({
      id: entry._id,
      imageUrl: entry.image && entry.imageType
        ? `data:${entry.imageType};base64,${entry.image.toString('base64')}`
        : null, // Handle missing image gracefully
      message: entry.message || 'No message provided', // Default message if missing
      uploadedAt: entry.uploadedAt,
    }));

    res.status(200).json(formattedEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch about entries', details: error.message });
  }
});

// DELETE /api/about/delete - Delete an entry by ID
router.post('/delete', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const entry = await About.findByIdAndDelete(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry', details: error.message });
  }
});

module.exports = router;