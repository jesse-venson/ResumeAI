'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message, ServiceType } from '@/types';
import { useAuthStore } from '@/lib/store';
import { downloadAsPDF, downloadAsDOCX, generateFilename } from '@/lib/download';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onCopy?: () => void;
  onDownload?: () => void;
  onRegenerate?: () => void;
  serviceType?: ServiceType;
}

export function ChatMessage({
  message,
  isStreaming = false,
  onCopy,
  onDownload,
  onRegenerate,
  serviceType,
}: ChatMessageProps) {
  const user = useAuthStore((state) => state.user);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleDownloadPDF = async () => {
    if (serviceType && message.content) {
      const filename = generateFilename(serviceType);
      await downloadAsPDF(message.content, filename, serviceType);
    }
  };

  const handleDownloadDOCX = async () => {
    if (serviceType && message.content) {
      const filename = generateFilename(serviceType);
      await downloadAsDOCX(message.content, filename, serviceType);
    }
  };

  return (
    <div
      className={cn(
        'group py-6 px-4',
        isUser ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-900/50'
      )}
    >
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Avatar */}
        <Avatar className={cn(
          'w-8 h-8 flex-shrink-0',
          isAssistant && 'bg-gradient-to-br from-purple-600 to-pink-500'
        )}>
          <div className="w-full h-full flex items-center justify-center text-white font-medium text-sm">
            {isUser ? user?.name?.[0]?.toUpperCase() || 'U' : 'AI'}
          </div>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-1 text-sm">
            {isUser ? user?.name || 'You' : 'ResumeAI'}
          </div>
          <div className="prose dark:prose-invert max-w-none prose-sm">
            <div className={cn(
              'whitespace-pre-wrap text-sm leading-relaxed',
              isStreaming && 'typing-animation'
            )}>
              {message.content}
              {isStreaming && <span className="inline-block w-1 h-4 bg-purple-600 ml-1 animate-pulse" />}
            </div>
          </div>

          {/* Actions */}
          {isAssistant && !isStreaming && (
            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {onCopy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopy}
                  className="h-8"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy
                </Button>
              )}
              {serviceType && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleDownloadPDF}>
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadDOCX}>
                      Download as DOCX
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-8"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Regenerate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
