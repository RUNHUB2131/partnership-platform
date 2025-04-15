import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from './types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  loading: true,
  error: null,
  initialized: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ initialized }),
      reset: () => set(initialState),
    }),
    {
      name: 'runhub-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      version: 1,
      migrate: (persistedState: any) => {
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);