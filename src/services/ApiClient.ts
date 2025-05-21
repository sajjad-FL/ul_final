// src/services/apiClient.ts
import axiosInstance from './AxiosInstance';
import { AxiosRequestConfig } from 'axios';
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export const apiClient = {
  get: async <T>(url: string, params?: object): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.get<T>(url, { params });
    return { data: response.data, status: response.status };
  },

  post: async <T>(url: string, body: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<T>(url, body, config);
    return { data: response.data, status: response.status };
  },

  put: async <T>(url: string, body: object): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.put<T>(url, body);
    return { data: response.data, status: response.status };
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.delete<T>(url);
    return { data: response.data, status: response.status };
  },
};
