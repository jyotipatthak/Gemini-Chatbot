const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract plain text from an uploaded file.
 * Supports PDF and TXT only, per task constraints.
 */
async function extractTextFromFile(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text.trim();
  }

  if (mimeType === 'text/plain') {
    return fs.readFileSync(filePath, 'utf-8').trim();
  }

  throw new Error('Unsupported document type. Only PDF and TXT are allowed.');
}

module.exports = { extractTextFromFile };