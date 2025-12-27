'use client';

import { useState, useEffect, useRef } from 'react';
import { ServiceCards } from '@/components/chat/ServiceCards';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { FileUpload } from '@/components/chat/FileUpload';
import { LivePreview } from '@/components/chat/LivePreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useConversationStore } from '@/lib/store';
import type { ServiceType, Message, UploadedFile } from '@/types';

// Helper function to generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function DashboardPage() {
  const {
    conversations,
    currentConversationId,
    addConversation,
    updateConversation,
    getCurrentConversation,
  } = useConversationStore();

  const currentConversation = getCurrentConversation();

  const [step, setStep] = useState<'service' | 'chat'>('service');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [needsUpload, setNeedsUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load current conversation
  useEffect(() => {
    if (currentConversation) {
      setSelectedService(currentConversation.serviceType);
      setMessages(currentConversation.messages);
      setStep('chat');

      // Handle uploaded files
      if (currentConversation.uploadedFiles.length > 0) {
        setUploadedFile(currentConversation.uploadedFiles[0]);
      } else {
        setUploadedFile(null);
      }

      // Set generated content from last assistant message
      const lastAssistantMessage = [...currentConversation.messages]
        .reverse()
        .find((m) => m.role === 'assistant');

      if (lastAssistantMessage && lastAssistantMessage.content) {
        setGeneratedContent(lastAssistantMessage.content);
        setShowPreview(true); // Show preview when there's content
      } else {
        setGeneratedContent('');
        // Don't force preview to close if there's no content yet
      }
    } else {
      // Reset to service selection
      setStep('service');
      setSelectedService(null);
      setMessages([]);
      setGeneratedContent('');
      setUploadedFile(null);
    }
  }, [currentConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleServiceSelect = async (service: ServiceType) => {
    setSelectedService(service);

    // Create conversation immediately without template selection
    const conversationId = await addConversation(service);
    setStep('chat');

    // Check if resume service requires upload
    if (service === 'resume') {
      setNeedsUpload(true);
      setShowUploadDialog(true);
    }
  };

  const handleFileUpload = async (file: UploadedFile) => {
    setUploadedFile(file);
    setShowUploadDialog(false);
    setNeedsUpload(false);

    // Update conversation with uploaded file
    if (currentConversationId) {
      const conv = getCurrentConversation();
      if (conv) {
        await updateConversation(currentConversationId, {
          uploadedFiles: [file],
        });
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedService) return;

    // Resume upload is optional - user can provide details OR upload
    // No need to block message sending

    const userMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Update conversation
    if (currentConversationId) {
      await updateConversation(currentConversationId, {
        messages: newMessages,
        title: generateConversationTitle(content, selectedService),
      });
    }

    // Generate response
    await generateResponse(content);
  };

  const generateResponse = async (_prompt: string) => {
    if (!selectedService) return;

    setIsGenerating(true);
    setGeneratedContent('');

    const assistantMessage: Message = {
      id: generateUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: _prompt,
          serviceType: selectedService,
          uploadedFile: uploadedFile?.data, // Send base64 data instead of filename
          messages: messages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setGeneratedContent(fullContent);
      }

      assistantMessage.content = fullContent;
      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation (documents are only saved when user downloads)
      if (currentConversationId) {
        // Get current conversation to get latest messages
        const conv = getCurrentConversation();
        if (conv) {
          await updateConversation(currentConversationId, {
            messages: [...conv.messages, assistantMessage],
          });
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Generation error:', error);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const generateConversationTitle = (prompt: string, service: ServiceType): string => {
    const words = prompt.split(' ').slice(0, 6).join(' ');
    return `${service === 'cover-letter' ? 'Cover Letter' : service === 'sop' ? 'SOP' : 'Resume'} - ${words}${
      words.length < prompt.length ? '...' : ''
    }`;
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      generateResponse(lastUserMessage.content);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  // Show service selection if no conversation
  if (step === 'service') {
    return (
      <div className="h-full flex items-center justify-center bg-[#0c0c12]">
        <ServiceCards onSelectService={handleServiceSelect} />
      </div>
    );
  }

  // Show chat interface with live preview
  return (
    <div className="h-screen flex overflow-hidden bg-[#0c0c12]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-6 py-5 bg-[#0c0c12] flex-shrink-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400/90 font-bold text-xs">ResumeAI</span>
              </div>
              <div>
                <p className="text-xs text-white/40 capitalize">
                  {selectedService?.replace('-', ' ')}
                </p>
              </div>
            </div>
            {selectedService === 'resume' && uploadedFile && (
              <div className="text-xs text-white/40 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Resume uploaded
              </div>
            )}
          </div>
        </div>

        {/* Messages Area - using overflow-auto instead of ScrollArea */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="min-h-full">
            {messages.length === 0 ? (
              <div className="h-full"></div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isGenerating && message.role === 'assistant' && message === messages[messages.length - 1]}
                  onCopy={message.role === 'assistant' ? () => handleCopy(message.content) : undefined}
                  onRegenerate={
                    message.role === 'assistant' && message === messages[messages.length - 1] && !isGenerating
                      ? handleRegenerate
                      : undefined
                  }
                  serviceType={selectedService || undefined}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          onSend={handleSendMessage}
          onUploadClick={selectedService === 'resume' ? () => setShowUploadDialog(true) : undefined}
          onStop={handleStopGeneration}
          disabled={false}
          isGenerating={isGenerating}
          serviceType={selectedService || undefined}
          showExamples={messages.length === 0}
          hasMessages={messages.length > 0}
          hasUploadedFile={!!uploadedFile}
          uploadedFileName={uploadedFile?.name}
        />
      </div>

      {/* Live Preview */}
      {selectedService && showPreview && (
        <LivePreview
          content={generatedContent}
          serviceType={selectedService}
          isGenerating={isGenerating}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Show Preview Button - appears when preview is hidden */}
      {selectedService && !showPreview && (
        <Button
          onClick={() => setShowPreview(true)}
          size="icon"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 rounded-full"
        >
          <Eye className="w-5 h-5 text-blue-400" />
        </Button>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload Your Resume</DialogTitle>
          </DialogHeader>
          <FileUpload
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile || undefined}
            onRemove={() => setUploadedFile(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
