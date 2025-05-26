import { useMutation } from '@tanstack/react-query';
import { uploadFiles } from '../api/metadataApi';
import { config } from '../config/env';
import { useState } from 'react';


export const useBatchFileUpload = () => {
  
    const [responseData, setResponseData] = useState<any>(null);
    const url = config.apiUrl + "upload/";
  
    const { status, error, mutate, isPending } = useMutation({
      mutationKey: ["uploadFiles"],
      mutationFn: (files: File[]) => uploadFiles(files, url),
      onSuccess: (data) => {
        console.log("Upload success:", data);
        setResponseData(data);
      },
      onError: (error) => {
        console.error("Upload failed:", error);
      },
    });
  
    return { status, error, mutate, isPending, responseData };
  };