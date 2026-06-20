import { describe, it, expect } from "vitest";
import { formatCondition } from "../formatCondition";

describe("formatCondition – full labels (detail pages)", () => {
  it('maps "new" → "New"', () => {
    expect(formatCondition("new")).toBe("New");
  });

  it('maps "used_like_new" → "Used - Like New"', () => {
    expect(formatCondition("used_like_new")).toBe("Used - Like New");
  });

  it('maps "used_good" → "Used - Good"', () => {
    expect(formatCondition("used_good")).toBe("Used - Good");
  });

  it('maps "used_fair" → "Used - Fair"', () => {
    expect(formatCondition("used_fair")).toBe("Used - Fair");
  });
});

describe("formatCondition – short labels (filter pills)", () => {
  it('maps "new" → "New"', () => {
    expect(formatCondition("new", true)).toBe("New");
  });

  it('maps "used_like_new" → "Like New"', () => {
    expect(formatCondition("used_like_new", true)).toBe("Like New");
  });

  it('maps "used_good" → "Good"', () => {
    expect(formatCondition("used_good", true)).toBe("Good");
  });

  it('maps "used_fair" → "Fair"', () => {
    expect(formatCondition("used_fair", true)).toBe("Fair");
  });
});
