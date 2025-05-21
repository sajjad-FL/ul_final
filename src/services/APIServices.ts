// src/services/userService.ts
// import camAdvisorData from "@/data";
import { apiClient } from "./ApiClient";

export const uploadFile = (
  file: File,
  list_ids: string[],
  signal?: AbortSignal
) => {
  const formData = new FormData();
  formData.append("file", file);
  list_ids.forEach((item) => formData.append("list_data", item));

  return apiClient.post<any>("/api/upload_file", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // This will handle file uploads correctly
    },
    signal,
  });
};

export const uploadText = (
  text: string,
  list_ids: string[],
  signal?: AbortSignal
) => {
  const formData = new FormData();
  formData.append("input_data", text);
  list_ids.forEach((item) => formData.append("list_data", item));
  return apiClient.post<any>(`/api/upload_text`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // This will handle file uploads correctly
    },
    signal,
  });
};

export const getExtractedData = (id: string) => {
  return apiClient.get<any>(`/api/process/${id}`);
};
export const getVersions = () => {
  return apiClient.get<any>(`/api/versions`);
};
export const getProcessesByVersion = (version_id: string) => {
  return apiClient.get<any>(`/api/process/version/${version_id}`);
};

// downloadService.ts
export const downloadChemicals = (id: string) => {
  const API_URL = `/api/download_excel/${id}`;
  return apiClient.get<ArrayBuffer>(API_URL, {
    responseType: "arraybuffer",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
};
