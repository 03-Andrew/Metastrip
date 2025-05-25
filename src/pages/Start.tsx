import React, { useState } from 'react';
// import FileUpload from '@/components/FileUpload';
import FileUpload from '@/components/file-uploader';
import MetadataDisplay from '@/components/metadata-display';
// import type { FileMetadata } from '@/utils/fileMetadata';  Download, Trash2,
import { ArrowLeft, Loader2, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/hooks/usefileUpload';
import { useCleanFile } from '@/hooks/useCleanFile';
import { toast } from 'sonner';
import { config } from '@/config/env';

interface UploadResponse {
  filename: string;
  fileid: string;
  filetype: string;
  metadata: Record<string, string>;
  filtered: Record<string, string>;
}

interface CleanFileResponse {
  message: string;
  original_file: string;
  cleaned_file: string;
  metadata: Record<string, string>;
  filtered_metadata: Record<string, string>;
  download_url: string;
}

type TabType = 'full' | 'filtered';

const Start: React.FC = () => {
  const [fileId, setFileId] = useState<string>("");
  const [fullMetadata, setFullMetadata] = useState<Record<string, string>>({});
  const [filteredMetadata, setFilteredMetadata] = useState<Record<string, string>>({});
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>('full');
  const { mutate: uploadFile, isPending: isUploading } = useFileUpload();
  const { mutate: cleanFile, isPending: isCleaning } = useCleanFile();

  console.log(fileId);

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setOriginalFile(file);
      uploadFile(file, {
        onSuccess: (data: UploadResponse) => {
          console.log('Upload Response:', data);
          setFileId(data.fileid);
          setFullMetadata(data.metadata);
          setFilteredMetadata(data.filtered);
          setIsProcessed(true);
          setIsCleaned(false);
          toast.success("File processed successfully!");
        },
        onError: (error) => {
          console.error('Upload Error:', error);
          toast.error("Failed to process file. Please try again.");
          handleBack();
        }
      });
    }
  };

  const handleCleanFile = () => {
    if (!fileId) return;

    cleanFile(fileId, {
      onSuccess: (data: CleanFileResponse) => {
        console.log('Clean Response:', data);
        setDownloadUrl(data.download_url);
        setFullMetadata(data.metadata);
        setFilteredMetadata(data.filtered_metadata);
        setIsCleaned(true);
        toast.success("Metadata cleaned successfully!");
      },
      onError: (error) => {
        console.error('Clean Error:', error);
        toast.error("Failed to clean metadata. Please try again.");
      }
    });
  };

  const handleBack = () => {
    setFileId("");
    setFullMetadata({});
    setFilteredMetadata({});
    setOriginalFile(null);
    setIsProcessed(false);
    setIsCleaned(false);
    setDownloadUrl("");
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = config.apiUrl + downloadUrl.slice(1);
    }
  };

  const isPending = isUploading || isCleaning;

  return (
    <div className="flex flex-col items-center justify-start w-[400px] min-h-[500px] bg-white shadow-lg p-6 relative overflow-hidden">
      {/* Cleaning Overlay */}
      {isCleaning && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-sm text-gray-600">Cleaning metadata...</p>
        </div>
      )}

      {/* Background gradient decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 -z-10" />
      
      {/* Header */}
      <div className="w-full mb-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Metastrip
        </h1>
        <p className="text-center text-gray-500 text-sm mt-2">
          {isUploading 
            ? "Processing your file..."
            : !originalFile 
              ? "Upload a file to view its metadata"
              : isCleaned
                ? "Your cleaned file is ready"
                : "View your file's metadata"
          }
        </p>
      </div>

      {/* Content Container */}
      <div className="w-full flex-1 relative">
        {/* Upload View */}
        {!originalFile && !isUploading && (
          <div className="w-full">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Upload Loading View */}
        {isUploading && (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-sm text-gray-600">Processing your file...</p>
          </div>
        )}

        {/* Metadata View */}
        {isProcessed && originalFile && !isCleaned && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs flex items-center gap-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100/80"
                onClick={handleBack}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Upload Another
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs flex items-center gap-1.5"
                onClick={handleCleanFile}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clean Metadata
              </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <div className="flex gap-4">
                <button
                  className={cn(
                    "pb-2 text-sm font-medium transition-colors relative",
                    activeTab === 'full'
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab('full')}
                >
                  Full Metadata
                  <span className="ml-2 text-xs text-gray-400">
                    ({Object.keys(fullMetadata).length})
                  </span>
                </button>
                <button
                  className={cn(
                    "pb-2 text-sm font-medium transition-colors relative",
                    activeTab === 'filtered'
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab('filtered')}
                >
                  Filtered Metadata
                  <span className="ml-2 text-xs text-gray-400">
                    ({Object.keys(filteredMetadata).length})
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
              <MetadataDisplay
                metadata={activeTab === 'full' ? fullMetadata : filteredMetadata}
                isSelectionMode={false}
                selectedKeys={[]}
                onToggleSelection={() => {}}
              />
            </div>
          </div>
        )}

        {/* Download View */}
        {isCleaned && downloadUrl && (
          <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="text-center mb-6">
              <p className="text-green-600 font-medium mb-2">Metadata Cleaned Successfully!</p>
              {/* <p className="text-sm text-gray-500">
                Removed metadata fields
              </p> */}
            </div>
            <div className="flex gap-4">
              <Button
                variant="default"
                size="default"
                className="flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download Cleaned File
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={handleBack}
              >
                Upload Another
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 w-full text-center">
        <p className="text-xs text-gray-400">
          Secure metadata management
        </p>
      </div>
    </div>
  );
};

export default Start;