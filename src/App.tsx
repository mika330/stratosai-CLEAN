import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/pages/HomePage";
import { SearchPage } from "@/pages/SearchPage";
import { ListingDetailPage } from "@/pages/ListingDetailPage";
import { PostListingPage } from "@/pages/PostListingPage";
import { InboxPage } from "@/pages/InboxPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/post" element={<PostListingPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "border-l-4",
          style: {
            background: "#1A1A1A",
            color: "#fff",
            border: "none",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
