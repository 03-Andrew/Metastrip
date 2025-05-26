import { Button } from "./ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import MetadataDisplay from "./metadata-display";
// import { cn } from "@/lib/utils";
import type { FileInterface } from "../utils/uploadResponse";

interface MetadataViewProps {
  files: FileInterface[];
  handleBack: () => void;
  isPending: boolean;
}

export default function MetadataView({
  files,
  handleBack,
  isPending,
}: MetadataViewProps) {
  

  const [selectedFileId, setSelectedFileId] = useState(files[0]?.fileid || "");
  const [activeTab, setActiveTab] = useState<"full" | "filtered">("filtered");

  const selectedFile = files.find((file) => file.fileid === selectedFileId);
  if (!selectedFile) return <p>No file selected or available.</p>;

  return (
    <div className="w-full">
      {/* Buttons */}
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
          disabled={isPending}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clean Metadata
        </Button>
      </div>
      {/* File Selector */}
      <select
        className="w-full mb-3 text-sm border rounded p-2 text-gray-800"
        value={selectedFileId}
        onChange={(e) => setSelectedFileId(e.target.value)}
      >
        {files.map((file) => (
          <option key={file.fileid} value={file.fileid}>
            {file.filename}
          </option>
        ))}
      </select>

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-3">
        <Button
          variant={activeTab === "filtered" ? "default" : "ghost"}
          size="sm"
          className="text-xs"
          onClick={() => setActiveTab("filtered")}
        >
          Filtered Metadata
        </Button>
        <Button
          variant={activeTab === "full" ? "default" : "ghost"}
          size="sm"
          className="text-xs"
          onClick={() => setActiveTab("full")}
        >
          Full Metadata
        </Button>
      </div>
      {/* Metadata Display */}
      <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
        {selectedFile && (
          <MetadataDisplay
            metadata={
              activeTab === "full"
                ? selectedFile.metadata
                : selectedFile.filtered
            }
            isSelectionMode={false}
            selectedKeys={[]}
            onToggleSelection={() => {}}
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
