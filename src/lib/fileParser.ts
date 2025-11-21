import mammoth from 'mammoth';

/**
 * Parse uploaded file and extract text content
 * Supports PDF and DOCX files
 */
export async function parseFile(fileData: string): Promise<string> {
  try {
    // fileData is base64 encoded string from frontend
    const base64Data = fileData.split(',')[1] || fileData;
    const buffer = Buffer.from(base64Data, 'base64');

    // Detect file type from base64 header or try both parsers
    try {
      // Try PDF first
      return await parsePDF(buffer);
    } catch (pdfError) {
      // If PDF fails, try DOCX
      try {
        return await parseDOCX(buffer);
      } catch (docxError) {
        throw new Error('Unable to parse file. Please ensure it\'s a valid PDF or DOCX file.');
      }
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse uploaded file');
  }
}

/**
 * Parse PDF file and extract text
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  // Use dynamic require for pdf-parse to avoid ES module issues
  const pdf = require('pdf-parse');
  const data = await pdf(buffer);
  if (!data.text || data.text.trim().length === 0) {
    throw new Error('PDF appears to be empty or contains no extractable text');
  }
  return data.text;
}

/**
 * Parse DOCX file and extract text
 */
async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  if (!result.value || result.value.trim().length === 0) {
    throw new Error('DOCX appears to be empty or contains no extractable text');
  }
  return result.value;
}
