'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Square, RotateCw, FileText, CheckCircle2 } from 'lucide-react';
import type { ServiceType, PromptExample } from '@/types';
import { getPromptExamples } from '@/lib/templates';
import { PromptGuidance } from './PromptGuidance';

interface ChatInputProps {
  onSend: (message: string) => void;
  onUploadClick?: () => void;
  onStop?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  serviceType?: ServiceType;
  showExamples?: boolean;
  hasMessages?: boolean;
  hasUploadedFile?: boolean;
  uploadedFileName?: string;
}

export function ChatInput({
  onSend,
  onUploadClick,
  onStop,
  disabled = false,
  isGenerating = false,
  placeholder = 'Describe what you want to generate...',
  serviceType,
  showExamples = true,
  hasMessages = false,
  hasUploadedFile = false,
  uploadedFileName,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [examples, setExamples] = useState<PromptExample[]>([]);

  useEffect(() => {
    if (serviceType && showExamples) {
      setExamples(getPromptExamples(serviceType));
    }
  }, [serviceType, showExamples]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const useExample = (examplePrompt: string) => {
    setInput(examplePrompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t bg-white dark:bg-gray-950">
      {/* Prompt Guidance - shows what information to include */}
      {serviceType && showExamples && !hasMessages && (
        <div className="px-6 py-4 border-b">
          <div className="max-w-4xl mx-auto">
            <PromptGuidance serviceType={serviceType} />
          </div>
        </div>
      )}

      {/* Uploaded File Display */}
      {showExamples && !hasMessages && hasUploadedFile && uploadedFileName && (
        <div className="px-6 py-4 border-b bg-purple-50/30 dark:bg-purple-950/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {uploadedFileName}
                  </p>
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Resume uploaded successfully
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Examples */}
      {showExamples && examples.length > 0 && !hasMessages && !hasUploadedFile && (
        <div className="px-6 py-4 border-b">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-medium text-muted-foreground mb-3">
              Try this example:
            </div>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => useExample(example.prompt)}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="font-medium text-xs text-purple-600 dark:text-purple-400 mb-0.5">
                    {example.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {example.prompt.length > 80
                      ? `${example.prompt.substring(0, 80)}...`
                      : example.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2">
            {onUploadClick && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onUploadClick}
                disabled={disabled}
                className="flex-shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
            )}
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled || isGenerating}
                className="min-h-[80px] max-h-[300px] resize-none pr-12 scrollbar-thin text-base"
                rows={3}
              />
              {isGenerating && onStop ? (
                <Button
                  type="button"
                  size="icon"
                  onClick={onStop}
                  className="absolute right-2 bottom-2 bg-red-600 hover:bg-red-700"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={disabled || !input.trim() || isGenerating}
                  className="absolute right-2 bottom-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  title={hasMessages ? "Regenerate with changes" : "Send message"}
                >
                  {hasMessages ? (
                    <RotateCw className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
