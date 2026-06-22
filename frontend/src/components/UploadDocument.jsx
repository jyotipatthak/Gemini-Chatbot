import { useRef } from 'react';
import { useChat } from '../context/ChatContext';

function UploadDocument() {
  const fileInputRef = useRef(null);
  const { handleUploadDocument, isUploading, chatId } = useChat();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadDocument(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
      <button
        className="upload-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={!chatId || isUploading}
        title="Upload PDF or TXT"
      >
        <span className="mono">[doc]</span> Document
      </button>
    </>
  );
}

export default UploadDocument;