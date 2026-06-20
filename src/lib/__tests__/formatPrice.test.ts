import { describe, it, expect } from "vitest";
import { formatPrice } from "../formatPrice";

describe("formatPrice", () => {
  it('returns "Free" for free listings', () => {
    expect(formatPrice(0, "free")).toBe("Free");
  });

  it('returns "Swap" for swap listings', () => {
    expect(formatPrice(0, "swap")).toBe("Swap");
  });

  it("returns £-prefixed price for fixed type", () => {
    expect(formatPrice(650, "fixed")).toBe("£650");
  });

  it("returns £-prefixed price for negotiable type", () => {
    expect(formatPrice(18950, "negotiable")).toBe("£18,950");
  });

  it("formats large prices with locale separators", () => {
    expect(formatPrice(1000000, "fixed")).toBe("£1,000,000");
  });

  it("handles zero price for fixed type", () => {
    expect(formatPrice(0, "fixed")).toBe("£0");
  });
});
