function Message({ sender, text }) {
  const isUser = sender === 'user';
  const isSystem = sender === 'system';

  const bubbleClass = isUser
    ? 'message-bubble user'
    : isSystem
    ? 'message-bubble system'
    : 'message-bubble bot';

  const label = isUser ? 'you' : isSystem ? 'system' : 'bot';

  return (
    <div className={`message-row ${isUser ? 'align-right' : 'align-left'}`}>
      <div className={bubbleClass}>
        <span className="message-sender mono">{label}</span>
        <p className="message-text">{text}</p>
      </div>
    </div>
  );
}

export default Message;