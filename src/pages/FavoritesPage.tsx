import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { ListingCard } from "@/components/ListingCard";
import { LISTINGS } from "@/data/listings";

export function FavoritesPage() {
  const { favorites } = useFavoritesStore();

  const savedListings = useMemo(
    () => LISTINGS.filter((l) => favorites.includes(l.id)),
    [favorites]
  );

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-lm-text-primary mb-2">Saved items</h1>
        <p className="text-sm text-lm-text-secondary mb-6">
          {savedListings.length} {savedListings.length === 1 ? "item" : "items"} saved
        </p>
      </motion.div>

      {savedListings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {savedListings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-lm-bg-warm flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-lm-text-muted" />
          </div>
          <h2 className="text-xl font-bold text-lm-text-primary mb-2">Nothing saved yet</h2>
          <p className="text-sm text-lm-text-secondary mb-6 max-w-sm">
            Tap the heart icon on any listing to save it here for later
          </p>
          <Link
            to="/"
            className="h-12 px-6 bg-lm-orange text-white font-semibold rounded-full flex items-center hover:bg-lm-orange-hover transition-colors"
          >
            Browse listings
          </Link>
        </motion.div>
      )}
    </div>
  );
}
