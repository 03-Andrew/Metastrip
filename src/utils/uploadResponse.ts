export interface FileInterface {
  status: string;
  fileid: string;
  filename: string;
  filetype: string;
  filtered: Record<string, string>;
  metadata: Record<string, string>;
  selectable: Record<string, string>;
}
