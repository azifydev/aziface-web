import { create } from 'zustand';
import { getString, storeString, storeClearAll } from '../helpers/store';

interface UseUserProps {
  token: string;
  tokenBiometric: string;
  setToken: (token: string) => void;
  setTokenBiometric: (tokenBiometric: string) => void;
  logout: () => void;
}
export const useUserStore = create<UseUserProps>((set) => ({
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
    storeClearAll();
    set({ token: '', tokenBiometric: '' });
  },
}));

export const useUser = useUserStore;
