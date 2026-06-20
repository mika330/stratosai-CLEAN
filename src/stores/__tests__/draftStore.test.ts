import { describe, it, expect, beforeEach } from "vitest";
import { useDraftStore } from "../draftStore";

const EMPTY_DRAFT = {
  step1: null,
  step2: null,
  step3: [] as string[],
  step4: null,
  step5: null,
};

beforeEach(() => {
  localStorage.clear();
  useDraftStore.setState({ draft: EMPTY_DRAFT, currentStep: 1 });
});

describe("draftStore – updateStepData", () => {
  it("writes data to the correct step key", () => {
    useDraftStore.getState().updateStepData(1, { category: "electronics", subcategory: "phones" });
    expect(useDraftStore.getState().draft.step1).toEqual({ category: "electronics", subcategory: "phones" });
  });

  it("does not overwrite unrelated steps", () => {
    useDraftStore.getState().updateStepData(1, { category: "cars", subcategory: "" });
    useDraftStore.getState().updateStepData(2, { title: "My Car" });
    expect(useDraftStore.getState().draft.step1?.category).toBe("cars");
    expect(useDraftStore.getState().draft.step2).toEqual({ title: "My Car" });
  });

  it("updates step3 (photos array)", () => {
    useDraftStore.getState().updateStepData(3, ["img1.jpg", "img2.jpg"]);
    expect(useDraftStore.getState().draft.step3).toEqual(["img1.jpg", "img2.jpg"]);
  });
});

describe("draftStore – goToStep", () => {
  it("sets currentStep to the requested step", () => {
    useDraftStore.getState().goToStep(3);
    expect(useDraftStore.getState().currentStep).toBe(3);
  });

  it("can step backwards", () => {
    useDraftStore.setState({ currentStep: 4 });
    useDraftStore.getState().goToStep(2);
    expect(useDraftStore.getState().currentStep).toBe(2);
  });
});

describe("draftStore – clearDraft", () => {
  it("resets all step data to the initial empty state", () => {
    useDraftStore.getState().updateStepData(1, { category: "cars", subcategory: "" });
    useDraftStore.getState().updateStepData(2, { title: "My Car" });
    useDraftStore.getState().clearDraft();
    const { draft } = useDraftStore.getState();
    expect(draft.step1).toBeNull();
    expect(draft.step2).toBeNull();
    expect(draft.step3).toEqual([]);
  });

  it("resets currentStep to 1", () => {
    useDraftStore.setState({ currentStep: 5 });
    useDraftStore.getState().clearDraft();
    expect(useDraftStore.getState().currentStep).toBe(1);
  });
});
