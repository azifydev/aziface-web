import {
  ConfigsResponseData,
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
} from '@/types/services.types';
import { clientApi } from './api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/hooks';

export function useCreate() {
  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (params: CreateUserRequest) => {
      const response = await clientApi.post('/users', {
        ...params,
      });
      return response?.data;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (params: LoginRequest) => {
      const response = await clientApi.post('/auth/login', {
        ...params,
      });
      if (response?.data?.accessToken) {
        useUserStore.getState().setToken(response?.data?.accessToken);
      }
      return response?.data as LoginResponse;
    },
  });
}

export function useBiometricSession() {
  return useMutation({
    mutationKey: ['biometric-session'],
    mutationFn: async () => {
      const response = await clientApi.post('/biometrics/session');
      if (response.data.error) throw new Error(response.data.message);
      if (response?.data?.token) {
        useUserStore.getState().setTokenBiometric(response?.data?.token);
      }
      return response?.data?.token;
    },
  });
}

export function useBiometricConfigs() {
  return useQuery({
    queryKey: ['configs'],
    queryFn: async () => {
      const response = await clientApi.get<ConfigsResponseData>(
        '/biometrics/configs',
      );

      return response.data;
    },
  });
}
