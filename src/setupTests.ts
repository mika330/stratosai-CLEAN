import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom does not implement matchMedia — provide a minimal stub so hooks
// that use window.matchMedia (useIsMobile, Radix UI internals) don't throw.
Object.defineProperty(window, "matchMedia", {
  writable: true,
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
