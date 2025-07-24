const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer to store files in memory (no disk needed)
const upload = multer({ storage: multer.memoryStorage() });

// HTML test form (optional)
router.get('/fileanalyse', (req, res) => {
  res.send(`
    <form action="/api/fileanalyse" method="post" enctype="multipart/form-data">
      <input type="file" name="upfile" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// File upload endpoint
router.post('/fileanalyse', upload.single('upfile'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  });
});

module.exports = router;
