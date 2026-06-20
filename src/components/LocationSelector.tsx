import { MapPin, X, Navigation } from "lucide-react";
import { useState } from "react";
import { useLocationStore } from "@/stores/locationStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const POPULAR_LOCATIONS = [
  { city: "London", area: "Central", lat: 51.5074, lng: -0.1278 },
  { city: "Manchester", area: "Central", lat: 53.4808, lng: -2.2426 },
  { city: "Birmingham", area: "Central", lat: 52.4862, lng: -1.8904 },
  { city: "Glasgow", area: "Central", lat: 55.8609, lng: -4.2514 },
  { city: "Leeds", area: "Central", lat: 53.8008, lng: -1.5491 },
  { city: "Bristol", area: "Central", lat: 51.4545, lng: -2.5879 },
];

export function LocationSelector() {
  const { isLocationModalOpen, closeLocationModal, setLocation, isLocationSet } = useLocationStore();
  const [search, setSearch] = useState("");

  const filtered = POPULAR_LOCATIONS.filter((l) =>
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (loc: typeof POPULAR_LOCATIONS[0]) => {
    setLocation({
      city: loc.city,
      area: loc.area,
      lat: loc.lat,
      lng: loc.lng,
      displayName: loc.city,
    });
    setSearch("");
  };

  return (
    <Dialog open={isLocationModalOpen || !isLocationSet} onOpenChange={(open) => {
      if (isLocationSet && !open) closeLocationModal();
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-lm-text-primary">Choose Location</h2>
            {isLocationSet && (
              <button onClick={closeLocationModal} className="p-1 rounded-full hover:bg-lm-bg-warm transition-colors">
                <X className="w-5 h-5 text-lm-text-secondary" />
              </button>
            )}
          </div>

          <div className="relative mb-4">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lm-text-muted" />
            <input
              type="text"
              placeholder="Search city or postcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-lm-bg-warm rounded-xl border border-lm-border-light focus:border-lm-orange outline-none text-sm transition-colors"
              autoFocus
            />
          </div>

          <button className="flex items-center gap-2 w-full h-11 px-3 mb-4 text-lm-orange font-medium text-sm rounded-xl hover:bg-lm-orange/5 transition-colors">
            <Navigation className="w-4 h-4" />
            Use current location
          </button>

          <p className="text-xs font-medium text-lm-text-muted uppercase tracking-wide mb-2">Popular locations</p>
          <div className="space-y-1">
            {filtered.map((loc) => (
              <button
                key={loc.city}
                onClick={() => handleSelect(loc)}
                className="flex items-center justify-between w-full h-11 px-3 rounded-xl hover:bg-lm-bg-warm transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-lm-text-muted" />
                  <span className="text-sm font-medium text-lm-text-primary">{loc.city}</span>
                </div>
                <svg className="w-4 h-4 text-lm-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
