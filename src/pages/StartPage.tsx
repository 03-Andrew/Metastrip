import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { extractFileMetadata } from '../utils/fileMetadata';
import type { FileMetadata } from '../utils/fileMetadata';

const StartPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const meta = await extractFileMetadata(file);
    setMetadata(meta);
  };

  const handleUploadAgain = () => {
    setSelectedFile(null);
    setMetadata(null);
  };

  return (
    <div className="w-full h-full overflow-hidden border border-black h-full w-full">
      <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Upload Example
          </h1>
          <p className="text-sm text-gray-600">Upload your file to view its metadata</p>
        </div>

        <div className="w-full bg-white rounded-lg shadow p-4 space-y-4 border border-gray-100">
          {!selectedFile ? (
            <FileUpload onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
                <button
                  onClick={handleUploadAgain}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Upload Again
                </button>
              </div>
            </div>
          )}
        </div>

        {metadata && (
          <div className="w-full bg-white rounded-lg shadow p-4 border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">File Metadata</h2>
            <div className="bg-gray-50 rounded p-3">
              <ul className="space-y-2">
                {Object.entries(metadata).map(([key, value]) => (
                  <li key={key} className="flex items-start text-sm">
                    <span className="font-medium text-gray-700 min-w-[100px]">{key}:</span>
                    <span className="text-gray-600 ml-2 break-all">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;