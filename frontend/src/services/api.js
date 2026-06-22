const API_BASE = import.meta.env.VITE_API_URL;


export async function createNewChat() {
  const res = await fetch(`${API_BASE}/chat/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to create new chat');
  }

  return res.json();
}


export async function sendMessage(chatId, message) {
  const res = await fetch(`${API_BASE}/chat/${chatId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send message');
  }

  return res.json();
}


export async function uploadDocument(chatId, file) {
  const formData = new FormData();
  formData.append('document', file);

  const res = await fetch(`${API_BASE}/file/${chatId}/document`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload document');
  }

  return res.json();
}


export async function uploadImage(chatId, file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/file/${chatId}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image');
  }

  return res.json();
}