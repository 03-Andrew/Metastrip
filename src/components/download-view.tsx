import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface DownloadViewProps {
  handleDownload: () => void;
  handleBack: () => void;
}

export default function DownloadView({
  handleDownload,
  handleBack,
}: DownloadViewProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="text-center mb-6">
        <p className="text-green-600 font-medium mb-2">
          Metadata Cleaned Successfully!
        </p>
        <p className="text-gray-500 text-sm">
          Your file has been cleaned and is ready for download.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="default"
          size="default"
          className="flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download Cleaned File
        </Button>
        <Button variant="outline" size="default" onClick={handleBack}>
          Upload Another
        </Button>
      </div>
    </div>
  );
}
