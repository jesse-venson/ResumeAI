import type { ServiceType } from './index';

/**
 * Request payload for Gemini API generation
 */
export interface GeminiGenerationRequest {
  prompt: string;
  serviceType: ServiceType;
  uploadedFile?: string; // Base64 encoded file data
}

/**
 * Context for building prompts
 */
export interface PromptContext {
  userPrompt: string;
  resumeContent?: string;
}

/**
 * Gemini API error response
 */
export interface GeminiError {
  message: string;
  code?: string;
  status?: number;
}
