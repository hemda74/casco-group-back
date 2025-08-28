import { create } from 'zustand';

interface useCategoryModalStore {
  isOpen: boolean;
  isEdit: boolean;
  editId?: string;
  onOpen: () => void;
  onEdit: (id: number) => void;
  onClose: () => void;
}

export const useCategoryModal = create<useCategoryModalStore>((set) => ({
  isOpen: false,
  isEdit: false,
  editId: undefined,
  onOpen: () => set({ isOpen: true }),
  onEdit: (id: number) => set({ isOpen: true, isEdit: true, editId: id }),
  onClose: () => set({ isOpen: false, isEdit: false, editId: undefined }),
}));
