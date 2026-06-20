import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { AuthModal } from "./AuthModal";
import { LocationSelector } from "./LocationSelector";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hideNav = location.pathname === "/post";

  return (
    <div className="min-h-[100dvh] bg-lm-bg-warm">
      {!hideNav && <TopNav />}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`${!hideNav ? "pt-16" : ""} pb-16 lg:pb-0`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!hideNav && <BottomNav />}
      <AuthModal />
      <LocationSelector />
    </div>
  );
}
