import { describe, it, expect } from "vitest";
import { filterListings } from "../filterListings";
import type { Listing } from "@/data/listings";

// Minimal listing factory — only the fields filterListings actually reads.
function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "test-1",
    title: "Test Item",
    description: "A test description",
    price: 100,
    priceType: "fixed",
    category: "electronics",
    subcategory: "phones",
    condition: "used_good",
    images: ["https://example.com/img.jpg"],
    location: { city: "London", area: "Hackney", lat: 51.5, lng: -0.05 },
    seller: {
      id: "s1",
      name: "Alice",
      avatar: "",
      verified: true,
      rating: 4.5,
      reviewCount: 10,
      responseTime: "< 1 hour",
      memberSince: "2023-01",
    },
    status: "active",
    isFeatured: false,
    isPromoted: false,
    views: 50,
    favorites: 5,
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
    ...overrides,
  };
}

const DEFAULT_PARAMS = {
  query: "",
  category: "all",
  conditions: [] as string[],
  priceRange: [0, 30000] as [number, number],
  sort: "recent" as const,
};

describe("filterListings – status filter", () => {
  it("excludes sold listings", () => {
    const listings = [makeListing({ status: "sold" }), makeListing({ id: "t2", status: "active" })];
    expect(filterListings(listings, DEFAULT_PARAMS)).toHaveLength(1);
  });

  it("excludes expired listings", () => {
    const listings = [makeListing({ status: "expired" })];
    expect(filterListings(listings, DEFAULT_PARAMS)).toHaveLength(0);
  });
});

