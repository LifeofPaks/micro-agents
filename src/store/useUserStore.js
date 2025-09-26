// store/userStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (userData, token) => set({ user: userData, token }),

      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: "microagents-user", 
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
