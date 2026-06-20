import type { Listing } from "@/data/listings";

export type SortOption = "recent" | "price-low" | "price-high" | "nearest" | "views";

export interface FilterParams {
  query: string;
  category: string;
  conditions: string[];
  priceRange: [number, number];
  sort: SortOption;
}

export function filterListings(listings: Listing[], params: FilterParams): Listing[] {
  const { query, category, conditions, priceRange, sort } = params;

  let results = listings.filter((l) => l.status === "active");

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
    );
  }

  if (category !== "all") {
    results = results.filter((l) => l.category === category);
  }

  if (conditions.length > 0) {
    results = results.filter((l) => conditions.includes(l.condition));
  }

  // Free and swap listings are always included regardless of the price range
  // slider, because their numeric price field (0) is not meaningful.
  results = results.filter((l) => {
    if (l.priceType === "free" || l.priceType === "swap") return true;
    return l.price >= priceRange[0] && l.price <= priceRange[1];
  });

  switch (sort) {
    case "price-low":
      return [...results].sort((a, b) => a.price - b.price);
    case "price-high":
      return [...results].sort((a, b) => b.price - a.price);
    case "views":
      return [...results].sort((a, b) => b.views - a.views);
    default:
      // "recent" and "nearest" (nearest is not yet implemented server-side)
      return [...results].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}
