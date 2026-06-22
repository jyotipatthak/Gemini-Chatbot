import { useRef } from 'react';
import { useChat } from '../context/ChatContext';

function UploadImage() {
  const fileInputRef = useRef(null);
  const { handleUploadImage, isUploading, chatId } = useChat();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadImage(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
      <button
        className="upload-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={!chatId || isUploading}
        title="Upload PNG or JPG"
      >
        <span className="mono">[img]</span> Image
      </button>
    </>
  );
}

export default UploadImage;