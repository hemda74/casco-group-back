import { create } from 'zustand';

interface useActiveStoreInterface {
  id?: string;
  set: (id: number) => void;
  reset: () => void;
}

export const useActiveStore = create<useActiveStoreInterface>((set) => ({
  id: undefined,
  set: (id: number) => set({ id }),
  reset: () => set({ id: undefined }),
}));
