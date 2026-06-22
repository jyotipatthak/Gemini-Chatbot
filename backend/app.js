const express = require('express');
const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically so the frontend can preview them
app.use('/uploads', express.static('uploads'));

app.use('/api/chat', chatRoutes);
app.use('/api/file', fileRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Gemini chatbot backend is running' });
});

// Basic error handler (e.g. multer file-type errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;