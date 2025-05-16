"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MetadataDisplayProps {
  metadata: Record<string, string>
  isSelectionMode: boolean
  selectedKeys: string[]
  onToggleSelection: (key: string) => void
}

export default function MetadataDisplay({
  metadata,
  isSelectionMode,
  selectedKeys,
  onToggleSelection,
}: MetadataDisplayProps) {
  return (
    <ScrollArea className="h-[200px] pr-2">
      <div className="space-y-0.5">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between border-b border-gray-100 py-1.5 last:border-0">
            <div className="flex items-center gap-1.5">
              {isSelectionMode && (
                <Checkbox
                  id={`checkbox-${key}`}
                  checked={selectedKeys.includes(key)}
                  onCheckedChange={() => onToggleSelection(key)}
                  className="h-3 w-3"
                />
              )}
              <span className="text-xs font-medium text-gray-800">{key}:</span>
            </div>
            <span className="max-w-[150px] break-words text-right text-xs text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
