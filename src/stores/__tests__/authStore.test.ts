import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useAuthStore } from "../authStore";

const INITIAL_STATE = {
  user: null,
  isLoading: false,
  isAuthModalOpen: false,
  authModalMode: "login" as const,
};

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState(INITIAL_STATE);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("authStore – login", () => {
  it("derives the display name from the email local-part", async () => {
    vi.useFakeTimers();
    const { login } = useAuthStore.getState();
    const p = login("alice@example.com", "secret");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().user?.name).toBe("alice");
  });

  it("sets isLoading to true during the request", async () => {
    vi.useFakeTimers();
    const { login } = useAuthStore.getState();
    const p = login("alice@example.com", "secret");
    expect(useAuthStore.getState().isLoading).toBe(true);
    await vi.runAllTimersAsync();
    await p;
  });

  it("clears isLoading after success", async () => {
    vi.useFakeTimers();
    const { login } = useAuthStore.getState();
    const p = login("alice@example.com", "secret");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("stores the email on the user object", async () => {
    vi.useFakeTimers();
    const { login } = useAuthStore.getState();
    const p = login("bob@test.com", "pass");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().user?.email).toBe("bob@test.com");
  });

  it("closes the auth modal after a successful login", async () => {
    vi.useFakeTimers();
    useAuthStore.setState({ isAuthModalOpen: true });
    const { login } = useAuthStore.getState();
    const p = login("alice@example.com", "secret");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
  });

  it("marks the new user as verified", async () => {
    vi.useFakeTimers();
    const { login } = useAuthStore.getState();
    const p = login("alice@example.com", "secret");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().user?.verified).toBe(true);
  });
});

describe("authStore – signup", () => {
  it("uses the provided full name", async () => {
    vi.useFakeTimers();
    const { signup } = useAuthStore.getState();
    const p = signup("Alice Smith", "alice@example.com", "secret");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().user?.name).toBe("Alice Smith");
  });

  it("marks the new signup user as unverified", async () => {
    vi.useFakeTimers();
    const { signup } = useAuthStore.getState();
    const p = signup("Alice", "alice@example.com", "secret");
    await vi.runAllTimersAsync();
    await p;
    expect(useAuthStore.getState().user?.verified).toBe(false);
  });
});

describe("authStore – logout", () => {
  it("clears the user", () => {
    useAuthStore.setState({
      user: { id: "u1", name: "Alice", email: "a@a.com", avatar: "", verified: true },
    });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe("authStore – modal", () => {
  it("opens the modal in the requested mode", () => {
    useAuthStore.getState().openAuthModal("signup");
    expect(useAuthStore.getState().isAuthModalOpen).toBe(true);
    expect(useAuthStore.getState().authModalMode).toBe("signup");
  });

  it('defaults to "login" mode when no mode is provided', () => {
    useAuthStore.getState().openAuthModal();
    expect(useAuthStore.getState().authModalMode).toBe("login");
  });

  it("closes the modal", () => {
    useAuthStore.setState({ isAuthModalOpen: true });
    useAuthStore.getState().closeAuthModal();
    expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
  });
});
