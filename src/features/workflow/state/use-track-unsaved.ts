import { create } from 'zustand';

interface WorkflowState {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
}

export const useTrackUnsaved = create<WorkflowState>((set) => ({
  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),
  reset: () => set({ isDirty: false }),
}));
