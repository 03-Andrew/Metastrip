import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
// import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (files: File[]) => void; // Changed to File[]
}

export default function FileUpload({ onFileSelect }: FileUploaderProps) {
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect?.(files);
      }
    },
    [onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFileSelect?.(files);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer",
        isDragging ? "border-primary bg-muted/50" : "border-muted-foreground/25"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <input
        id="fileInput"
        type="file"
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />
      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
      <p className="mb-2 text-sm text-muted-foreground">
        <span className="font-semibold">Click to upload</span> or drag and drop
        multiple files
      </p>
      <p className="text-xs text-muted-foreground">
        {"Any file type accepted"}
      </p>
    </div>
  );
}
