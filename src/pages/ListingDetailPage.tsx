import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, Share2, Flag, MapPin, Clock, Eye, ChevronLeft,
  Shield, MessageCircle, Tag, Star
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { LISTINGS } from "@/data/listings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuthStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [messageText, setMessageText] = useState("");

  const listing = LISTINGS.find((l) => l.id === id);
  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-lm-text-primary mb-2">Listing not found</h2>
        <p className="text-lm-text-secondary mb-4">The listing you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/")} className="text-lm-orange font-medium hover:underline">
          Back to homepage
        </button>
      </div>
    );
  }

  const favorited = isFavorite(listing.id);
  const conditionLabel =
    listing.condition === "new" ? "New" :
    listing.condition === "used_like_new" ? "Used - Like New" :
    listing.condition === "used_good" ? "Used - Good" : "Used - Fair";

  const priceDisplay =
    listing.priceType === "free" ? "Free" :
    listing.priceType === "swap" ? "Swap" :
    `£${listing.price.toLocaleString()}`;

  const handleSendMessage = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setMessageModalOpen(true);
  };

  const handleMakeOffer = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setOfferModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-lm-text-secondary hover:text-lm-text-primary mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Image Gallery */}
          <div className="relative aspect-video lg:aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={listing.images[lightboxIndex]}
              alt={listing.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            />
            {listing.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {listing.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    i === lightboxIndex ? "border-lm-orange" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Price & Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-lm-text-primary">{priceDisplay}</h1>
            <h2 className="text-lg font-semibold text-lm-text-primary mt-1">{listing.title}</h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-lm-text-secondary">
              <MapPin className="w-4 h-4" />
              <span>{listing.location.city}, {listing.location.area}</span>
              <span>·</span>
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</span>
              <span>·</span>
              <Eye className="w-4 h-4" />
              <span>{listing.views} views</span>
            </div>
          </div>

          {/* Condition badge */}
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-lm-bg-warm border border-lm-border-light rounded-full text-sm font-medium text-lm-text-secondary mb-4">
            {conditionLabel}
          </span>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-lm-text-primary mb-2">Description</h3>
            <p className="text-sm text-lm-text-secondary leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Seller info */}
          <div className="bg-white rounded-xl border border-lm-border-light p-4 mb-6">
            <div className="flex items-start gap-3">
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{listing.seller.name}</h4>
                  {listing.seller.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-lm-green">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">{listing.seller.rating}</span>
                  <span className="text-xs text-lm-text-muted">({listing.seller.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-lm-text-muted">
                  <span>Member since {listing.seller.memberSince}</span>
                  <span>·</span>
                  <span>Responds {listing.seller.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <h4 className="font-semibold text-sm text-amber-800">Safety tips</h4>
            </div>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>Meet in a public place</li>
              <li>Inspect the item before paying</li>
              <li>Never pay in advance</li>
              <li>Trust your instincts</li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Sticky Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:sticky lg:top-20 h-fit space-y-3"
        >
          <div className="bg-white rounded-xl border border-lm-border-light p-4 space-y-3">
            <button
              onClick={handleSendMessage}
              className="w-full h-12 bg-lm-orange text-white font-semibold rounded-full hover:bg-lm-orange-hover transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Message seller
            </button>

            {listing.priceType !== "free" && listing.priceType !== "swap" && (
              <button
                onClick={handleMakeOffer}
                className="w-full h-12 border-2 border-lm-orange text-lm-orange font-semibold rounded-full hover:bg-lm-orange/5 transition-colors flex items-center justify-center gap-2"
              >
                <Tag className="w-5 h-5" />
                Make an offer
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(listing.id)}
                className={`flex-1 h-10 border rounded-full flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
                  favorited
                    ? "border-lm-danger text-lm-danger bg-lm-danger/5"
                    : "border-lm-border-light text-lm-text-secondary hover:border-lm-text-secondary"
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? "fill-lm-danger" : ""}`} />
                {favorited ? "Saved" : "Save"}
              </button>
              <button className="flex-1 h-10 border border-lm-border-light rounded-full flex items-center justify-center gap-1.5 text-sm font-medium text-lm-text-secondary hover:border-lm-text-secondary transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            <button className="w-full h-9 text-xs text-lm-danger hover:underline flex items-center justify-center gap-1">
              <Flag className="w-3.5 h-3.5" />
              Report this listing
            </button>
          </div>

          {/* Price info */}
          <div className="bg-lm-bg-warm rounded-xl p-4">
            <p className="text-xs text-lm-text-muted mb-1">Price</p>
            <p className="text-2xl font-extrabold text-lm-text-primary">{priceDisplay}</p>
            {listing.priceType === "negotiable" && (
              <p className="text-xs text-lm-green font-medium mt-1">Open to offers</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-lm-border-light flex items-center gap-2 px-3 lg:hidden z-40">
        <button
          onClick={() => toggleFavorite(listing.id)}
          className={`w-12 h-12 rounded-full border flex items-center justify-center ${
            favorited ? "border-lm-danger text-lm-danger" : "border-lm-border-light text-lm-text-secondary"
          }`}
        >
          <Heart className={`w-5 h-5 ${favorited ? "fill-lm-danger" : ""}`} />
        </button>
        <button
          onClick={handleSendMessage}
          className="flex-1 h-12 bg-lm-orange text-white font-semibold rounded-full flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Message
        </button>
        {listing.priceType !== "free" && listing.priceType !== "swap" && (
          <button
            onClick={handleMakeOffer}
            className="h-12 px-4 border-2 border-lm-orange text-lm-orange font-semibold rounded-full"
          >
            Offer
          </button>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <img
            src={listing.images[lightboxIndex]}
            alt={listing.title}
            className="w-full max-h-[80vh] object-contain"
          />
          {listing.images.length > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${
                    i === lightboxIndex ? "border-lm-orange" : "border-white/30"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {listing.seller.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-lm-text-muted mb-3">About: {listing.title}</p>
            <Textarea
              placeholder="Hi! Is this still available?"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[100px]"
            />
            <button
              onClick={() => {
                setMessageModalOpen(false);
                setMessageText("");
                navigate("/inbox");
              }}
              className="w-full h-12 mt-3 bg-lm-orange text-white font-semibold rounded-full hover:bg-lm-orange-hover transition-colors"
            >
              Send Message
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Offer Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make an offer</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-lm-text-muted mb-3">Listed price: {priceDisplay}</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-lm-text-primary">£</span>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="Enter your offer"
                className="w-full h-14 pl-10 pr-4 text-xl font-bold bg-lm-bg-warm rounded-xl border border-lm-border-light focus:border-lm-orange outline-none transition-colors"
                autoFocus
              />
            </div>
            <button
              onClick={() => {
                setOfferModalOpen(false);
                setOfferAmount("");
                navigate("/inbox");
              }}
              className="w-full h-12 mt-4 bg-lm-orange text-white font-semibold rounded-full hover:bg-lm-orange-hover transition-colors"
            >
              Send Offer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
