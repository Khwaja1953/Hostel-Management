const express = require('express');
const multer = require('multer');
const MessMenu = require('../models/MessMenu');
const router = express.Router();

// Configure multer for file uploads (in memory)
const storage = multer.memoryStorage(); // Store files in memory as a buffer
const upload = multer({ storage });

// POST /api/messmenu/upload - Upload an image and save it to MongoDB
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Save the image as a buffer in MongoDB
    const newMenu = new MessMenu({
      image: req.file.buffer, // Save the image buffer
      imageType: req.file.mimetype, // Save the image type (e.g., 'image/jpeg')
      uploadedAt: new Date(),
    });
    await newMenu.save();

    res.status(200).json({ message: 'Image uploaded successfully', menu: newMenu });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
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

// DELETE /api/messmenu/delete - Delete an image by ID
router.post('/delete', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const menu = await MessMenu.findByIdAndDelete(id);
    if (!menu) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

module.exports = router;