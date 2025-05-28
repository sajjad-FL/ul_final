// src/services/userService.ts
// import camAdvisorData from "@/data";
import { apiClient } from "./ApiClient";
import axios from "axios";

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
  // return { status: 200, data: camAdvisorData };
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
export const getProcessesByVersion = async () => {
  // return apiClient.get<any>(`/api/process/version/${version_id}`);
  const { data } = await axios.get("/metrics_jsons/documents.json");
  return data;
  // return { status: 200 }
};
export const getDocumentList = async () => {
  // return apiClient.get<any>(`/api/process/version/${version_id}`);
  const { data } = await axios.get("/metrics_jsons/documents.json");
  return data;
};

export const getAllDocumentData = async () => {
  const { data: documentsList } = await axios.get("/metrics_jsons/documents.json");
  const documentFilenames = documentsList.map(
    (doc: any) => doc._id // Extract filenames from the documents list
  );

  // Fetch all JSON documents listed in documents.json
  const documentPromises = documentFilenames.map((filename: string) =>
    axios.get(`/metrics_jsons/${filename}.json`).then((res) => res.data)
  );

  const allDocuments = await Promise.all(documentPromises);
  console.log("All documents fetched:", allDocuments);
  return {allDocuments, documentsList};
};
export const getAllDocumentDataByFilename = async (filename: string) => {
  // return apiClient.get<any>(`/api/process/version/${version_id}`);
  const { data } = await axios.get(`/metrics_jsons/${filename}.json`);
  return data;
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
