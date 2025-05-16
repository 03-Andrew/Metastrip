import { useMutation } from '@tanstack/react-query';
import { config } from '../config/env';

interface CleanFileResponse {
    message: string;
    original_file: string;
    cleaned_file: string;
    metadata: Record<string, string>;
    filtered_metadata: Record<string, string>;
    download_url: string;
}

export const useCleanFile = () => {
    const url = config.apiUrl + 'clean/';
    
    return useMutation({
        mutationFn: async (fileId: string): Promise<CleanFileResponse> => {
            const response = await fetch(url + fileId, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`Clean failed: ${response.statusText}`);
            }

            return response.json();
        }
    });
};
