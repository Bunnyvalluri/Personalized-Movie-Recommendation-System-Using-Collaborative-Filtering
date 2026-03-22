const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');

// Load env vars
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Basic endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Node API Backend' });
});

// Prediction wrapper endpoint
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', req.file.buffer, req.file.originalname);

    const aiResponse = await axios.post('http://127.0.0.1:8000/predict', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    res.json(aiResponse.data);

  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).json({ error: 'Failed to process prediction' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
