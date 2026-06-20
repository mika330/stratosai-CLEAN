import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ListingDetailPage } from "../ListingDetailPage";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get(_, tag: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function MotionEl({ children, ...props }: any) {
          const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
          void initial; void animate; void exit; void transition; void whileHover; void whileTap;
          return <div data-tag={tag} {...rest}>{children}</div>;
        };
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Suppress Radix UI console warnings in jsdom (missing ResizeObserver etc.)
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

function renderDetail(listingId: string) {
  return render(
    <MemoryRouter initialEntries={[`/listing/${listingId}`]}>
      <Routes>
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/inbox" element={<div>Inbox</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ListingDetailPage – not found", () => {
  it("shows a not-found message for an unknown listing id", () => {
    renderDetail("nonexistent-id");
    expect(screen.getByText(/listing not found/i)).toBeInTheDocument();
  });
});

describe("ListingDetailPage – price display", () => {
  it("shows the price for a fixed-price listing (l2 = £5,200)", () => {
    renderDetail("l2");
    // Price appears in both the left column heading and the right sticky sidebar
    const priceEls = screen.getAllByText("£5,200");
    expect(priceEls.length).toBeGreaterThan(0);
  });

  it('shows "Free" for a free listing (l41)', () => {
    renderDetail("l41");
    const freeEls = screen.getAllByText("Free");
    expect(freeEls.length).toBeGreaterThan(0);
  });
});

describe("ListingDetailPage – Make an offer button visibility", () => {
  it("hides Make an offer for a free listing", () => {
    renderDetail("l41"); // l41 is a free listing
    expect(screen.queryByText(/make an offer/i)).not.toBeInTheDocument();
  });

  it("shows Make an offer for a fixed-price listing", () => {
    renderDetail("l2"); // l2 is a fixed-price listing
    expect(screen.getAllByText(/make an offer/i).length).toBeGreaterThan(0);
  });
});

describe("ListingDetailPage – auth gating", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, isLoading: false, isAuthModalOpen: false, authModalMode: "login" });
  });

  it("opens the auth modal when an unauthenticated user clicks Message seller", async () => {
    const user = userEvent.setup();
    renderDetail("l2");
    // Click the primary "Message seller" button (there are two: desktop + mobile)
    const messageBtns = screen.getAllByText(/message seller|^message$/i);
    await user.click(messageBtns[0]);
    expect(useAuthStore.getState().isAuthModalOpen).toBe(true);
  });

  it("opens the auth modal in login mode when messaging without auth", async () => {
    const user = userEvent.setup();
    renderDetail("l2");
    const messageBtns = screen.getAllByText(/message seller|^message$/i);
    await user.click(messageBtns[0]);
    expect(useAuthStore.getState().authModalMode).toBe("login");
  });

  it("opens the auth modal when an unauthenticated user clicks Make an offer", async () => {
    const user = userEvent.setup();
    renderDetail("l2");
    const offerBtns = screen.getAllByText(/make an offer|^offer$/i);
    await user.click(offerBtns[0]);
    expect(useAuthStore.getState().isAuthModalOpen).toBe(true);
  });

  it("opens the message modal (not auth modal) when an authenticated user clicks Message seller", async () => {
    useAuthStore.setState({
      user: { id: "u1", name: "Test", email: "t@t.com", avatar: "", verified: true },
    });
    const user = userEvent.setup();
    renderDetail("l2");
    const messageBtns = screen.getAllByText(/message seller|^message$/i);
    await user.click(messageBtns[0]);
    // Auth modal must NOT have opened
    expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
    // Message modal content should be visible
    expect(screen.getByPlaceholderText(/is this still available/i)).toBeInTheDocument();
  });
});

describe("ListingDetailPage – favourites", () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ favorites: [], savedSearches: [] });
    useAuthStore.setState({ user: null, isLoading: false, isAuthModalOpen: false, authModalMode: "login" });
  });

  it("toggles the favourite state when the Save button is clicked", async () => {
    const user = userEvent.setup();
    renderDetail("l2");
    expect(useFavoritesStore.getState().isFavorite("l2")).toBe(false);
    // The desktop Save button
    const saveBtns = screen.getAllByRole("button", { name: /save|saved/i });
    await user.click(saveBtns[0]);
    expect(useFavoritesStore.getState().isFavorite("l2")).toBe(true);
  });
});
