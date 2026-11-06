import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type AuthState = {
  token: string | null;
  username: string | null;
  setSession: (token: string, username: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      username: null,
      setSession: (token, username) => set({token, username}),
      clearSession: () => set({token: null, username: null}),
    }),
    {
      name: 'manifest-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
