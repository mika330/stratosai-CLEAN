import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PostDraft {
  step1: { category: string; subcategory: string } | null;
  step2: Record<string, unknown> | null;
  step3: string[];
  step4: { city: string; area: string } | null;
  step5: { isPromoted: boolean } | null;
}

interface DraftState {
  draft: PostDraft;
  currentStep: number;
  updateStepData: (step: number, data: unknown) => void;
  goToStep: (step: number) => void;
  clearDraft: () => void;
}

const emptyDraft: PostDraft = {
  step1: null,
  step2: null,
  step3: [],
  step4: null,
  step5: null,
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      draft: emptyDraft,
      currentStep: 1,
      updateStepData: (step, data) =>
        set((state) => ({
          draft: { ...state.draft, [`step${step}`]: data as never },
        })),
      goToStep: (step) => set({ currentStep: step }),
      clearDraft: () => set({ draft: emptyDraft, currentStep: 1 }),
    }),
    { name: "draft-storage" }
  )
);
