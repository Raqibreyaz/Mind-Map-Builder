import { create } from "zustand";

interface UseEditNodeProps {
  open: boolean;
  nodeId: string | null;
  setOpen: (open?: boolean) => void;
  setNodeId: (id: string | null) => void;
}

export const useEditNode = create<UseEditNodeProps>()((set) => ({
  open: false,
  nodeId: null,
  setOpen: (open) => set((state) => ({ open: open ?? !state.open })),
  setNodeId: (nodeId) => set(() => ({ nodeId })),
}));
