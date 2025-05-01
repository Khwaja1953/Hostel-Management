const express = require('express');
const multer = require('multer');
const fs = require('fs'); // Import the 'fs' module
const path = require('path'); // Import the 'path' module
const Upload = require('../models/Document');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files

// POST route for uploading documents and messages
router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const { message } = req.body;
        const document = req.file;

        if (!document) {
            return res.status(400).json({ error: 'No document uploaded' });
        }

        const newUpload = new Upload({
            document: document.filename,
            originalName: document.originalname,
            message: message,
        });

        await newUpload.save();
        res.status(201).json({ message: 'Upload successful', data: newUpload });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while uploading' });
    }
});


// to get documents
router.get('/fetch', async (req, res) => {
  try {
    const documents = await Upload.find(); // Fetch all documents
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// to delete 
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Upload.findByIdAndDelete(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Fetch a specific document by its filename and send the file content directly
router.get('/view/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  try {
    const fileEntry = await Upload.findOne({ document: filename });
    if (!fileEntry) {
      return res.status(404).json({ error: 'File metadata not found' });
    }

    const originalName = fileEntry.originalName || 'downloaded_file';

    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Server error during file retrieval' });
  }
});

module.exports = router;