import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  isMobile: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setIsMobile: (isMobile) => set({ isMobile }),
}));
