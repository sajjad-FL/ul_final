// src/services/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    // "https://ul-ai-chemadvisor-backend.salmonglacier-36421fc2.eastus2.azurecontainerapps.io/",
    "http://172.203.242.247:8005/",
  timeout: 4800000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Global error handling
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
