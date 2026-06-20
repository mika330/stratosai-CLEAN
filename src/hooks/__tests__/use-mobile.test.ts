import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../use-mobile";

// The matchMedia stub is set up in setupTests.ts.
// Here we also control window.innerWidth to drive the hook's logic.

beforeEach(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1024 });
  // Re-apply the matchMedia stub before each test so vi.mocked() calls in
  // individual tests don't leave the shared mock in a modified state.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("useIsMobile", () => {
  it("returns false when innerWidth is above the 768px breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1024 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true when innerWidth is below the 768px breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 375 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns true exactly at 767px (just below the breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 767 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false exactly at 768px (the breakpoint boundary)", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 768 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when the matchMedia change event fires", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1024 });

    // Capture the listener registered by the hook so we can fire it manually.
    let capturedListener: (() => void) | null = null;
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, listener: () => void) => {
        capturedListener = listener;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate a viewport resize to mobile
    act(() => {
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 375 });
      capturedListener?.();
    });

    expect(result.current).toBe(true);
  });
});
