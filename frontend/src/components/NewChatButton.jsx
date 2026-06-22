import { useChat } from '../context/ChatContext';

function NewChatButton() {
  const { startNewChat, isLoading } = useChat();

  return (
    <button
      className="new-chat-button"
      onClick={startNewChat}
      disabled={isLoading}
      title="Start a fresh chat (clears all context)"
    >
      + new chat
    </button>
  );
}

export default NewChatButton;