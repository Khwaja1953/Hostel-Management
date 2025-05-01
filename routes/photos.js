const express = require('express');
const multer = require('multer');
const router = express.Router();
const Photo = require('../models/Photo');

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/photos - Upload a photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the uploaded photo to Base64
    const photoBase64 = req.file.buffer.toString('base64');

    // Save the photo to the database
    const newPhoto = new Photo({
      name: req.file.originalname,
      photoBase64,
    });

    await newPhoto.save();

    res.status(200).json({ message: 'Photo uploaded successfully', photo: newPhoto });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// GET /api/photos - Fetch all photos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// DELETE /api/photos/:id - Delete a photo by ID
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPhoto = await Photo.findByIdAndDelete(id);
  
      if (!deletedPhoto) {
        return res.status(404).json({ error: 'Photo not found' });
      }
  
      res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
      console.error('Error deleting photo:', error);
      res.status(500).json({ error: 'Failed to delete photo' });
    }
  });

module.exports = router;