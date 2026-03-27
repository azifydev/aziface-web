import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UseUserProps {
  token: string;
  tokenBiometric: string;
  setToken: (token: string) => void;
  setTokenBiometric: (tokenBiometric: string) => void;
  logout: () => void;
}

export const useUserStore = create<UseUserProps>()(
  persist(
    set => ({
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
    }),
    {
      name: 'userStorage',
    },
  ),
);

export const useUser = useUserStore;
