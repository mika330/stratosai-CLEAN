import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Package, Heart, MessageSquare, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ListingCard } from "@/components/ListingCard";
import { LISTINGS } from "@/data/listings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("listings");

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-lm-text-primary mb-2">Sign in to view your profile</h2>
        <p className="text-lm-text-secondary">You need to be logged in to see your listings and saved items.</p>
      </div>
    );
  }

  const myListings = LISTINGS.filter((l) => l.seller.id === "seller_0").slice(0, 6);
  const reviews = [
    { id: 1, name: "Sarah W.", rating: 5, text: "Great seller, item exactly as described. Fast response too!", date: "2 weeks ago" },
    { id: 2, name: "James B.", rating: 5, text: "Smooth transaction. Would definitely buy from again.", date: "1 month ago" },
    { id: 3, name: "Emily D.", rating: 4, text: "Good communication, fair price. Recommended seller.", date: "2 months ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-lm-border-light p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-lm-border-light"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.verified && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-lm-green bg-lm-green/10 px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-lm-text-secondary">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                London
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Member since 2024
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-sm">4.8</span>
              <span className="text-sm text-lm-text-muted">(23 reviews)</span>
              <span className="text-sm text-lm-text-muted">·</span>
              <span className="text-sm text-lm-text-muted">Responds &lt; 1 hour</span>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-lm-bg-warm transition-colors">
            <Settings className="w-5 h-5 text-lm-text-secondary" />
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-white border border-lm-border-light rounded-xl p-1 mb-6">
          <TabsTrigger value="listings" className="flex-1 rounded-lg data-[state=active]:bg-lm-orange data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-1.5" />
            My Listings
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 rounded-lg data-[state=active]:bg-lm-orange data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4 mr-1.5" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1 rounded-lg data-[state=active]:bg-lm-orange data-[state=active]:text-white">
            <Heart className="w-4 h-4 mr-1.5" />
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {myListings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-lm-text-muted mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-lm-text-primary mb-1">No listings yet</h3>
              <p className="text-sm text-lm-text-secondary">Post your first ad to start selling</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-lm-border-light p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.name}</span>
                  <span className="text-xs text-lm-text-muted">· {review.date}</span>
                </div>
                <p className="text-sm text-lm-text-secondary">{review.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-lm-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-lm-text-primary mb-1">Nothing saved yet</h3>
            <p className="text-sm text-lm-text-secondary">Browse listings and save your favourites</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
