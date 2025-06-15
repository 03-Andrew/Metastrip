import { useState, useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (files: File[]) => void;
  handleFilesUpload?: (files: File[]) => void;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFiles: File[];
}

export default function FileUpload({
  onFileSelect,
  handleFilesUpload,
  setSelectedFiles,
  selectedFiles,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (files: File[]) => {
    setSelectedFiles((prev: File[]) => {
      const existingNames = new Set(prev.map((file) => file.name));
      const newFiles = files.filter((f) => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) addFiles(files);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) addFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset
    },
    []
  );

  const handleRemoveFile = (name: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFileSelect?.(selectedFiles);
      handleFilesUpload?.(selectedFiles);
      // setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [selectedFiles, onFileSelect, handleFilesUpload]);

  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full transition-all border-2 border-dashed rounded-lg cursor-pointer",
          isDragging
            ? "border-primary bg-muted/50"
            : "border-muted-foreground/25",
          selectedFiles.length > 0 ? "h-28" : "h-82"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center px-4">
          <span className="font-semibold">Click to upload</span> or drag and
          drop files
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 overflow-y-auto h-[200px] p-2 border rounded-lg bg-gray-50/50">
          <ul className="space-y-2">
            {selectedFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between px-3 py-2 border rounded text-sm bg-muted"
              >
                <span className="truncate max-w-[80%]">{file.name}</span>
                <button
                  className="text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.name);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <Button
          className="mt-4 self-end px-4 py-2 text-sm font-medium w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
        >
          Upload {selectedFiles.length} file(s)
        </Button>
      )}
    </div>
  );
}
