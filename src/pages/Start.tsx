import React, { useState, useEffect } from "react";
// import FileUpload from '@/components/FileUpload';
import FileUpload from "@/components/file-uploader";
import MetadataView from "@/components/metadata-view";
import LoaderOverlay from "@/components/loader-overlay";
import DownloadView from "@/components/download-view";

import { useBatchFileUpload } from "@/hooks/usefileUpload";
import { useCleanFiles } from "@/hooks/useCleanFile";
import { config } from "@/config/env";

import type { FileInterface } from "../utils/uploadResponse";

const Start: React.FC = () => {
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const [selectedFileFields, setSelectedFileFields] = useState<Record<string, string[]>>({})

  const [files, setFiles] = useState<FileInterface[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const {
    mutate: uploadFiles,
    isPending: isBatchUploading,
    responseData,
  } = useBatchFileUpload();

  const {
    mutate: cleanFile,
    isPending: isCleaning,
    responseData: download_url,
  } = useCleanFiles();

  const handleBack = () => {
    if (isProcessed && isCleaned) {
      window.location.reload();
    } else {
      setIsProcessed(false);
      setIsCleaned(false);
      setDownloadUrl("");
      setFileIds([]);
      setFiles([]);
    }
  };

  useEffect(() => {
    if (responseData && !isProcessed) {
      setFileIds(responseData.file_ids);
      setFiles(responseData.files);
      setIsProcessed(true);
      setIsCleaned(false);
    }

    if (download_url && !isCleaned) {
      setDownloadUrl(download_url.download_url);
      setIsCleaned(true);
    }
  }, [responseData, download_url]);

  useEffect(() =>{
    console.log(selectedFields)
  }
  ,[])

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

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = config.apiUrl + downloadUrl.slice(1);
    }
  };

  const isPending = isCleaning || isBatchUploading;

  return (
    <div className="flex flex-col items-center justify-start w-[420px] h-[550px] bg-white shadow-lg p-6 relative overflow-hidden">
      {/* Cleaning Overlay */}
      {isCleaning && <LoaderOverlay message="Cleaning metadata..." />}

      {/* Header */}
      <div className="w-full mb-4">
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
            <FileUpload
              onFileSelect={handleFileSelect}
              handleFilesUpload={handleFilesUpload}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          </div>
        )}

        {/* Upload Loading View */}
        {isBatchUploading && <LoaderOverlay message="Uploading files..." />}

        {/* Metadata View */}
        {isProcessed && !isCleaned && (
          <MetadataView
            files={files}
            fileIds={fileIds}
            isPending={isPending}
            handleBack={handleBack}
            cleanFiles={cleanFile}
            selectedFields={selectedFields}
            selectedFileFields={selectedFileFields}
            setSelectedFields={setSelectedFields}
            setSelectedFileFields={setSelectedFileFields}
          />
        )}

        {/* Download View */}
        {downloadUrl && (
          <DownloadView
            handleDownload={handleDownload}
            handleBack={handleBack}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 w-full text-center">
        <p className="text-xs text-gray-400">Secure metadata management</p>
      </div>
    </div>
  );
};

export default Start;
