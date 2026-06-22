import { useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import MessageInput from '../components/MessageInput';
import UploadDocument from '../components/UploadDocument';
import UploadImage from '../components/UploadImage';
import NewChatButton from '../components/NewChatButton';
import { useChat } from '../context/ChatContext';

function Home() {
  const { chatId, startNewChat, uploadedDocName, uploadedImagePreview, messages } = useChat();

  // Auto-start a chat session on first load
  useEffect(() => {
    if (!chatId) {
      startNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shortId = chatId ? chatId.slice(0, 8) : '————————';

  return (
    <div className="app-shell">
      <aside className="session-rail">
        <div className="rail-brand">
          <span className="rail-brand-mark">◆</span>
          <span className="rail-brand-name">gemini chatbot</span>
        </div>

        <div className="rail-section">
          <span className="rail-label">session</span>
          <span className="rail-value mono">{shortId}</span>
        </div>

        <div className="rail-section">
          <span className="rail-label">messages</span>
          <span className="rail-value mono">{messages.length}</span>
        </div>

        <div className="rail-section">
          <span className="rail-label">document</span>
          <span className={`rail-status ${uploadedDocName ? 'on' : 'off'}`}>
            <span className="rail-dot" />
            {uploadedDocName ? uploadedDocName : 'none'}
          </span>
        </div>

        <div className="rail-section">
          <span className="rail-label">image</span>
          <span className={`rail-status ${uploadedImagePreview ? 'on' : 'off'}`}>
            <span className="rail-dot" />
            {uploadedImagePreview ? 'attached' : 'none'}
          </span>
        </div>

        {uploadedImagePreview && (
          <img src={uploadedImagePreview} alt="Uploaded preview" className="rail-image-preview" />
        )}

        <div className="rail-spacer" />

        <NewChatButton />
      </aside>

      <main className="transcript-column">
        <ChatBox />

        <footer className="composer">
          <div className="composer-uploads">
            <UploadDocument />
            <UploadImage />
          </div>
          <MessageInput />
        </footer>
      </main>
    </div>
  );
}

export default Home;