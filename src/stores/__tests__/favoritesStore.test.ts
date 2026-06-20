import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "../favoritesStore";

beforeEach(() => {
  localStorage.clear();
  useFavoritesStore.setState({ favorites: [], savedSearches: [] });
});

describe("favoritesStore – toggleFavorite", () => {
  it("adds an id when it is not already favorited", () => {
    useFavoritesStore.getState().toggleFavorite("listing-1");
    expect(useFavoritesStore.getState().favorites).toContain("listing-1");
  });

  it("removes an id when it is already favorited", () => {
    useFavoritesStore.setState({ favorites: ["listing-1"] });
    useFavoritesStore.getState().toggleFavorite("listing-1");
    expect(useFavoritesStore.getState().favorites).not.toContain("listing-1");
  });

  it("removes only the target id, leaving others intact", () => {
    useFavoritesStore.setState({ favorites: ["listing-1", "listing-2"] });
    useFavoritesStore.getState().toggleFavorite("listing-1");
    expect(useFavoritesStore.getState().favorites).toEqual(["listing-2"]);
  });

  it("does not create duplicates on repeated add", () => {
    useFavoritesStore.getState().toggleFavorite("listing-1");
    useFavoritesStore.getState().toggleFavorite("listing-2");
    expect(useFavoritesStore.getState().favorites).toHaveLength(2);
  });
});

describe("favoritesStore – isFavorite", () => {
  it("returns true for a favorited id", () => {
    useFavoritesStore.setState({ favorites: ["listing-1"] });
    expect(useFavoritesStore.getState().isFavorite("listing-1")).toBe(true);
  });

  it("returns false for an unknown id", () => {
    expect(useFavoritesStore.getState().isFavorite("not-in-list")).toBe(false);
  });
});

describe("favoritesStore – savedSearches", () => {
  it("addSavedSearch appends a search with a generated id", () => {
    const search = { query: "sofa", filters: {}, alertEnabled: false };
    useFavoritesStore.getState().addSavedSearch(search);
    const { savedSearches } = useFavoritesStore.getState();
    expect(savedSearches).toHaveLength(1);
    expect(savedSearches[0].query).toBe("sofa");
    expect(savedSearches[0].id).toBeTruthy();
  });

  it("removeSavedSearch removes the correct entry", () => {
    useFavoritesStore.setState({
      savedSearches: [
        { id: "s1", query: "sofa", filters: {}, alertEnabled: false },
        { id: "s2", query: "bike", filters: {}, alertEnabled: true },
      ],
    });
    useFavoritesStore.getState().removeSavedSearch("s1");
    const { savedSearches } = useFavoritesStore.getState();
    expect(savedSearches).toHaveLength(1);
    expect(savedSearches[0].id).toBe("s2");
  });

  it("toggleAlert flips alertEnabled only on the target item", () => {
    useFavoritesStore.setState({
      savedSearches: [
        { id: "s1", query: "sofa", filters: {}, alertEnabled: false },
        { id: "s2", query: "bike", filters: {}, alertEnabled: false },
      ],
    });
    useFavoritesStore.getState().toggleAlert("s1");
    const { savedSearches } = useFavoritesStore.getState();
    expect(savedSearches.find((s) => s.id === "s1")?.alertEnabled).toBe(true);
    expect(savedSearches.find((s) => s.id === "s2")?.alertEnabled).toBe(false);
  });

  it("toggleAlert turns an enabled alert off", () => {
    useFavoritesStore.setState({
      savedSearches: [{ id: "s1", query: "sofa", filters: {}, alertEnabled: true }],
    });
    useFavoritesStore.getState().toggleAlert("s1");
    expect(useFavoritesStore.getState().savedSearches[0].alertEnabled).toBe(false);
  });
});
