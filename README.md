# Gemini Chatbot

A minimal full-stack chatbot built on Google's Gemini API. Supports plain text conversation, PDF/TXT document upload, PNG/JPG image upload, and basic in-memory chat context — all reset with a single "New Chat" action.

This was built to demonstrate API integration, file handling, and simple state management — not advanced AI/ML techniques (RAG, embeddings, chunking are intentionally out of scope).

## Tech stack

- **Backend:** Node.js + Express, in-memory chat store, `pdf-parse` for document text extraction, `multer` for file uploads
- **Frontend:** React + Vite
- **AI:** Google Gemini API (`gemini-2.5-flash`)

## Project structure

```
gemini-chatbot/
├── backend/
│   ├── controllers/      # chatController.js, fileController.js
│   ├── routes/            # chatRoutes.js, fileRoutes.js
│   ├── services/          # geminiService.js, pdfService.js
│   ├── memory/             # chatStore.js (in-memory session store)
│   ├── uploads/            # temp storage for uploaded images
│   ├── app.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/    # ChatBox, Message, MessageInput, UploadDocument, UploadImage, NewChatButton
│   │   ├── pages/          # Home.jsx
│   │   ├── context/        # ChatContext.jsx
│   │   ├── services/       # api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 1. Clone and install

```bash
git clone <https://github.com/jyotipatthak/Gemini-Chatbot>
cd gemini-chatbot
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies (in a separate terminal):

```bash
cd frontend
npm install
```

## 2. Set your Gemini API key

In `backend/.env`, replace the placeholder with your real key:

```
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get a key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — it's free for personal/development use.

> `.env` is already in `.gitignore` — never commit your real key.

## 3. Run the app

**Terminal 1 — backend:**

```bash
cd backend
npm start
```

You should see:
```
backend running on http://localhost:5000
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm run dev
```

Vite will print a local URL, typically:
```
http://localhost:5173
```

Open that URL in your browser. The frontend dev server proxies `/api/*` requests to the backend on port 5000 automatically (configured in `vite.config.js`), so no CORS setup is needed in development.

## 4. Example usage

### Document Q&A
1. Click **New Chat** (starts automatically on first load).
2. Click **Document** and upload a `.pdf` or `.txt` file.
3. Type: `Summarize the document.` → the bot answers using the extracted text.
4. Ask a follow-up like `What was the third point mentioned?` → the bot uses both the document and the prior conversation turn to answer.

### Image Q&A
1. Click **Image** and upload a `.png` or `.jpg`.
2. Type: `What's in the image?` → the bot describes it.
3. Ask a follow-up like `Is the person smiling?` → the same uploaded image is reused automatically.

### Context reset
1. Ask `What did I upload earlier?` after uploading a file — the bot will reference it.
2. Click **New Chat**.
3. Ask `What did I upload earlier?` again — the bot replies that nothing has been uploaded yet, since the new chat has a fresh `chatId` with no access to the previous session's files or messages.

## How context works

- Each chat session is identified by a `chatId` generated when you click **New Chat**.
- The backend stores everything in memory only (`backend/memory/chatStore.js`) — message history, extracted document text, and the uploaded image's base64 data — keyed by `chatId`.
- Every message sent to Gemini includes the full prior conversation as proper multi-turn history, plus the document text and/or image attached to that turn, so follow-up questions ("the third point", "is the person smiling") work correctly.
- Nothing persists across server restarts. This is intentional — there's no database by design.

## API reference (backend)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/chat/new` | Create a new chat session, returns `{ chatId }` |
| `POST` | `/api/chat/:chatId/message` | Send a text message, returns `{ reply }` |
| `POST` | `/api/file/:chatId/document` | Upload a PDF/TXT (multipart field: `document`) |
| `POST` | `/api/file/:chatId/image` | Upload a PNG/JPG (multipart field: `image`) |

## Notes & constraints

- Max upload size: 10MB per file.
- Only PDF/TXT accepted for documents; only PNG/JPG accepted for images — other types are rejected with a 400 error.
- No authentication, sessions, or database — matches the assignment's scope exactly.
- If you see a `404` error calling the Gemini API, the model name may have been deprecated since this was written — check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) and update `MODEL_NAME` in `backend/services/geminiService.js`.

## Troubleshooting

**`SyntaxError: ... does not provide an export named 'default'` or `require is not defined in ES module scope`**
Make sure `backend/package.json` has `"type": "commonjs"` (or no `"type"` field at all). All backend files use `require`/`module.exports`, not `import`/`export`.

**Uploads fail with a file-not-found / ENOENT error**
Make sure the `backend/uploads/` folder exists. If you cloned fresh and it's missing (empty folders aren't tracked by git), create it manually: `mkdir backend/uploads`.

**Gemini requests return 403/401**
Double-check `GEMINI_API_KEY` in `backend/.env` is your real key, not the placeholder, and that the backend was restarted after editing `.env`.
