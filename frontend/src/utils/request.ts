import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useAuthStore } from '../store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default request;
