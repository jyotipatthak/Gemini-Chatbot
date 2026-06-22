import { useEffect, useRef } from 'react';
import Message from './Message';
import { useChat } from '../context/ChatContext';

function ChatBox() {
  const { messages, isLoading } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-box">
      {messages.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-glyph">{'>'}</span>
          <p>Type a message below to start the conversation.</p>
        </div>
      )}

      {messages.map((msg) => (
        <Message key={msg.id} sender={msg.sender} text={msg.text} />
      ))}

      {isLoading && (
        <div className="message-row align-left">
          <div className="message-bubble bot">
            <span className="message-sender mono">bot</span>
            <span className="typing-cursor" aria-label="Bot is typing" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;