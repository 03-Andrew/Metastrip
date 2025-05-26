import { useMutation } from "@tanstack/react-query";
import { config } from "../config/env";
import { cleanMetadata } from "@/api/metadataApi";
import { useState } from "react";

interface CleanFileResponse {
  message: string;
  original_file: string;
  cleaned_file: string;
  metadata: Record<string, string>;
  filtered_metadata: Record<string, string>;
  download_url: string;
}

export const useCleanFile = () => {
  const url = config.apiUrl + "clean/";

  return useMutation({
    mutationFn: async (fileId: string): Promise<CleanFileResponse> => {
      const response = await fetch(url + fileId, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Clean failed: ${response.statusText}`);
      }

      return response.json();
    },
  });
};

export const useCleanFiles = () => {
  const url = config.apiUrl + "clean/batch/";
  const [responseData, setResponseData] = useState<any>(null);

  const { status, error, mutate, isPending } = useMutation({
    mutationFn: (fileIds: string[]) => cleanMetadata(fileIds, url),
    onSuccess: (data) => {
      console.log("Batch clean success:", data);
      setResponseData(data);
    },
  });
  return { status, error, mutate, isPending, responseData };
};
