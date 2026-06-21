import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, Plus, MessageCircle, User, LogOut, Heart, Package } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
  const { user, logout, openAuthModal } = useAuthStore();
  const { location, openLocationModal } = useLocationStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const unreadCount = 2; // Mock

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-lm-border-light">
      <div className="max-w-7xl mx-auto h-full px-4 lg:px-6 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <MapPin className="w-5 h-5 text-lm-orange" />
          <span className="text-xl font-extrabold text-lm-orange tracking-tight">Relist</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div
            className={`flex items-center w-full h-11 px-4 bg-lm-bg-warm rounded-full border transition-colors duration-200 ${
              isSearchFocused ? "border-lm-orange" : "border-lm-border-light"
            }`}
          >
            <Search className="w-4 h-4 text-lm-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent ml-2.5 text-sm outline-none placeholder:text-lm-text-muted"
            />
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-lm-border-light hover:border-lm-orange transition-colors shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-lm-orange" />
              <span className="text-xs font-medium text-lm-text-secondary truncate max-w-[80px]">
                {location.displayName}
              </span>
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Post Ad Button */}
          <button
            onClick={() => {
              if (user) navigate("/post");
              else openAuthModal("login");
            }}
            className="hidden sm:flex items-center gap-2 h-10 px-5 bg-lm-orange text-white font-semibold text-sm rounded-full hover:bg-lm-orange-hover transition-colors hover:scale-[1.02] duration-200"
          >
            <Plus className="w-4 h-4" />
            Post an Ad
          </button>

          {/* Inbox */}
          <Link
            to="/inbox"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-lm-bg-warm transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-lm-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-lm-danger rounded-full" />
            )}
          </Link>

          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="w-9 h-9 rounded-full border-2 border-lm-border-light overflow-hidden hover:border-lm-orange transition-colors">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-lm-text-muted">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Package className="w-4 h-4 mr-2" /> My Listings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/favorites")}>
                  <Heart className="w-4 h-4 mr-2" /> Saved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-lm-danger">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-lm-bg-warm transition-colors"
            >
              <User className="w-5 h-5 text-lm-text-secondary" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
