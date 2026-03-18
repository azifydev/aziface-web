import { useUserStore } from '@/app/hooks';
import axios from 'axios';

export const clientBaseURL = process.env.NEXT_PUBLIC_API_CLIENT_API;

export const clientApi = axios.create({
  baseURL: clientBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
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
        return false;
      }
      return true;
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

clientApi.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  },
);