describe("filterListings – text search", () => {
  const electronics = makeListing({ id: "e1", title: "iPhone 14 Pro", description: "great phone", category: "electronics" });
  const cars = makeListing({ id: "c1", title: "Ford Fiesta", description: "economical car", category: "cars" });

  it("matches on title", () => {
    const results = filterListings([electronics, cars], { ...DEFAULT_PARAMS, query: "iphone" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("e1");
  });

  it("matches on description", () => {
    const results = filterListings([electronics, cars], { ...DEFAULT_PARAMS, query: "economical" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("c1");
  });

  it("matches on category", () => {
    const results = filterListings([electronics, cars], { ...DEFAULT_PARAMS, query: "cars" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("c1");
  });

  it("is case-insensitive", () => {
    const results = filterListings([electronics, cars], { ...DEFAULT_PARAMS, query: "IPHONE" });
    expect(results).toHaveLength(1);
  });

  it("returns all results when query is empty", () => {
    const results = filterListings([electronics, cars], { ...DEFAULT_PARAMS, query: "" });
    expect(results).toHaveLength(2);
  });
});

describe("filterListings – category filter", () => {
  const a = makeListing({ id: "a", category: "electronics" });
  const b = makeListing({ id: "b", category: "cars" });

  it("filters to the selected category", () => {
    const results = filterListings([a, b], { ...DEFAULT_PARAMS, category: "cars" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("b");
  });

  it('"all" returns listings from every category', () => {
    const results = filterListings([a, b], { ...DEFAULT_PARAMS, category: "all" });
    expect(results).toHaveLength(2);
  });
});

describe("filterListings – condition filter", () => {
  const newItem = makeListing({ id: "n", condition: "new" });
  const likeNew = makeListing({ id: "ln", condition: "used_like_new" });
  const good = makeListing({ id: "g", condition: "used_good" });
  const fair = makeListing({ id: "f", condition: "used_fair" });
  const all = [newItem, likeNew, good, fair];

  it("returns all when conditions array is empty", () => {
    expect(filterListings(all, { ...DEFAULT_PARAMS, conditions: [] })).toHaveLength(4);
  });

  it("filters to a single condition", () => {
    const results = filterListings(all, { ...DEFAULT_PARAMS, conditions: ["new"] });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("n");
  });

  it("supports multi-select conditions", () => {
    const results = filterListings(all, { ...DEFAULT_PARAMS, conditions: ["new", "used_good"] });
    expect(results).toHaveLength(2);
    const ids = results.map((r) => r.id);
    expect(ids).toContain("n");
    expect(ids).toContain("g");
  });
});

describe("filterListings – price range", () => {
  const cheap = makeListing({ id: "cheap", price: 10, priceType: "fixed" });
  const mid = makeListing({ id: "mid", price: 500, priceType: "negotiable" });
  const expensive = makeListing({ id: "exp", price: 25000, priceType: "fixed" });
  const freeItem = makeListing({ id: "free", price: 0, priceType: "free" });
  const swapItem = makeListing({ id: "swap", price: 0, priceType: "swap" });

  it("excludes listings below the minimum", () => {
    const results = filterListings([cheap, mid], { ...DEFAULT_PARAMS, priceRange: [100, 30000] });
    expect(results.map((r) => r.id)).not.toContain("cheap");
  });

  it("excludes listings above the maximum", () => {
    const results = filterListings([mid, expensive], { ...DEFAULT_PARAMS, priceRange: [0, 1000] });
    expect(results.map((r) => r.id)).not.toContain("exp");
  });

  it("includes listings within the range", () => {
    const results = filterListings([cheap, mid, expensive], { ...DEFAULT_PARAMS, priceRange: [5, 600] });
    expect(results).toHaveLength(2);
  });

  it("always includes free listings even when priceMin > 0", () => {
    const results = filterListings([freeItem, cheap], { ...DEFAULT_PARAMS, priceRange: [50, 1000] });
    expect(results.map((r) => r.id)).toContain("free");
  });

  it("always includes swap listings even when priceMin > 0", () => {
    const results = filterListings([swapItem, cheap], { ...DEFAULT_PARAMS, priceRange: [50, 1000] });
    expect(results.map((r) => r.id)).toContain("swap");
  });
});

describe("filterListings – sorting", () => {
  const older = makeListing({ id: "old", price: 300, views: 10, createdAt: new Date("2024-01-01").toISOString() });
  const newer = makeListing({ id: "new", price: 100, views: 500, createdAt: new Date("2024-06-01").toISOString() });
  const priciest = makeListing({ id: "exp", price: 999, views: 50, createdAt: new Date("2024-03-01").toISOString() });

  it('sorts by most-recent first (default "recent")', () => {
    const results = filterListings([older, priciest, newer], { ...DEFAULT_PARAMS, sort: "recent" });
    expect(results[0].id).toBe("new");
    expect(results[2].id).toBe("old");
  });

  it('sorts price low-to-high for "price-low"', () => {
    const results = filterListings([older, priciest, newer], { ...DEFAULT_PARAMS, sort: "price-low" });
    expect(results[0].id).toBe("new");
    expect(results[2].id).toBe("exp");
  });

  it('sorts price high-to-low for "price-high"', () => {
    const results = filterListings([older, priciest, newer], { ...DEFAULT_PARAMS, sort: "price-high" });
    expect(results[0].id).toBe("exp");
    expect(results[2].id).toBe("new");
  });

  it('sorts by most-viewed first for "views"', () => {
    const results = filterListings([older, priciest, newer], { ...DEFAULT_PARAMS, sort: "views" });
    expect(results[0].id).toBe("new");
    expect(results[2].id).toBe("old");
  });

  it("does not mutate the original array", () => {
    const listings = [older, newer];
    filterListings(listings, { ...DEFAULT_PARAMS, sort: "price-high" });
    expect(listings[0].id).toBe("old");
  });
});

describe("filterListings – combined filters", () => {
  it("applies category + condition + price range together", () => {
    const match = makeListing({ id: "match", category: "electronics", condition: "used_good", price: 200 });
    const wrongCat = makeListing({ id: "wc", category: "cars", condition: "used_good", price: 200 });
    const wrongCond = makeListing({ id: "wcond", category: "electronics", condition: "new", price: 200 });
    const wrongPrice = makeListing({ id: "wp", category: "electronics", condition: "used_good", price: 5000 });

    const results = filterListings([match, wrongCat, wrongCond, wrongPrice], {
      query: "",
      category: "electronics",
      conditions: ["used_good"],
      priceRange: [0, 500],
      sort: "recent",
    });

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("match");
  });
});
