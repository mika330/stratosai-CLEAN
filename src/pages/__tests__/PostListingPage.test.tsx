import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PostListingPage } from "../PostListingPage";

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

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/post"]}>
      <Routes>
        <Route path="/post" element={<PostListingPage />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function getContinueButton() {
  return screen.getByRole("button", { name: /continue/i });
}

// Helper: advance to step 2 using a fresh userEvent instance.
async function goToStep2() {
  const user = userEvent.setup();
  renderPage();
  await user.click(screen.getByText("Electronics"));
  await user.click(getContinueButton());
  return user;
}

// Helper: fill in the minimum valid step 2 fields.
// Uses fireEvent.change for controlled inputs (more reliable in React 19 + jsdom
// than simulated keypress sequences from userEvent.type).
function fillStep2Fields({
  title = "Valid title here",
  description = "This is a long enough description for the listing.",
  priceType = "Fixed",
  price = "99",
  condition = "New",
}: {
  title?: string;
  description?: string;
  priceType?: string;
  price?: string | null;
  condition?: string;
} = {}) {
  fireEvent.change(screen.getByPlaceholderText(/what are you selling\? be specific/i), {
    target: { value: title },
  });
  fireEvent.change(screen.getByPlaceholderText(/describe your item/i), {
    target: { value: description },
  });
  // Select price type (may not need to click if already "Fixed")
  if (priceType !== "Fixed") {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${priceType}$`, "i") }));
  }
  // Enter numeric price only for Fixed / Negotiable
  if (price !== null && (priceType === "Fixed" || priceType === "Negotiable")) {
    const priceInput = screen.getByPlaceholderText("0");
    fireEvent.change(priceInput, { target: { value: price } });
  }
  // Select condition
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${condition}$`, "i") }));
}

describe("PostListingPage – Step 1 (category)", () => {
  it("renders the category selection heading", () => {
    renderPage();
    expect(screen.getByText(/what are you selling/i)).toBeInTheDocument();
  });

  it("Continue is disabled before a category is selected", () => {
    renderPage();
    expect(getContinueButton()).toBeDisabled();
  });

  it("Continue becomes enabled after selecting a category", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText("Electronics"));
    expect(getContinueButton()).toBeEnabled();
  });
});

describe("PostListingPage – Step 2 (details)", () => {
  it("reaches step 2 after selecting a category and clicking Continue", async () => {
    await goToStep2();
    expect(screen.getByText(/add details/i)).toBeInTheDocument();
  });

  it("Continue is disabled when title has fewer than 5 characters", async () => {
    await goToStep2();
    fillStep2Fields({ title: "Hi" }); // 2 chars — below the 5-char minimum
    expect(getContinueButton()).toBeDisabled();
  });

  it("Continue is disabled when description has fewer than 20 characters", async () => {
    await goToStep2();
    fillStep2Fields({ description: "Too short" }); // 9 chars — below the 20-char minimum
    expect(getContinueButton()).toBeDisabled();
  });

  it("Continue is enabled when title, description, condition, and price are all valid", async () => {
    await goToStep2();
    fillStep2Fields();
    expect(getContinueButton()).toBeEnabled();
  });

  it("Continue is enabled for priceType=Free with no price entered", async () => {
    await goToStep2();
    fillStep2Fields({ priceType: "Free", price: null });
    expect(getContinueButton()).toBeEnabled();
  });

  it("Continue is enabled for priceType=Swap with no price entered", async () => {
    await goToStep2();
    fillStep2Fields({ priceType: "Swap", price: null });
    expect(getContinueButton()).toBeEnabled();
  });
});

describe("PostListingPage – Step 3 (photos)", () => {
  async function goToStep3() {
    const user = await goToStep2();
    fillStep2Fields();
    await user.click(getContinueButton());
    return user;
  }

  it("renders the photos step heading", async () => {
    await goToStep3();
    expect(screen.getByText(/add photos/i)).toBeInTheDocument();
  });

  it("Continue is always enabled on the photos step (photos are optional)", async () => {
    await goToStep3();
    expect(getContinueButton()).toBeEnabled();
  });

  it("upload button adds a photo thumbnail labelled Cover", async () => {
    const user = await goToStep3();
    const uploadBtn = screen.getByText(/click to upload/i).closest("button")!;
    await user.click(uploadBtn);
    expect(screen.getByText("Cover")).toBeInTheDocument();
  });
});

describe("PostListingPage – back navigation", () => {
  it("navigates back to the home page when Back is clicked on step 1", async () => {
    const user = userEvent.setup();
    renderPage();
    // The first button in the header is the back chevron
    const backBtn = screen.getAllByRole("button")[0];
    await user.click(backBtn);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
