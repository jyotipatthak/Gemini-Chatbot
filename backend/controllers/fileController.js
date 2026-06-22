const fs = require('fs');
const path = require('path');
const chatStore = require('../memory/chatStore');
const { extractTextFromFile } = require('../services/pdfService');

/**
 * POST /api/file/:chatId/document
 * Extracts text from an uploaded PDF/TXT and stores it in the chat's context.
 */
async function uploadDocument(req, res) {
  const { chatId } = req.params;
  const chat = chatStore.getChat(chatId);

  if (!chat) {
    return res.status(404).json({ error: 'Chat not found. Start a new chat.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No document file uploaded.' });
  }

  try {
    const text = await extractTextFromFile(req.file.path, req.file.mimetype);
    chatStore.setDocument(chatId, req.file.originalname, text);

    // Clean up the file from disk after extracting text — we keep the
    // text in memory, not the raw file (per "store chat state in memory only").
    fs.unlink(req.file.path, () => {});

    res.json({
      fileName: req.file.originalname,
      extractedPreview: text.slice(0, 300),
    });
  } catch (err) {
    console.error('Document extraction error:', err);
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: err.message || 'Failed to process document.' });
  }
}

/**
 * POST /api/file/:chatId/image
 * Stores the uploaded image (as base64) in the chat's context so it can
 * be sent to Gemini alongside future messages.
 */
async function uploadImage(req, res) {
  const { chatId } = req.params;
  const chat = chatStore.getChat(chatId);

  if (!chat) {
    return res.status(404).json({ error: 'Chat not found. Start a new chat.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  try {
    const buffer = fs.readFileSync(req.file.path);
    const base64 = buffer.toString('base64');

    chatStore.setImage(chatId, req.file.originalname, req.file.mimetype, base64);

    // Image stays on disk so the frontend can preview it via /uploads/<filename>.
    res.json({
      fileName: req.file.originalname,
      previewUrl: `/uploads/${path.basename(req.file.path)}`,
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to process image.' });
  }
}

module.exports = { uploadDocument, uploadImage };