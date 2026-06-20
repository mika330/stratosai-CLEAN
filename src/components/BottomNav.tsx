import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Browse", path: "/search" },
  { icon: PlusCircle, label: "Post", path: "/post", isCenter: true },
  { icon: MessageCircle, label: "Inbox", path: "/inbox" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();
  const { user, openAuthModal } = useAuthStore();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-lm-border-light lg:hidden">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path));
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={user ? item.path : "#"}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    openAuthModal("login");
                  }
                }}
                className="flex items-center justify-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-lm-orange flex items-center justify-center shadow-lg hover:bg-lm-orange-hover transition-colors active:scale-95">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${
                isActive ? "text-lm-orange" : "text-lm-text-secondary"
              }`}
            >
              <Icon className="w-6 h-6" fill={isActive ? "currentColor" : "none"} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
