import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedSearch {
  id: string;
  query: string;
  filters: Record<string, unknown>;
  alertEnabled: boolean;
}

interface FavoritesState {
  favorites: string[];
  savedSearches: SavedSearch[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addSavedSearch: (search: Omit<SavedSearch, "id">) => void;
  removeSavedSearch: (id: string) => void;
  toggleAlert: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      savedSearches: [],
      toggleFavorite: (id: string) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      isFavorite: (id: string) => get().favorites.includes(id),
      addSavedSearch: (search) =>
        set((state) => ({
          savedSearches: [
            ...state.savedSearches,
            { ...search, id: `search_${Date.now()}` },
          ],
        })),
      removeSavedSearch: (id: string) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),
      toggleAlert: (id: string) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s
          ),
        })),
    }),
    { name: "favorites-storage" }
  )
);
