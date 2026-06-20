import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Camera, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { useLocationStore } from "@/stores/locationStore";
import {
  Car, Sofa, Smartphone, Shirt, Bike, Briefcase, Home as HomeIcon, Dog, Gift, Wrench, Users
} from "lucide-react";

const categories = [
  { key: "cars", label: "Cars & Vehicles", icon: Car, fields: ["year", "mileage", "fuel", "transmission"] },
  { key: "home", label: "Home & Garden", icon: Sofa, fields: ["dimensions", "material", "colour"] },
  { key: "electronics", label: "Electronics", icon: Smartphone, fields: ["brand", "model", "age"] },
  { key: "fashion", label: "Fashion", icon: Shirt, fields: ["size", "brand", "colour"] },
  { key: "sports", label: "Sports & Leisure", icon: Bike, fields: ["condition_details", "size"] },
  { key: "services", label: "Services", icon: Briefcase, fields: ["service_type", "experience"] },
  { key: "property", label: "Property", icon: HomeIcon, fields: ["bedrooms", "bathrooms", "property_type"] },
  { key: "pets", label: "Pets", icon: Dog, fields: ["breed", "age", "health"] },
  { key: "free", label: "Free Stuff", icon: Gift, fields: ["reason"] },
  { key: "jobs", label: "Jobs", icon: Wrench, fields: ["job_type", "salary"] },
  { key: "community", label: "Community", icon: Users, fields: ["event_type"] },
];

const conditions = [
  { key: "new", label: "New" },
  { key: "used_like_new", label: "Like New" },
  { key: "used_good", label: "Good" },
  { key: "used_fair", label: "Fair" },
];

