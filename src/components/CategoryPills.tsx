import { useNavigate } from "react-router-dom";
import {
  LayoutGrid, Car, Sofa, Smartphone, Shirt, Bike, Briefcase, Home as HomeIcon, Dog, Gift, Wrench, Users
} from "lucide-react";

const categories = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "cars", label: "Cars & Vehicles", icon: Car },
  { key: "home", label: "Home & Garden", icon: Sofa },
  { key: "electronics", label: "Electronics", icon: Smartphone },
  { key: "fashion", label: "Fashion", icon: Shirt },
  { key: "sports", label: "Sports", icon: Bike },
  { key: "services", label: "Services", icon: Briefcase },
  { key: "property", label: "Property", icon: HomeIcon },
  { key: "pets", label: "Pets", icon: Dog },
  { key: "free", label: "Free Stuff", icon: Gift },
  { key: "jobs", label: "Jobs", icon: Wrench },
  { key: "community", label: "Community", icon: Users },
];

const accentColors: Record<string, string> = {
  cars: "text-blue-600",
  home: "text-green-600",
  electronics: "text-orange-500",
  fashion: "text-red-600",
  sports: "text-teal-600",
  services: "text-purple-600",
  property: "text-amber-800",
  pets: "text-pink-600",
  free: "text-emerald-600",
  jobs: "text-gray-600",
  community: "text-indigo-600",
};

interface CategoryPillsProps {
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
  variant?: "pills" | "cards";
}

export function CategoryPills({ activeCategory = "all", onCategoryChange, variant = "pills" }: CategoryPillsProps) {
  const navigate = useNavigate();

  const handleClick = (key: string) => {
    if (onCategoryChange) {
      onCategoryChange(key);
    } else {
      navigate(`/search?category=${key}`);
    }
  };

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
        {categories.filter((c) => c.key !== "all").slice(0, 8).map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => handleClick(cat.key)}
              className="flex flex-col items-center justify-center h-24 md:h-28 rounded-2xl bg-white border border-lm-border-light hover:shadow-md hover:scale-[1.03] transition-all duration-200"
            >
              <Icon className={`w-8 h-8 mb-2 ${accentColors[cat.key] || "text-gray-500"}`} />
              <span className="text-xs font-medium text-lm-text-primary text-center leading-tight px-1">{cat.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => handleClick(cat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
              isActive
                ? "bg-lm-orange text-white border-lm-orange"
                : "bg-white text-lm-text-secondary border-lm-border-light hover:border-lm-orange hover:text-lm-orange"
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
