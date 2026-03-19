import { create } from 'zustand';

interface UseUserProps {
  token: string;
  tokenBiometric: string;
  setToken: (token: string) => void;
  setTokenBiometric: (tokenBiometric: string) => void;
  logout: () => void;
}

export const useUserStore = create<UseUserProps>(set => ({
  token: '',
  tokenBiometric: '',
  setToken: (token: string) => {
    set({ token });
  },
  setTokenBiometric: (tokenBiometric: string) => {
    set({ tokenBiometric });
  },
  logout: () => {
    set({ token: '', tokenBiometric: '' });
  },
}));

export const useUser = useUserStore;
