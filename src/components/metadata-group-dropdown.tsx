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
  metadata: Record<string, string>;
  selectedFields: string[];
  addField: (item: string) => void;
  removeField: (item: string) => void;
}

export default function GroupDropdownSelector({
  metadata,
  selectedFields,
  addField,
  removeField,
}: GroupDropdownSelectorProps) {
  // Group metadata keys like File:ExifByteOrder → File group
  const groupMap: Record<string, string[]> = {};

  Object.keys(metadata).forEach((key) => {
    const [group] = key.split(":");
    if (!groupMap[group]) groupMap[group] = [];
    groupMap[group].push(key);
  });

  const groupNames = Object.keys(groupMap);

  const isGroupSelected = (group: string) =>
    groupMap[group]?.every((key) => selectedFields.includes(key));

  const toggleGroup = (group: string, checked: boolean) => {
    const keys = groupMap[group] || [];
    if (checked) {
      keys.forEach((key) => addField(key));
    } else {
      keys.forEach((key) => removeField(key));
    }
  };
  const allKeys = Object.keys(metadata);
  const allSelected =
    allKeys.length > 0 && allKeys.every((key) => selectedFields.includes(key));

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      allKeys.forEach((key) => addField(key));
    } else {
      allKeys.forEach((key) => removeField(key));
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