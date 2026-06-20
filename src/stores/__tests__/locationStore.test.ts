import { describe, it, expect, beforeEach } from "vitest";
import { useLocationStore } from "../locationStore";

const DEFAULT_LOCATION = {
  city: "London",
  area: "Hackney",
  lat: 51.5074,
  lng: -0.1278,
  radius: 10,
  displayName: "London",
};

beforeEach(() => {
  localStorage.clear();
  useLocationStore.setState({
    location: DEFAULT_LOCATION,
    isLocationSet: false,
    isUsingGPS: false,
    isLocationModalOpen: false,
  });
});

describe("locationStore – setLocation", () => {
  it("merges a partial location without overwriting other fields", () => {
    useLocationStore.getState().setLocation({ city: "Bristol" });
    const { location } = useLocationStore.getState();
    expect(location.city).toBe("Bristol");
    expect(location.lat).toBe(DEFAULT_LOCATION.lat);
    expect(location.lng).toBe(DEFAULT_LOCATION.lng);
  });

  it("sets isLocationSet to true", () => {
    useLocationStore.getState().setLocation({ city: "Manchester" });
    expect(useLocationStore.getState().isLocationSet).toBe(true);
  });

  it("closes the location modal", () => {
    useLocationStore.setState({ isLocationModalOpen: true });
    useLocationStore.getState().setLocation({ city: "Leeds" });
    expect(useLocationStore.getState().isLocationModalOpen).toBe(false);
  });
});

describe("locationStore – useCurrentLocation", () => {
  it("sets isUsingGPS to true", () => {
    useLocationStore.getState().useCurrentLocation();
    expect(useLocationStore.getState().isUsingGPS).toBe(true);
  });

  it("sets isLocationSet to true", () => {
    useLocationStore.getState().useCurrentLocation();
    expect(useLocationStore.getState().isLocationSet).toBe(true);
  });

  it("closes the location modal", () => {
    useLocationStore.setState({ isLocationModalOpen: true });
    useLocationStore.getState().useCurrentLocation();
    expect(useLocationStore.getState().isLocationModalOpen).toBe(false);
  });
});

describe("locationStore – clearLocation", () => {
  it("resets location to the default", () => {
    useLocationStore.getState().setLocation({ city: "Glasgow" });
    useLocationStore.getState().clearLocation();
    expect(useLocationStore.getState().location.city).toBe(DEFAULT_LOCATION.city);
  });

  it("sets isLocationSet back to false", () => {
    useLocationStore.getState().setLocation({ city: "Glasgow" });
    useLocationStore.getState().clearLocation();
    expect(useLocationStore.getState().isLocationSet).toBe(false);
  });

  it("sets isUsingGPS back to false", () => {
    useLocationStore.getState().useCurrentLocation();
    useLocationStore.getState().clearLocation();
    expect(useLocationStore.getState().isUsingGPS).toBe(false);
  });
});

describe("locationStore – modal", () => {
  it("openLocationModal sets isLocationModalOpen to true", () => {
    useLocationStore.getState().openLocationModal();
    expect(useLocationStore.getState().isLocationModalOpen).toBe(true);
  });

  it("closeLocationModal sets isLocationModalOpen to false", () => {
    useLocationStore.setState({ isLocationModalOpen: true });
    useLocationStore.getState().closeLocationModal();
    expect(useLocationStore.getState().isLocationModalOpen).toBe(false);
  });
});
