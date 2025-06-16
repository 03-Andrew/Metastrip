import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface GroupDropdownSelectorProps {
  fileId: string;
  metadata: Record<string, string>;
  selectedFileFields: Record<string, string[]>;
  addFileField: (id: string, item: string) => void;
  removeFileField: (id: string, item: string) => void;
}

export default function GroupDropdownSelector({
  fileId,
  metadata,
  selectedFileFields,
  addFileField,
  removeFileField,
}: GroupDropdownSelectorProps) {
  // Determine which fields are currently selected for this file
  const selectedFields = selectedFileFields[fileId] || [];

  // Group metadata keys by their prefix group
  const groupMap: Record<string, string[]> = {};
  Object.keys(metadata).forEach((key) => {
    const [group] = key.split(":");
    if (!groupMap[group]) groupMap[group] = [];
    groupMap[group].push(key);
  });
  const groupNames = Object.keys(groupMap);

  // Check if all keys in a group are selected
  const isGroupSelected = (group: string) =>
    groupMap[group]?.every((key) => selectedFields.includes(key));

  // Toggle entire group on/off for this file
  const toggleGroup = (group: string, checked: boolean) => {
    const keys = groupMap[group] || [];
    if (checked) {
      keys.forEach((key) => addFileField(fileId, key));
    } else {
      keys.forEach((key) => removeFileField(fileId, key));
    }
  };

  // "Select All" logic for this file
  const allKeys = Object.keys(metadata);
  const allSelected =
    allKeys.length > 0 && allKeys.every((key) => selectedFields.includes(key));
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      allKeys.forEach((key) => addFileField(fileId, key));
    } else {
      allKeys.forEach((key) => removeFileField(fileId, key));
    }
  };

  return (
    <div className="pb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 px-2 text-xs w-full">
            Select Groups
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Groups</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            checked={allSelected}
            onCheckedChange={(checked) => toggleSelectAll(checked === true)}
          >
            Select All
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          {groupNames.map((group) => (
            <DropdownMenuCheckboxItem
              key={group}
              checked={isGroupSelected(group)}
              onCheckedChange={(checked) =>
                toggleGroup(group, checked === true)
              }
            >
              {group}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
