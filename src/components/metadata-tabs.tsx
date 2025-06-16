import { cn } from "@/lib/utils";
import type { FileInterface } from "../utils/uploadResponse";
import { useEffect } from "react";

interface MetadataTabsProps {
  selectedFile: FileInterface;
  setActiveTab: (tab: "full" | "filtered" | "selectable") => void;
  activeTab: "full" | "filtered" | "selectable";
}

export default function MetadataTabs({
  selectedFile,
  setActiveTab,
  activeTab,
}: MetadataTabsProps) {
  const filename = selectedFile.filename.toLowerCase();
  const isOfficeFile = filename.endsWith(".docx") || filename.endsWith(".xlsx");

  // If it's an Office file, force selectable tab
  useEffect(() => {
    if (isOfficeFile) {
      setActiveTab("selectable");
    }
  }, [selectedFile.filename]);

  if (isOfficeFile) {
    return (
      <div className="border-b border-gray-200 mb-4">
        <div className="flex gap-4 w-full">
          <button
            className="pb-2 text-sm font-medium transition-colors flex-1 text-blue-600 border-b-2 border-blue-600"
            onClick={() => setActiveTab("selectable")}
          >
            Selectable
            <span className="ml-2 text-xs text-gray-400">
              ({Object.keys(selectedFile.selectable).length})
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex gap-4 w-full">
        {/* Full metadata */}
        <button
          className={cn(
            "pb-2 text-sm font-medium transition-colors flex-1",
            activeTab === "full"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("full")}
        >
          Full
          <span className="ml-2 text-xs text-gray-400">
            ({Object.keys(selectedFile.metadata).length})
          </span>
        </button>

        {/* Filtered / Deletable metadata */}
        <button
          className={cn(
            "pb-2 text-sm font-medium transition-colors flex-1",
            activeTab === "filtered"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("filtered")}
        >
          Deletable
          <span className="ml-2 text-xs text-gray-400">
            ({Object.keys(selectedFile.filtered).length})
          </span>
        </button>

        {/* Selectable metadata */}
        <button
          className={cn(
            "pb-2 text-sm font-medium transition-colors flex-1",
            activeTab === "selectable"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("selectable")}
        >
          Selectable
          <span className="ml-2 text-xs text-gray-400">
            ({Object.keys(selectedFile.selectable).length})
          </span>
        </button>
      </div>
    </div>
  );
}
