'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Copy,
  Maximize2,
  Minimize2,
  Check,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { downloadAsPDF, downloadAsDOCX, generateFilename } from '@/lib/download';
import { useDocumentStore, useConversationStore } from '@/lib/store';
import type { ServiceType } from '@/types';

interface LivePreviewProps {
  content: string;
  serviceType: ServiceType;
  isGenerating?: boolean;
  onClose?: () => void;
}

export function LivePreview({
  content,
  serviceType,
  isGenerating = false,
  onClose,
}: LivePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addDocument } = useDocumentStore();
  const { currentConversationId } = useConversationStore();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const defaultFilename = generateFilename(serviceType);
    const customFilename = prompt('Enter a name for your document:', defaultFilename);
    if (customFilename && currentConversationId) {
      await downloadAsPDF(content, customFilename, serviceType);

      // Save document to Docs section with custom filename
      await addDocument({
        conversationId: currentConversationId,
        title: customFilename,
        type: serviceType,
        content: content,
      });
    }
  };

  const handleDownloadDOCX = async () => {
    const defaultFilename = generateFilename(serviceType);
    const customFilename = prompt('Enter a name for your document:', defaultFilename);
    if (customFilename && currentConversationId) {
      await downloadAsDOCX(content, customFilename, serviceType);

      // Save document to Docs section with custom filename
      await addDocument({
        conversationId: currentConversationId,
        title: customFilename,
        type: serviceType,
        content: content,
      });
    }
  };

  return (
    <div
      className={cn(
        'h-full flex flex-col bg-white dark:bg-gray-950 border-l transition-all duration-300',
        isExpanded ? 'w-full' : 'w-1/2'
      )}
    >
      {/* Header */}
      <div className="border-b px-6 py-4 bg-white dark:bg-gray-950 flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">Preview</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground capitalize">
                {serviceType.replace('-', ' ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!content || isGenerating}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!content || isGenerating}
              >
                <Download className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadPDF}>
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadDOCX}>
                Download as DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          {onClose && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-8">
          {!content && !isGenerating ? (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div className="max-w-md space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">No preview yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Your generated document will appear here in real-time as the AI creates it
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-white dark:bg-gray-900 shadow-lg min-h-[800px]">
              {/* Document Preview */}
              <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                <div
                  className={cn(
                    'whitespace-pre-wrap text-sm leading-relaxed',
                    isGenerating && 'animate-pulse'
                  )}
                  style={{ wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{
                    __html: content.replace(/\n/g, '<br />'),
                  }}
                />
                {isGenerating && (
                  <span className="inline-block w-2 h-4 bg-purple-600 ml-1 animate-pulse" />
                )}
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Status Bar */}
      {content && (
        <div className="px-6 py-3 border-t bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-600" />
                  Ready
                </span>
              )}
            </div>
            <div>{content.length} characters</div>
          </div>
        </div>
      )}
    </div>
  );
}
