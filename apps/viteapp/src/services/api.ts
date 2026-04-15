import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUserStore } from '../hooks';

export const clientBaseURL = import.meta.env.VITE_PUBLIC_API_CLIENT_API;

export const clientApi = axios.create({
  baseURL: clientBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_PUBLIC_X_API_KEY,
  },
});

clientApi.interceptors.request.use(
  async (config) => {
    const token = useUserStore.getState()?.token || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.validateStatus = (status) => {
      if (status === 401) {
        alert('Session expired. Please log in again.');
        useUserStore.getState().logout();
        return false;
      }
      return true;
    };
    return config;
  },
  (error) => Promise.reject(error),
);

clientApi.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error),
);
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