export function PostListingPage() {
  const navigate = useNavigate();
  const { location } = useLocationStore();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<"fixed" | "negotiable" | "free" | "swap">("fixed");
  const [condition, setCondition] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const selectedCategory = categories.find((c) => c.key === category);
  const totalSteps = 5;

  const handlePhotoUpload = () => {
    const sampleImages = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
    ];
    if (photos.length < 10) {
      setPhotos((prev) => [...prev, sampleImages[Math.floor(Math.random() * sampleImages.length)]]);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Your ad has been posted successfully!");
    navigate("/");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!category;
      case 2: return title.length >= 5 && description.length >= 20 && (priceType === "free" || priceType === "swap" || !!price) && !!condition;
      case 3: return true;
      case 4: return true;
      default: return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/")}
          className="p-2 rounded-full hover:bg-lm-bg-warm transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Post an Ad</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => s < step && setStep(s)}
              disabled={s >= step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                s < step
                  ? "bg-lm-orange text-white"
                  : s === step
                  ? "bg-lm-orange text-white ring-4 ring-lm-orange/20"
                  : "bg-lm-bg-warm text-lm-text-muted border border-lm-border-light"
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </button>
            {s < totalSteps && (
              <div className={`flex-1 h-0.5 mx-2 ${s < step ? "bg-lm-orange" : "bg-lm-border-light"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Category */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-1">What are you selling?</h2>
            <p className="text-sm text-lm-text-muted mb-6">Choose a category for your listing</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      category === cat.key
                        ? "border-lm-orange bg-lm-orange/5"
                        : "border-lm-border-light hover:border-lm-orange/50"
                    }`}
                  >
                    <Icon className="w-8 h-8 text-lm-text-secondary" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-1">Add details</h2>
            <p className="text-sm text-lm-text-muted mb-4">Tell buyers about your item</p>

            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling? Be specific."
                maxLength={70}
                className="w-full h-12 px-4 bg-white border border-lm-border-light rounded-xl focus:border-lm-orange outline-none text-sm transition-colors"
              />
              <p className="text-xs text-lm-text-muted mt-1 text-right">{title.length}/70</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item — condition, features, why you're selling."
                maxLength={2000}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-lm-border-light rounded-xl focus:border-lm-orange outline-none text-sm transition-colors resize-none"
              />
              <p className="text-xs text-lm-text-muted mt-1 text-right">{description.length}/2000</p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Price</label>
              <div className="flex gap-2 mb-3">
                {(["fixed", "negotiable", "free", "swap"] as const).map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setPriceType(pt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      priceType === pt
                        ? "bg-lm-orange text-white border-lm-orange"
                        : "bg-white text-lm-text-secondary border-lm-border-light hover:border-lm-orange"
                    }`}
                  >
                    {pt.charAt(0).toUpperCase() + pt.slice(1)}
                  </button>
                ))}
              </div>
              {priceType !== "free" && priceType !== "swap" && (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold">£</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full h-12 pl-10 pr-4 bg-white border border-lm-border-light rounded-xl focus:border-lm-orange outline-none text-sm transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <div className="grid grid-cols-2 gap-2">
                {conditions.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCondition(c.key)}
                    className={`h-12 rounded-xl border-2 text-sm font-medium transition-colors ${
                      condition === c.key
                        ? "border-lm-orange bg-lm-orange/5 text-lm-orange"
                        : "border-lm-border-light text-lm-text-secondary hover:border-lm-orange/50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category-specific fields */}
            {selectedCategory && selectedCategory.fields.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">{selectedCategory.label} details</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCategory.fields.map((field) => (
                    <div key={field}>
                      <label className="block text-xs text-lm-text-muted mb-1 capitalize">{field.replace("_", " ")}</label>
                      <input
                        type="text"
                        placeholder={`Enter ${field.replace("_", " ")}`}
                        className="w-full h-10 px-3 bg-white border border-lm-border-light rounded-lg focus:border-lm-orange outline-none text-sm transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-1">Add photos</h2>
            <p className="text-sm text-lm-text-muted mb-6">Add up to 10 photos</p>

            <button
              onClick={handlePhotoUpload}
              className="w-full h-40 border-2 border-dashed border-lm-border-light rounded-xl flex flex-col items-center justify-center gap-2 hover:border-lm-orange hover:bg-lm-orange/5 transition-colors mb-4"
            >
              <Camera className="w-8 h-8 text-lm-text-muted" />
              <span className="text-sm text-lm-text-secondary">Click to upload photos</span>
            </button>

            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-lm-orange text-white text-[10px] font-semibold rounded">
                        Cover
                      </span>
                    )}
                    <button
                      onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-1">Set location</h2>
            <p className="text-sm text-lm-text-muted mb-6">Where is your item located?</p>

            <button className="flex items-center gap-2 w-full h-12 px-4 mb-4 text-lm-orange font-medium text-sm rounded-xl border border-lm-orange/20 bg-lm-orange/5 hover:bg-lm-orange/10 transition-colors">
              <MapPin className="w-4 h-4" />
              Use my current location
            </button>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <input
                  type="text"
                  defaultValue={location.city}
                  className="w-full h-12 px-4 bg-white border border-lm-border-light rounded-xl focus:border-lm-orange outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Area / Postcode</label>
                <input
                  type="text"
                  defaultValue={location.area}
                  className="w-full h-12 px-4 bg-white border border-lm-border-light rounded-xl focus:border-lm-orange outline-none text-sm transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-1">Review & post</h2>
            <p className="text-sm text-lm-text-muted mb-6">Preview your listing before posting</p>

            <div className="bg-white rounded-xl border border-lm-border-light p-4 mb-6">
              {photos.length > 0 && (
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gray-100">
                  <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-2xl font-bold text-lm-text-primary">
                {priceType === "free" ? "Free" : priceType === "swap" ? "Swap" : `£${price}`}
              </p>
              <p className="text-sm text-lm-text-primary mt-1">{title}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-lm-text-secondary">
                <MapPin className="w-3 h-3" />
                {location.city}
              </div>
            </div>

            <button
              onClick={handlePost}
              disabled={isPosting}
              className="w-full h-14 bg-lm-orange text-white font-semibold text-lg rounded-full hover:bg-lm-orange-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPosting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                "Post my ad"
              )}
            </button>
            <p className="text-center text-xs text-lm-text-muted mt-3">Free to post · Takes less than 2 minutes</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 h-12 border border-lm-border-light rounded-full text-sm font-medium hover:border-lm-text-secondary transition-colors"
          >
            Back
          </button>
        )}
        {step < totalSteps && (
          <button
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 h-12 bg-lm-orange text-white font-semibold rounded-full hover:bg-lm-orange-hover transition-colors disabled:opacity-40 disabled:hover:bg-lm-orange"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
