import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/metadataApi';
import { config } from '../config/env';
export const useFileUpload = () => {
    const url = config.apiUrl + 'uploadfile/';
    return useMutation({
        mutationFn: (file: File) => uploadFile(file, url)
    });
};
