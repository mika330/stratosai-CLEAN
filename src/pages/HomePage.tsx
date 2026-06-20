import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Plus } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { ListingCard } from "@/components/ListingCard";
import { CategoryPills } from "@/components/CategoryPills";
import { LISTINGS } from "@/data/listings";

export function HomePage() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuthStore();
  const { location } = useLocationStore();

  const featuredListings = LISTINGS.filter((l) => l.isFeatured).slice(0, 3);
  const regularListings = LISTINGS.filter((l) => !l.isFeatured).slice(0, 12);
  const spotlightListings = LISTINGS.filter((l) => l.isPromoted).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 space-y-8">
      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 py-2 text-xs text-lm-text-secondary"
      >
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          600K+ daily active users
        </span>
        <span>·</span>
        <span>30K+ new ads daily</span>
        <span>·</span>
        <span>Free to post</span>
      </motion.div>

      {/* Category Pills */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <CategoryPills />
      </motion.section>

      {/* Popular Categories Grid */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-bold text-lm-text-primary mb-4">Discover popular categories</h2>
        <CategoryPills variant="cards" />
      </motion.section>

      {/* Spotlight Section */}
      {spotlightListings.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xl font-bold text-lm-text-primary mb-4">Spotlight</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
            {spotlightListings.map((listing, i) => (
              <div key={listing.id} className="w-[85%] md:w-[45%] lg:w-[32%] shrink-0 snap-start">
                <ListingCard listing={listing} index={i} />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Main Listings Feed */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-lm-text-primary mb-4">
          Discover more good finds in {location.displayName}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {featuredListings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
          {regularListings.slice(0, 8).map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i + featuredListings.length} />
          ))}
        </div>
      </motion.section>

      {/* Sell CTA Banner */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-gradient-to-r from-lm-orange to-orange-400 p-6 md:p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-1">Got something to sell?</h3>
        <p className="text-white/80 mb-4">It's free and takes less than 2 minutes</p>
        <button
          onClick={() => {
            if (user) navigate("/post");
            else openAuthModal("login");
          }}
          className="inline-flex items-center gap-2 h-12 px-6 bg-white text-lm-orange font-semibold rounded-full hover:bg-white/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Post an Ad
        </button>
      </motion.section>

      {/* More Listings */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {regularListings.slice(8).map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i + 8 + featuredListings.length} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
