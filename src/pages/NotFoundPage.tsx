import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-lm-orange mb-4">404</h1>
      <h2 className="text-2xl font-bold text-lm-text-primary mb-2">Page not found</h2>
      <p className="text-lm-text-secondary mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 h-12 px-6 bg-lm-orange text-white font-semibold rounded-full hover:bg-lm-orange-hover transition-colors"
      >
        <Home className="w-5 h-5" />
        Back to home
      </Link>
    </div>
  );
}
