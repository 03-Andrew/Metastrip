interface FileMetadata {
  name: string;
  size: string;
  type: string;
  lastModified: string;
  // Image specific
  width?: number;
  height?: number;
  // Document specific
  pageCount?: number;
  // Audio specific
  duration?: string;
  bitrate?: string;
  // Video specific
  videoWidth?: number;
  videoHeight?: number;
  videoDuration?: string;
  // Additional metadata
  extension: string;
  sizeInBytes: number;
  formattedSize: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
}

async function extractImageMetadata(file: File, meta: FileMetadata): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        ...meta,
        width: img.width,
        height: img.height,
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

async function extractAudioMetadata(file: File, meta: FileMetadata): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve({
        ...meta,
        duration: audio.duration.toFixed(2) + ' seconds',
      });
    };
    audio.src = URL.createObjectURL(file);
  });
}

async function extractVideoMetadata(file: File, meta: FileMetadata): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({
        ...meta,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        videoDuration: video.duration.toFixed(2) + ' seconds',
      });
    };
    video.src = URL.createObjectURL(file);
  });
}

async function extractFileMetadata(file: File): Promise<FileMetadata> {
  // Base metadata
  let meta: FileMetadata = {
    name: file.name,
    size: `${file.size} bytes`,
    type: file.type || 'application/octet-stream',
    lastModified: new Date(file.lastModified).toLocaleString(),
    extension: getFileExtension(file.name),
    sizeInBytes: file.size,
    formattedSize: formatFileSize(file.size),
  };

  try {
    // Extract specific metadata based on file type
    if (file.type.startsWith('image/')) {
      meta = await extractImageMetadata(file, meta);
    } 
    else if (file.type.startsWith('audio/')) {
      meta = await extractAudioMetadata(file, meta);
    }
    else if (file.type.startsWith('video/')) {
      meta = await extractVideoMetadata(file, meta);
    }
    // Add more file type handlers here

    return meta;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return meta;
  }
}

export { extractFileMetadata, type FileMetadata };
