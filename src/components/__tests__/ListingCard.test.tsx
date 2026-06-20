import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ListingCard } from "../ListingCard";
import type { Listing } from "@/data/listings";

// Framer Motion components are not meaningful in jsdom — render as plain elements.
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get(_, tag: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function MotionEl({ children, ...props }: any) {
          const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
          void initial; void animate; void exit; void transition; void whileHover; void whileTap;
          return <div {...rest}>{children}</div>;
        };
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the favorites store so we control isFavorite / toggleFavorite.
const mockToggleFavorite = vi.fn();
const mockIsFavorite = vi.fn().mockReturnValue(false);

vi.mock("@/stores/favoritesStore", () => ({
  useFavoritesStore: () => ({
    toggleFavorite: mockToggleFavorite,
    isFavorite: mockIsFavorite,
  }),
}));

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "l1",
    title: "Test Item For Sale",
    description: "A great item",
    price: 150,
    priceType: "fixed",
    category: "electronics",
    subcategory: "phones",
    condition: "used_good",
    images: ["https://example.com/img.jpg"],
    location: { city: "London", area: "Hackney", lat: 51.5, lng: -0.05 },
    seller: { id: "s1", name: "Alice", avatar: "", verified: true, rating: 4.5, reviewCount: 10, responseTime: "< 1 hour", memberSince: "2023-01" },
    status: "active",
    isFeatured: false,
    isPromoted: false,
    views: 50,
    favorites: 5,
    createdAt: new Date("2024-06-01").toISOString(),
    updatedAt: new Date("2024-06-01").toISOString(),
    ...overrides,
  };
}

function renderCard(listing: Listing) {
  return render(
    <MemoryRouter>
      <ListingCard listing={listing} />
    </MemoryRouter>
  );
}

// Renders the card alongside a route that captures navigation so we can assert
// that clicking the heart button does NOT trigger a route change.
function LocationDisplay() {
  return <span data-testid="pathname">{useLocation().pathname}</span>;
}

function renderCardWithRouter(listing: Listing) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <LocationDisplay />
      <Routes>
        <Route path="/" element={<ListingCard listing={listing} />} />
        <Route path="/listing/:id" element={<div>Detail Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockToggleFavorite.mockClear();
  mockIsFavorite.mockReturnValue(false);
});

describe("ListingCard – price display", () => {
  it("renders £-prefixed price for a fixed listing", () => {
    renderCard(makeListing({ price: 150, priceType: "fixed" }));
    expect(screen.getByText("£150")).toBeInTheDocument();
  });

  it('renders "Free" for a free listing', () => {
    renderCard(makeListing({ price: 0, priceType: "free" }));
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it('renders "Swap" for a swap listing', () => {
    renderCard(makeListing({ price: 0, priceType: "swap" }));
    expect(screen.getByText("Swap")).toBeInTheDocument();
  });

  it("renders formatted price for negotiable listing", () => {
    renderCard(makeListing({ price: 18950, priceType: "negotiable" }));
    expect(screen.getByText("£18,950")).toBeInTheDocument();
  });
});

describe("ListingCard – badges", () => {
  it("shows the FEATURED badge when isFeatured is true", () => {
    renderCard(makeListing({ isFeatured: true }));
    expect(screen.getByText("FEATURED")).toBeInTheDocument();
  });

  it("does not show the FEATURED badge when isFeatured is false", () => {
    renderCard(makeListing({ isFeatured: false }));
    expect(screen.queryByText("FEATURED")).not.toBeInTheDocument();
  });

  it("shows the Verified label when seller is verified", () => {
    renderCard(makeListing({ seller: { ...makeListing().seller, verified: true } }));
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("does not show the Verified label when seller is not verified", () => {
    renderCard(makeListing({ seller: { ...makeListing().seller, verified: false } }));
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });
});

describe("ListingCard – favourite interaction", () => {
  it("calls toggleFavorite when the heart button is clicked", async () => {
    const user = userEvent.setup();
    renderCard(makeListing({ id: "l42" }));
    const heartBtn = screen.getByRole("button");
    await user.click(heartBtn);
    expect(mockToggleFavorite).toHaveBeenCalledOnce();
    expect(mockToggleFavorite).toHaveBeenCalledWith("l42");
  });

  it("does not navigate to the detail page when the heart button is clicked", async () => {
    const user = userEvent.setup();
    renderCardWithRouter(makeListing({ id: "l42" }));
    const heartBtn = screen.getByRole("button");
    await user.click(heartBtn);
    // Route should stay at "/" — stopPropagation prevents the card Link from activating
    expect(screen.getByTestId("pathname").textContent).toBe("/");
    expect(screen.queryByText("Detail Page")).not.toBeInTheDocument();
  });
});

describe("ListingCard – navigation", () => {
  it("wraps the card in a link to the listing detail page", () => {
    const { container } = renderCard(makeListing({ id: "l99" }));
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/listing/l99");
  });
});
