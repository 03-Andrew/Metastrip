import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import GroupDropdownSelector from "@/components/metadata-group-dropdown";
import type { FileInterface } from "../utils/uploadResponse";
import { cn } from "@/lib/utils";

interface MetadataDisplayProps {
  metadata: Record<string, string>;
  isSelectionMode: boolean;
  selectedFile: FileInterface;
  selectedFileFields: Record<string, string[]>;
  addField: (item: string) => void;
  addFileField: (id: string, item: string) => void;
  removeField: (item: string) => void;
  removeFileField: (id: string, item: string) => void;
  selectedFields: string[];

}

export default function MetadataDisplay({
  metadata,
  isSelectionMode,
  selectedFile,
  selectedFileFields,
  addField,
  removeField,
  addFileField,
  removeFileField,
  selectedFields,
}: MetadataDisplayProps) {
  console.log(selectedFile.filename);
  const toggleField = (item: string, checked: boolean) => {
    if (checked) {
      addFileField(selectedFile.filename, item);
    } else {
      removeFileField(selectedFile.filename, item);
    }
  };

  return (
    <div className="h-[200px]">
      {isSelectionMode && (
        <GroupDropdownSelector
          metadata={metadata}
          selectedFields={selectedFields}
          addField={addField}
          removeField={removeField}
        />
      )}
      <ScrollArea className={cn(isSelectionMode ? "h-[170px]" : "h-[200px]")}>
        <div className="pr-2">
        <div className="space-y-0.5">
          {Object.entries(metadata).map(([key, value]) => (
            <div
              key={key}
              onClick={() =>
                isSelectionMode &&
                toggleField(key, !selectedFileFields[selectedFile.filename]?.includes(key)
                
              )
              }
              className={cn(
                "flex items-center justify-between border-b border-gray-100 py-1.5 last:border-0",
                isSelectionMode && "cursor-pointer hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-800">
                  {isSelectionMode && (
                    <span className="inline-block align-middle pr-1">
                      <Checkbox
                        id={`checkbox-${key}`}
                        checked={selectedFileFields[selectedFile.filename]?.includes(key)
                        }
                        onCheckedChange={(checked) =>
                          toggleField(key, checked === true)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </span>
                  )}
                  {key}:
                </span>
              </div>
              <span className="max-w-[150px] break-words text-right text-xs text-gray-600">
                {value}
              </span>
            </div>
          ))}
        </div>
        </div>
      </ScrollArea>
    </div>
  );
}
