import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { CategoryPills } from "@/components/CategoryPills";
import { LISTINGS } from "@/data/listings";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { filterListings, type SortOption } from "@/lib/filterListings";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Most Recent",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  nearest: "Nearest First",
  views: "Most Viewed",
};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sort, setSort] = useState<SortOption>("recent");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchParams((prev) => {
      if (cat === "all") prev.delete("category");
      else prev.set("category", cat);
      return prev;
    });
  };

  const filtered = useMemo(
    () =>
      filterListings(LISTINGS, {
        query,
        category: activeCategory,
        conditions,
        priceRange,
        sort,
      }),
    [query, activeCategory, sort, priceRange, conditions]
  );

  const activeFiltersCount = (activeCategory !== "all" ? 1 : 0) + conditions.length + (priceRange[1] < 30000 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm mb-3">Price range</h4>
        <div className="px-1">
          <Slider
            defaultValue={[0, 30000]}
            max={30000}
            step={100}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(v) => setPriceRange([v[0], v[1]])}
            className="mb-3"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-9 bg-lm-bg-warm rounded-lg flex items-center px-3 text-sm">
            £{priceRange[0]}
          </div>
          <span className="text-lm-text-muted">-</span>
          <div className="flex-1 h-9 bg-lm-bg-warm rounded-lg flex items-center px-3 text-sm">
            £{priceRange[1]}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Condition</h4>
        <div className="space-y-2">
          {["new", "used_like_new", "used_good", "used_fair"].map((c) => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox
                id={c}
                checked={conditions.includes(c)}
                onCheckedChange={(checked) => {
                  setConditions((prev) =>
                    checked ? [...prev, c] : prev.filter((x) => x !== c)
                  );
                }}
              />
              <Label htmlFor={c} className="text-sm capitalize">
                {c === "used_like_new" ? "Like New" : c === "used_good" ? "Good" : c === "used_fair" ? "Fair" : "New"}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Date posted</h4>
        <RadioGroup defaultValue="any">
          <div className="space-y-2">
            {["Last 24 hours", "Last 7 days", "Last 30 days", "Any time"].map((d) => (
              <div key={d} className="flex items-center gap-2">
                <RadioGroupItem value={d.toLowerCase().replace(/\s/g, "-")} id={d} />
                <Label htmlFor={d} className="text-sm">{d}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <button
        onClick={() => {
          setActiveCategory("all");
          setPriceRange([0, 30000]);
          setConditions([]);
        }}
        className="w-full h-10 text-sm font-medium text-lm-orange border border-lm-orange rounded-full hover:bg-lm-orange/5 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Search Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lm-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              defaultValue={query}
              onChange={(e) => {
                setSearchParams((prev) => {
                  if (e.target.value) prev.set("q", e.target.value);
                  else prev.delete("q");
                  return prev;
                });
              }}
              className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-lm-border-light focus:border-lm-orange outline-none text-sm transition-colors"
            />
          </div>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <button className="relative flex items-center gap-2 h-11 px-4 bg-white border border-lm-border-light rounded-xl hover:border-lm-orange transition-colors lg:hidden">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-lm-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto pb-8">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Category Pills */}
        <CategoryPills activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

        {/* Sort + Count */}
        <div className="flex items-center justify-between mt-4 py-3 border-b border-lm-border-light">
          <p className="text-sm text-lm-text-secondary">{filtered.length} results found</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-9 px-3 bg-white border border-lm-border-light rounded-lg text-sm focus:border-lm-orange outline-none"
          >
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {activeCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-lm-bg-warm border border-lm-border-light rounded-full text-xs font-medium">
              {activeCategory}
              <button onClick={() => handleCategoryChange("all")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {conditions.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-lm-bg-warm border border-lm-border-light rounded-full text-xs font-medium">
              {c === "used_like_new" ? "Like New" : c === "used_good" ? "Good" : c === "used_fair" ? "Fair" : "New"}
              <button onClick={() => setConditions((prev) => prev.filter((x) => x !== c))}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      {/* Results Grid */}
      <div className="flex gap-6 mt-4">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 bg-white rounded-xl border border-lm-border-light p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setPriceRange([0, 30000]);
                    setConditions([]);
                  }}
                  className="text-xs text-lm-orange font-medium hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <FiltersContent />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-lm-text-muted mb-3" />
              <h3 className="text-lg font-semibold text-lm-text-primary mb-1">No results found</h3>
              <p className="text-sm text-lm-text-secondary">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
