import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, signup, isLoading } = useAuthStore();
  const [mode, setMode] = useState<"login" | "signup">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-lm-text-primary">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <button onClick={closeAuthModal} className="p-1 rounded-full hover:bg-lm-bg-warm transition-colors">
              <X className="w-5 h-5 text-lm-text-secondary" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lm-text-muted" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-4 bg-lm-bg-warm rounded-xl border border-lm-border-light focus:border-lm-orange outline-none text-sm transition-colors"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lm-text-muted" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-4 bg-lm-bg-warm rounded-xl border border-lm-border-light focus:border-lm-orange outline-none text-sm transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lm-text-muted" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-4 bg-lm-bg-warm rounded-xl border border-lm-border-light focus:border-lm-orange outline-none text-sm transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-lm-orange text-white font-semibold rounded-full hover:bg-lm-orange-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : mode === "login" ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="mt-4 text-center text-sm text-lm-text-secondary">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-lm-orange font-medium hover:underline">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-lm-orange font-medium hover:underline">
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
