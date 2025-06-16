import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import GroupDropdownSelector from "@/components/metadata-group-dropdown";
import type { FileInterface } from "../utils/uploadResponse";
import { cn } from "@/lib/utils";

interface MetadataDisplayProps {
  metadata: Record<string, string>;
  tab: "full" | "filtered" | "selectable";
  selectedFile: FileInterface;
  selectedFileFields: Record<string, string[]>;
  addFileField: (id: string, item: string) => void;
  removeFileField: (id: string, item: string) => void;
}

export default function MetadataDisplay({
  metadata,
  tab,
  selectedFile,
  selectedFileFields,
  addFileField,
  removeFileField,
}: MetadataDisplayProps) {
  const fileId = selectedFile.fileid;
  console.log(metadata);

  const toggleField = (item: string, checked: boolean) => {
    if (checked) {
      addFileField(fileId, item);
    } else {
      removeFileField(fileId, item);
    }
  };

  const keys = Object.keys(metadata);

  // Check if '-all=' flag is set for filtered tab
  const allDeleted = selectedFileFields[fileId]?.includes("all") ?? false;

  return (
    <div className="h-[200px]">
      {Object.keys(metadata).length === 0 && (
        <p className="text-sm text-gray-500">No metadata available</p>
      )}

      {tab === "selectable" && Object.keys(metadata).length !== 0 && (
        <GroupDropdownSelector
          fileId={fileId}
          addFileField={addFileField}
          removeFileField={removeFileField}
          metadata={metadata}
          selectedFileFields={selectedFileFields}
        />
      )}

      {tab === "filtered" && Object.keys(metadata).length !== 0 && (
        <div className="flex items-center pb-2">
          <Checkbox
            id="select-all"
            checked={allDeleted}
            onCheckedChange={(checked) => {
              if (checked) {
                // remove individual selections
                keys.forEach((key) => removeFileField(fileId, key));
                // add -all= flag
                addFileField(fileId, "all");
              } else {
                // remove -all= flag
                removeFileField(fileId, "all");
              }
            }}
          />
          <label htmlFor="select-all" className="ml-2 text-sm font-medium">
            Remove All
          </label>
        </div>
      )}

      <ScrollArea
        className={cn(tab === "selectable" ? "h-[170px]" : tab ==="filtered" ? "h-[180px]":"h-[200px]")}
      >
        <div className="pr-2">
          <div className="space-y-0.5">
            {keys.map((key) => {
              // Checkbox checked if either individual selected or allDeleted is true
              const isChecked =
                allDeleted ||
                (selectedFileFields[fileId]?.includes(key) ?? false);
              return (
                <div
                  key={key}
                  onClick={() =>
                    tab === "selectable" && toggleField(key, !isChecked)
                  }
                  className={cn(
                    "flex items-center justify-between border-b border-gray-100 py-1.5 last:border-0",
                    tab === "selectable" && "cursor-pointer hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {tab === "selectable" && (
                      <Checkbox
                        id={`checkbox-${key}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          toggleField(key, checked === true)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <span className="ml-2 text-xs font-medium text-gray-800">
                      {key}:
                    </span>
                  </div>
                  <span className="max-w-[150px] break-words text-right text-xs text-gray-600">
                    {metadata[key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
