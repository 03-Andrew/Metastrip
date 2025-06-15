import { Button } from "./ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";

import MetadataDisplay from "./metadata-display";
import MetadataTabs from "./metadata-tabs";
import MetadataSelectFile from "./metadata-selectfile";

import type { FileInterface } from "../utils/uploadResponse";

interface MetadataViewProps {
  files: FileInterface[];
  fileIds?: string[];
  handleBack: () => void;
  isPending: boolean;
  cleanFiles?: (fileIds: string[]) => void;
  selectedFields: string[];
  selectedFileFields: Record<string, string[]>;
  setSelectedFields: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedFileFields: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}

export default function MetadataView({
  files,
  fileIds,
  handleBack,
  isPending,
  cleanFiles,
  selectedFields,
  selectedFileFields,
  setSelectedFields,
  setSelectedFileFields,
}: MetadataViewProps) {
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.fileid || "");
  const [activeTab, setActiveTab] = useState<"full" | "filtered">("full");
  const selectedFile = files.find((file) => file.fileid === selectedFileId);

  if (!selectedFile) return <p>No file selected or available.</p>;
  const addFields = (key: string) => {
    setSelectedFields((prevFields) => {
      // Check if key already exists
      if (prevFields.includes(key)) {
        return prevFields;
      }
      // Add new unique key
      return [...prevFields, key];
    });
  };

  const addFieldToFile = (fileId: string, field: string) => {
    setSelectedFileFields((prev) => {
      const currentFields = prev[fileId] || [];
      if (currentFields.includes(field)) {
        return prev; // Field already added, no update
      }

      return {
        ...prev,
        [fileId]: [...currentFields, field],
      };
    });
  };

  const removeFieldFromFile = (fileId: string, field: string) => {
    setSelectedFileFields((prev) => {
      const currentFields = prev[fileId] || [];

      const updatedFields = currentFields.filter((f) => f !== field);

      return {
        ...prev,
        [fileId]: updatedFields,
      };
    });
  };

  const removeFields = (item: string) => {
    setSelectedFields((prevItems) => prevItems.filter((i) => i !== item));
  };

  return (
    <div className="w-full">
      {/* Buttons */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1.5 text-gray-600"
          onClick={handleBack}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Upload Another
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="text-xs flex items-center gap-1.5"
          disabled={isPending}
          onClick={() => {
            if (selectedFile && cleanFiles) {
              // cleanFiles(fileIds || []);
              // console.log(JSON.stringify(fileIds, null, 2));
              console.log(selectedFileFields);
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clean Metadata
        </Button>
      </div>

      {/* File Selector */}
      <MetadataSelectFile
        files={files.map((file) => ({
          fileid: file.fileid,
          filename: file.filename,
        }))}
        selectedFileId={selectedFileId}
        setSelectedFileId={setSelectedFileId}
      />

      {/* Tabs */}
      <MetadataTabs
        selectedFile={selectedFile}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Metadata Display */}
      <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
        {selectedFile && (
          <MetadataDisplay
            metadata={
              activeTab === "full"
                ? selectedFile.metadata
                : selectedFile.filtered
            }
            selectedFile={selectedFile}
            isSelectionMode={activeTab === "filtered"}
            addField={addFields}
            addFileField={addFieldToFile}
            removeFileField={removeFieldFromFile}
            removeField={removeFields}
            selectedFields={selectedFields}
            selectedFileFields={selectedFileFields}
          />
        )}
      </div>
    </div>
  );
}

// {/* Tabs */}`
// <div className="border-b border-gray-200 mb-4">
// <div className="flex gap-4">
//   <button
//     className={cn(
//       "pb-2 text-sm font-medium transition-colors relative",
//       activeTab === 'full'
//         ? "text-blue-600 border-b-2 border-blue-600"
//         : "text-gray-500 hover:text-gray-700"
//     )}
//     onClick={() => setActiveTab('full')}
//   >
//     Full Metadata
//     <span className="ml-2 text-xs text-gray-400">
//       ({Object.keys(fullMetadata).length})
//     </span>
//   </button>
//   <button
//     className={cn(
//       "pb-2 text-sm font-medium transition-colors relative",
//       activeTab === 'filtered'
//         ? "text-blue-600 border-b-2 border-blue-600"
//         : "text-gray-500 hover:text-gray-700"
//     )}
//     onClick={() => setActiveTab('filtered')}
//   >
//     Filtered Metadata
//     <span className="ml-2 text-xs text-gray-400">
//       ({Object.keys(filteredMetadata).length})
//     </span>
//   </button>
// </div>
// </div>
