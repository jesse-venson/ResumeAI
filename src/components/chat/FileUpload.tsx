'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadedFile } from '@/types';

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
  uploadedFile?: UploadedFile;
  onRemove?: () => void;
  compact?: boolean;
}

export function FileUpload({ onFileUpload, uploadedFile, onRemove, compact = false }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);

      try {
        // Read file as base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        // Create uploaded file object with base64 data
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          data: base64Data, // Store base64 encoded file data
          uploadedAt: new Date().toISOString(),
        };

        onFileUpload(uploadedFile);
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Failed to read file. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  if (uploadedFile && compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <FileText className="w-4 h-4 text-purple-600" />
        <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
        <Check className="w-4 h-4 text-green-600" />
        {onRemove && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  if (uploadedFile) {
    return (
      <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium truncate">{uploadedFile.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
              {onRemove && (
                <Button variant="ghost" size="icon" onClick={onRemove}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Upload complete</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'p-8 border-2 border-dashed cursor-pointer transition-all duration-300',
        isDragActive
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600',
        uploading && 'opacity-50 pointer-events-none'
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <div className="text-lg font-medium mb-2">
            {uploading ? 'Uploading...' : isDragActive ? 'Drop your file here' : 'Upload your resume'}
          </div>
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports PDF and DOCX (max 5MB)
          </p>
        </div>
      </div>
    </Card>
  );
}
