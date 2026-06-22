/**
 * In-memory chat store.
 * Each chat is keyed by chatId and holds:
 *  - messages: [{ role: 'user' | 'model', text: string }]
 *  - documentText: extracted text from uploaded PDF/TXT (or null)
 *  - documentName: original filename (or null)
 *  - imageData: { mimeType, base64 } for the uploaded image (or null)
 *  - imageName: original filename (or null)
 *
 * Data is lost on server restart — this is intentional per the task spec.
 */
const chats = new Map();

function createChat(chatId) {
  const chat = {
    messages: [],
    documentText: null,
    documentName: null,
    imageData: null,
    imageName: null,
  };
  chats.set(chatId, chat);
  return chat;
}

function getChat(chatId) {
  return chats.get(chatId) || null;
}

function deleteChat(chatId) {
  chats.delete(chatId);
}

function addMessage(chatId, role, text) {
  const chat = getChat(chatId);
  if (!chat) return null;
  chat.messages.push({ role, text });
  return chat;
}

function setDocument(chatId, documentName, documentText) {
  const chat = getChat(chatId);
  if (!chat) return null;
  chat.documentName = documentName;
  chat.documentText = documentText;
  return chat;
}

function setImage(chatId, imageName, mimeType, base64) {
  const chat = getChat(chatId);
  if (!chat) return null;
  chat.imageName = imageName;
  chat.imageData = { mimeType, base64 };
  return chat;
}

module.exports = {
  createChat,
  getChat,
  deleteChat,
  addMessage,
  setDocument,
  setImage,
};