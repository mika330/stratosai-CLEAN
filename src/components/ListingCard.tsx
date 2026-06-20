import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Listing } from "@/data/listings";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const favorited = isFavorite(listing.id);

  const priceDisplay =
    listing.priceType === "free"
      ? "Free"
      : listing.priceType === "swap"
      ? "Swap"
      : `£${listing.price.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/listing/${listing.id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white rounded-xl border border-lm-border-light overflow-hidden cursor-pointer hover:shadow-card-hover hover:border-gray-300 transition-shadow duration-250"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer bg-[length:200%_100%]" />
            )}
            <img
              src={listing.images[0]}
              alt={listing.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(listing.id);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${favorited ? "text-lm-danger fill-lm-danger" : "text-lm-text-secondary"}`}
              />
            </button>

            {/* Featured badge */}
            {listing.isFeatured && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-gradient-to-r from-lm-orange to-orange-400 rounded">
                FEATURED
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <p className="text-lg font-bold text-lm-text-primary">{priceDisplay}</p>
            <p className="text-sm text-lm-text-primary line-clamp-2 mt-0.5 leading-snug">{listing.title}</p>
            <div className="flex items-center gap-1 mt-2 text-lm-text-secondary">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">
                {listing.location.city} · {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
              </span>
            </div>
            {listing.seller.verified && (
              <span className="inline-flex items-center gap-0.5 mt-1.5 text-[11px] font-medium text-lm-green">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
