// import type React from "react";

import { useState, useCallback } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  acceptedFileTypes?: string;
}

export default function FileUpload({ onFileSelect, acceptedFileTypes }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect?.(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors",
        isDragging ? "border-primary bg-gray-100" : "border-gray-400 bg-gray-50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-2 rounded-full bg-gray-100 p-2">
        <Upload className="h-4 w-4 text-gray-500" />
      </div>
      <p className="mb-1 text-xs font-medium">Drag & drop your file here</p>
      <p className="mb-2 text-[10px] text-gray-500">or</p>
      <Button 
        size="sm" 
        variant="default" 
        className="text-xs" 
        onClick={() => document.getElementById('file-input')?.click()}
      >
        Browse Files
      </Button>
      <input 
        id="file-input"
        type="file" 
        className="hidden" 
        onChange={handleFileInput}
        accept={acceptedFileTypes}
      />
      <p className="mt-2 text-[10px] text-gray-500">Supports images, documents, audio, and video</p>
    </div>
  )
}

