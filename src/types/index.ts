export type ServiceType = 'resume' | 'cover-letter' | 'sop';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  data?: string; // base64 encoded file data
  uploadedAt: string;
}

export interface GeneratedDocument {
  id: string;
  conversationId: string;
  title: string;
  type: ServiceType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  serviceType: ServiceType;
  messages: Message[];
  uploadedFiles: UploadedFile[];
  generatedDocuments: GeneratedDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptExample {
  title: string;
  prompt: string;
}
