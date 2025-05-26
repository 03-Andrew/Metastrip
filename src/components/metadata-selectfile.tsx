import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MetadataSelectFileProps {
  files: { fileid: string; filename: string }[];
  selectedFileId: string;
  setSelectedFileId: (fileId: string) => void;
}

export default function MetadataSelectFile({
  files,
  selectedFileId,
  setSelectedFileId,
}: MetadataSelectFileProps) {
  return (
    <Select
      value={selectedFileId}
      onValueChange={(value) => setSelectedFileId(value)}
    >
      <SelectTrigger className="w-full mb-3">
        <SelectValue placeholder={selectedFileId} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {files.map((file) => (
            <SelectItem key={file.fileid} value={file.fileid}>
              {file.filename}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
