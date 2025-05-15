interface FileMetadata {
  name: string;
  size: string;
  type: string;
  lastModified: string;
  width?: number;
  height?: number;
}

function extractFileMetadata(file: File): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const meta: FileMetadata = {
      name: file.name,
      size: `${file.size} bytes`,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    };

    if (file.type.startsWith('image/')) {
      const img = new window.Image();
      img.onload = () => {
        resolve({
          ...meta,
          width: img.width,
          height: img.height,
        });
      };
      img.src = URL.createObjectURL(file);
    } else {
      resolve(meta);
    }
  });
}

export { extractFileMetadata, type FileMetadata };
