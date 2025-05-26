import { cn } from "@/lib/utils";
import type { FileInterface } from "../utils/uploadResponse";

interface MetadataTabsProps {
  selectedFile: FileInterface;
  setActiveTab: (tab: "full" | "filtered") => void;
  activeTab: "full" | "filtered";
}

export default function MetadataTabs({
  selectedFile,
  setActiveTab,
  activeTab,
}: MetadataTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex gap-4 w-full">
        <button
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative flex-1/2",
            activeTab === "full"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("full")}
        >
          Full Metadata
          <span className="ml-2 text-xs text-gray-400">
            ({Object.keys(selectedFile.metadata).length})
          </span>
        </button>
        <button
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative flex-1/2",
            activeTab === "filtered"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("filtered")}
        >
          Filtered Metadata
          <span className="ml-2 text-xs text-gray-400">
            ({Object.keys(selectedFile.filtered).length})
          </span>
        </button>
      </div>
    </div>
  );
}
