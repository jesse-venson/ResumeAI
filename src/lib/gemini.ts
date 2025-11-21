import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API client
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI generation will not work.');
}

// Initialize with API version v1 (stable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Use gemini-2.5-flash (latest stable model from v1 API)
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
},  { apiVersion: 'v1' });

// Generation configuration optimized for document generation
export const generationConfig = {
  temperature: 0.4, // Lower temperature for stricter instruction following
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192, // Enough for long documents
};
