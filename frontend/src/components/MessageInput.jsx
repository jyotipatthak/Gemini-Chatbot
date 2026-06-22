import { useState } from 'react';
import { useChat } from '../context/ChatContext';

function MessageInput() {
  const [text, setText] = useState('');
  const { handleSendMessage, isLoading, chatId } = useChat();

  const submit = () => {
    if (!text.trim() || isLoading || !chatId) return;
    handleSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="message-input-row">
      <input
        type="text"
        className="message-input"
        placeholder={chatId ? 'Type a message...' : 'Click "New Chat" to start'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!chatId || isLoading}
      />
      <button
        className="send-button"
        onClick={submit}
        disabled={!chatId || isLoading || !text.trim()}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;