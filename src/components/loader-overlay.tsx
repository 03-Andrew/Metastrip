import { Loader2 } from "lucide-react";

export default function LoaderOverlay(message: { message: string }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
      <p className="text-sm text-gray-600">{message.message}.</p>
    </div>
  );
}
