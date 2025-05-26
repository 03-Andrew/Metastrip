export const uploadFile = async (file: File, url: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

export const uploadFiles = async (files: File[], url: string) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Batch upload failed: ${response.statusText}`);
  }

  return response.json();
};
