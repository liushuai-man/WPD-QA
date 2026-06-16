import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosPromise,
} from 'axios';
import { useAuthStore } from '../store/useUserStore';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      const storedAuth = localStorage.getItem('wpd-auth');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          accessToken = parsed.accessToken;
        } catch {
          console.error('Failed to parse stored auth');
        }
      }
    }
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

axiosInstance.interceptors.response.use(
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

interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
  get<T = any>(url: string, config?: Partial<InternalAxiosRequestConfig>): Promise<T>;
  post<T = any>(url: string, data?: any, config?: Partial<InternalAxiosRequestConfig>): Promise<T>;
  put<T = any>(url: string, data?: any, config?: Partial<InternalAxiosRequestConfig>): Promise<T>;
  delete<T = any>(url: string, config?: Partial<InternalAxiosRequestConfig>): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: Partial<InternalAxiosRequestConfig>): Promise<T>;
}

const request = axiosInstance as CustomAxiosInstance;

export default request;