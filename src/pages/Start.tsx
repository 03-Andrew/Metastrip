import React, { useState, useEffect } from "react";
// import FileUpload from '@/components/FileUpload';
import FileUpload from "@/components/file-uploader";
import MetadataView from "@/components/metadata-view";
import LoaderOverlay from "@/components/loader-overlay";
import DownloadView from "@/components/download-view";

import { useBatchFileUpload } from "@/hooks/usefileUpload";
import { useCleanFile } from "@/hooks/useCleanFile";
import { config } from "@/config/env";

import type { FileInterface } from "../utils/uploadResponse";


const Start: React.FC = () => {
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<FileInterface[]>([]);

  const [fullMetadata, setFullMetadata] = useState<Record<string, string>>({});
  const [filteredMetadata, setFilteredMetadata] = useState<
    Record<string, string>
  >({});
  const [isProcessed, setIsProcessed] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  // const [activeTab, setActiveTab] = useState<TabType>('full');
  const {
    mutate: uploadFiles,
    isPending: isBatchUploading,
    responseData,
  } = useBatchFileUpload();
  const { mutate: cleanFile, isPending: isCleaning } = useCleanFile();

  useEffect(() => {
    if (responseData) {
      setFileIds(responseData.file_ids);
      setFiles(responseData.files);
      setIsProcessed(true);
      setIsCleaned(false);
    }
  }, [responseData]);

  const handleFilesUpload = (files: File[]) => {
    if (files.length === 0) return;
    uploadFiles(files);
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    const fileNames = files.map((file) => file.name);
    console.log("File names:", fileNames);

    handleFilesUpload(files);
  };

  const handleBack = () => {
    setSelectedFiles([]);
    setFullMetadata({});
    setFilteredMetadata({});
    setIsProcessed(false);
    setIsCleaned(false);
    setDownloadUrl("");
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = config.apiUrl + downloadUrl.slice(1);
    }
  };

  const isPending = isCleaning || isBatchUploading;

  return (
    <div className="flex flex-col items-center justify-start w-[400px] min-h-[500px] bg-white shadow-lg p-6 relative overflow-hidden">
      {/* Cleaning Overlay */}
      {isCleaning && <LoaderOverlay message="Cleaning metadata..." />}

      {/* Header */}
      <div className="w-full mb-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Metastrip
        </h1>
        <p className="text-center text-gray-500 text-sm mt-2">
          {isBatchUploading
            ? "Processing your file..."
            : !isProcessed && !isCleaned && !selectedFiles.length
            ? "Upload a file to view its metadata"
            : isCleaned
            ? "Your cleaned file is ready"
            : "View your file's metadata"}
        </p>
      </div>

      {/* Content Container */}
      <div className="w-full flex-1 relative">
        {/* Upload View */}
        {!isBatchUploading && !isProcessed && (
          <div className="w-full">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Upload Loading View */}
        {isBatchUploading && <LoaderOverlay message="Uploading files..." />}

        {/* Metadata View */}
        {isProcessed && !isCleaned && (
          <MetadataView
            files={files}
            isPending={isPending}
            handleBack={handleBack}
          />
        )}

        {/* Download View */}
        {isCleaned && downloadUrl && (
          <DownloadView
            fullMetadata={fullMetadata}
            filteredMetadata={filteredMetadata}
            handleDownload={handleDownload}
            handleBack={handleBack}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 w-full text-center">
        <p className="text-xs text-gray-400">Secure metadata management</p>
      </div>
    </div>
  );
};

export default Start;

// const handleCleanFile = () => {
//   if (!fileId) return;

//   cleanFile(fileId, {
//     onSuccess: (data: CleanFileResponse) => {
//       console.log('Clean Response:', data);
//       setDownloadUrl(data.download_url);
//       setFullMetadata(data.metadata);
//       setFilteredMetadata(data.filtered_metadata);
//       setIsCleaned(true);
//       toast.success("Metadata cleaned successfully!");
//     },
//     onError: (error) => {
//       console.error('Clean Error:', error);
//       toast.error("Failed to clean metadata. Please try again.");
//     }
//   });
// };
