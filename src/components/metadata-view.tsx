import { Button } from "./ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";

import MetadataDisplay from "./metadata-display";
import MetadataTabs from "./metadata-tabs";
import MetadataSelectFile from "./metadata-selectfile";

import type { FileInterface } from "../utils/uploadResponse";

interface MetadataViewProps {
  files: FileInterface[];
  handleBack: () => void;
  isPending: boolean;
  cleanFiles?: (fileIds: Record<string, string[]>) => void;
  selectedFileFields: Record<string, string[]>;
  setSelectedFileFields: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}

export default function MetadataView({
  files,
  handleBack,
  isPending,
  cleanFiles,
  selectedFileFields,
  setSelectedFileFields,
}: MetadataViewProps) {
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.fileid || "");
  const [activeTab, setActiveTab] = useState<"full" | "filtered" | "selectable">("full");
  const selectedFile = files.find((file) => file.fileid === selectedFileId);

  if (!selectedFile) return <p>No file selected or available.</p>;
  


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
              cleanFiles(selectedFileFields || {});
              // console.log(JSON.stringify(fileIds, null, 2));
              console.log(JSON.stringify(selectedFileFields));
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
                : activeTab === "filtered"
                ? selectedFile.filtered
                : selectedFile.selectable
            }
            tab={activeTab}
            selectedFile={selectedFile}
            addFileField={addFieldToFile}
            removeFileField={removeFieldFromFile}
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
