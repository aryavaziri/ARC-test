// lib/axiosClient.ts
import axios, { AxiosRequestConfig } from 'axios';
import { handleWithTryCatch } from './helpers';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic GET
export async function axiosGet<T>(url: string, config?: AxiosRequestConfig) {
  return handleWithTryCatch<T>(async () => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  });
}

// Generic POST
export async function axiosPost<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig) {
  return handleWithTryCatch<T>(async () => {
    const response = await axiosInstance.post<T>(url, body, config);
    console.log(response);
    return response.data;
  });
}
