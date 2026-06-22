const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// gemini-1.5-flash has been shut down (404). Using the current stable,
// cost-efficient model as of mid-2026. Check https://ai.google.dev/gemini-api/docs/models
// if you hit a 404 in the future — Google deprecates models on a rolling basis.
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Convert this chat's stored message history into Gemini's expected
 * multi-turn `history` format: [{ role: 'user' | 'model', parts: [{text}] }]
 */
function buildHistory(chat) {
  return chat.messages.map((m) => ({
    role: m.role, // already stored as 'user' | 'model'
    parts: [{ text: m.text }],
  }));
}

/**
 * Build the parts for the NEW user turn only — document text (so it's always
 * available as grounding) + the uploaded image (if any) + the user's message.
 * Document/image are attached here rather than buried in flattened history,
 * since Gemini needs them as actual content parts to read images at all.
 */
function buildNewTurnParts(chat, userMessage) {
  const parts = [];
  let prefix = '';

  if (chat.documentText) {
    // Simple inline grounding, no chunking/embeddings per task constraints.
    prefix += `[Context: the user previously uploaded a document named "${chat.documentName}". Document content:\n--- DOCUMENT START ---\n${chat.documentText}\n--- DOCUMENT END ---]\n\n`;
  } else if (chat.messages.length === 0) {
    // First message of a fresh chat with nothing uploaded yet — be explicit
    // so the model doesn't guess or hallucinate a prior upload.
    prefix += `[Context: this is a brand new chat session. No document or image has been uploaded yet.]\n\n`;
  }

  parts.push({ text: prefix + userMessage });

  if (chat.imageData) {
    parts.push({
      inlineData: {
        mimeType: chat.imageData.mimeType,
        data: chat.imageData.base64,
      },
    });
  }

  return parts;
}

/**
 * Send a message (plus any context) to Gemini and return the text reply.
 * Uses startChat() with real prior turns as history, rather than flattening
 * everything into one text blob — this keeps the model's understanding of
 * "who said what when" intact across the conversation.
 */
async function generateReply(chat, userMessage) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set on the server.');
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const history = buildHistory(chat);
  const chatSession = model.startChat({ history });

  const newTurnParts = buildNewTurnParts(chat, userMessage);
  const result = await chatSession.sendMessage(newTurnParts);
  const response = result.response;
  return response.text();
}

module.exports = { generateReply };