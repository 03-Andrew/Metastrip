import { useMutation } from "@tanstack/react-query";
import { config } from "../config/env";
import { cleanMetadata } from "@/api/metadataApi";
import { useState } from "react";

export const useCleanFiles = () => {
  const url = config.apiUrl + "clean/batch/v2";
  const [responseData, setResponseData] = useState<any>(null);

  const { status, error, mutate, isPending } = useMutation({
    mutationKey: ["cleanFiles"],
    mutationFn: (fileIds: Record<string, string[]>) =>
      cleanMetadata(fileIds, url),
    onSuccess: (data) => {
      console.log("Batch clean success:", data);
      setResponseData(data);
    },
  });
  return { status, error, mutate, isPending, responseData };
};
