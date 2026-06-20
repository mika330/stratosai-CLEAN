import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Location {
  city: string;
  area: string;
  lat: number;
  lng: number;
  radius: number;
  displayName: string;
}

interface LocationState {
  location: Location;
  isLocationSet: boolean;
  isUsingGPS: boolean;
  isLocationModalOpen: boolean;
  setLocation: (loc: Partial<Location>) => void;
  useCurrentLocation: () => void;
  clearLocation: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const DEFAULT_LOCATION: Location = {
  city: "London",
  area: "Hackney",
  lat: 51.5074,
  lng: -0.1278,
  radius: 10,
  displayName: "London",
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      isLocationSet: false,
      isUsingGPS: false,
      isLocationModalOpen: false,
      setLocation: (loc) =>
        set((state) => ({
          location: { ...state.location, ...loc },
          isLocationSet: true,
          isLocationModalOpen: false,
        })),
      useCurrentLocation: () => {
        set({ isUsingGPS: true });
        set((state) => ({
          location: { ...state.location, ...DEFAULT_LOCATION },
          isLocationSet: true,
          isLocationModalOpen: false,
        }));
      },
      clearLocation: () =>
        set({
          location: DEFAULT_LOCATION,
          isLocationSet: false,
          isUsingGPS: false,
        }),
      openLocationModal: () => set({ isLocationModalOpen: true }),
      closeLocationModal: () => set({ isLocationModalOpen: false }),
    }),
    {
      name: "location-storage",
      partialize: (state) => ({
        location: state.location,
        isLocationSet: state.isLocationSet,
        isUsingGPS: state.isUsingGPS,
      }),
    }
  )
);
