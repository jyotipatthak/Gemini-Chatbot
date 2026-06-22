const { v4: uuidv4 } = require('uuid');
const chatStore = require('../memory/chatStore');
const { generateReply } = require('../services/geminiService');

/**
 * POST /api/chat/new
 * Creates a brand new chat session with a fresh chatId.
 * No access to any previous chat's context or uploads.
 */
function createNewChat(req, res) {
  const chatId = uuidv4();
  chatStore.createChat(chatId);
  res.json({ chatId });
}

/**
 * POST /api/chat/:chatId/message
 * Sends a user message (with full current-session context) to Gemini
 * and returns the bot's reply.
 */
async function postMessage(req, res) {
  const { chatId } = req.params;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  const chat = chatStore.getChat(chatId);
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found. Start a new chat.' });
  }

  try {
    const reply = await generateReply(chat, message);

    chatStore.addMessage(chatId, 'user', message);
    chatStore.addMessage(chatId, 'model', reply);

    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to get a response from Gemini.' });
  }
}

module.exports = { createNewChat, postMessage };