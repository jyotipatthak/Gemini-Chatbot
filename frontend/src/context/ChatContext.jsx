import { createContext, useContext, useState, useCallback } from 'react';
import { createNewChat, sendMessage, uploadDocument, uploadImage } from '../services/api';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedDocName, setUploadedDocName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Start a brand new chat (clears everything client + server side)
  const startNewChat = useCallback(async () => {
    setIsLoading(true);
    try {
      const { chatId: newChatId } = await createNewChat();
      setChatId(newChatId);
      setMessages([]);
      setUploadedImagePreview(null);
      setUploadedDocName(null);
    } catch (err) {
      console.error(err);
      addMessage('bot', 'Failed to start a new chat. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMessage = useCallback((sender, text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text },
    ]);
  }, []);

  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim() || !chatId) return;

      addMessage('user', text);
      setIsLoading(true);

      try {
        const { reply } = await sendMessage(chatId, text);
        addMessage('bot', reply);
      } catch (err) {
        console.error(err);
        addMessage('bot', 'Something went wrong getting a response.');
      } finally {
        setIsLoading(false);
      }
    },
    [chatId, addMessage]
  );

  const handleUploadDocument = useCallback(
    async (file) => {
      if (!file || !chatId) return;
      setIsUploading(true);

      try {
        const { fileName } = await uploadDocument(chatId, file);
        setUploadedDocName(fileName);
        addMessage('system', `Document uploaded: ${fileName}`);
      } catch (err) {
        console.error(err);
        addMessage('bot', 'Failed to upload document.');
      } finally {
        setIsUploading(false);
      }
    },
    [chatId, addMessage]
  );

  const handleUploadImage = useCallback(
    async (file) => {
      if (!file || !chatId) return;
      setIsUploading(true);

      try {
        const { fileName, previewUrl } = await uploadImage(chatId, file);
        setUploadedImagePreview(previewUrl);
        addMessage('system', `Image uploaded: ${fileName}`);
      } catch (err) {
        console.error(err);
        addMessage('bot', 'Failed to upload image.');
      } finally {
        setIsUploading(false);
      }
    },
    [chatId, addMessage]
  );

  const value = {
    chatId,
    messages,
    uploadedImagePreview,
    uploadedDocName,
    isLoading,
    isUploading,
    startNewChat,
    handleSendMessage,
    handleUploadDocument,
    handleUploadImage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return ctx;
}