import { create } from 'zustand';
import { getString, storeClearAll, storeString } from '@/helpers';

interface UseUserProps {
  token: string;
  tokenBiometric: string;
  setToken: (token: string) => void;
  setTokenBiometric: (tokenBiometric: string) => void;
  logout: () => void;
}

export const useUserStore = create<UseUserProps>(set => ({
  token: getString('token') || '',
  tokenBiometric: getString('tokenBiometric') || '',
  setToken: (token: string) => {
    set({ token });
    storeString('token', token);
  },
  setTokenBiometric: (tokenBiometric: string) => {
    set({ tokenBiometric });
    storeString('tokenBiometric', tokenBiometric);
  },
  logout: () => {
    set({ token: '', tokenBiometric: '' });
    storeClearAll();
  },
}));

export const useUser = useUserStore;
