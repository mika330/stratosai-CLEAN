# Tech Spec — LocalMart (Gumtree-Style Classifieds Web App)

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0 | UI framework |
| `react-dom` | ^19.0 | React DOM renderer |
| `react-router-dom` | ^7.1 | Client-side routing (7 pages) |
| `@tanstack/react-query` | ^5.66 | Server-state management + caching + infinite scroll |
| `zustand` | ^5.0 | Lightweight client state (auth, location, favorites, drafts) |
| `clsx` | ^2.1 | Conditional className construction |
| `tailwind-merge` | ^3.0 | Tailwind class deduplication (used by cn() utility) |
| `class-variance-authority` | ^0.7 | Component variant API (shadcn dependency) |
| `@radix-ui/react-dialog` | ^1.1 | Accessible modal primitive (shadcn Dialog) |
| `@radix-ui/react-dropdown-menu` | ^2.1 | Nav user menu, share menu |
| `@radix-ui/react-tabs` | ^1.1 | Profile page tabs |
| `@radix-ui/react-accordion` | ^1.2 | Safety tips, browse-by-category collapsible |
| `@radix-ui/react-slider` | ^1.2 | Price range, distance filter sliders |
| `@radix-ui/react-checkbox` | ^1.1 | Filter checkboxes (condition, seller type) |
| `@radix-ui/react-radio-group` | ^1.2 | Condition selector, date posted filter |
| `@radix-ui/react-scroll-area` | ^1.1 | Scrollable conversation list, filter sidebar |
| `@radix-ui/react-separator` | ^1.1 | Dividers |
| `@radix-ui/react-visually-hidden` | ^1.1 | Screen-reader-only labels |
| `lucide-react` | ^0.468 | All icons (tree-shakeable, 42+ icons used) |
| `framer-motion` | ^12.4 | Page transitions, card entrance animations, modal/sheet animations, lightbox, staggered reveals |
| `react-hook-form` | ^7.54 | Multi-step listing creation form validation |
| `@hookform/resolvers` | ^4.0 | Zod resolver for react-hook-form |
| `zod` | ^3.25 | Schema validation (listing form, auth forms, offer input) |
| `sonner` | ^1.7 | Toast notifications (bottom-center mobile, top-right desktop) |
| `date-fns` | ^4.1 | Relative timestamps ("16 days ago"), date formatting |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.2 | Build tool |
| `@vitejs/plugin-react` | ^4.4 | React Fast Refresh + JSX transform |
| `tailwindcss` | ^4.1 | Utility-first CSS |
| `@tailwindcss/vite` | ^4.1 | Tailwind Vite plugin |
| `typescript` | ^5.8 | Type checking |
| `@types/react` | ^19.0 | React type definitions |
| `@types/react-dom` | ^19.0 | ReactDOM type definitions |
| `eslint` | ^9.22 | Linting |
| `@eslint/js` | ^9.22 | ESLint JS config |
| `typescript-eslint` | ^8.26 | TypeScript ESLint parser + plugin |
| `eslint-plugin-react-hooks` | ^5.2 | React Hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.4 | React Refresh lint rules |

---

## Component Inventory

### Layout (shared across pages)

| Component | Source | Notes |
|-----------|--------|-------|
| `TopNav` | Custom | Sticky 64px bar. Contains Logo, SearchBar (with LocationPill), PostAdButton, InboxIcon, UserAvatar+Dropdown. Desktop only (≥1024px). |
| `BottomNav` | Custom | Fixed 64px mobile tab bar. 5 tabs. Scroll-direction aware (hides on scroll-down, shows on scroll-up). Mobile only (<1024px). |
| `AppShell` | Custom | Wraps all routes. Renders TopNav + BottomNav conditionally. Hosts Outlet for page content. Manages page-transition wrapper. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| `ListingCard` | Custom | Homepage, SearchResults, Favorites, Profile(My Listings), PostListing(review step) | Core card: 4:3 image area, price, title, metadata, favorite heart, featured badge. Hover lift+shadow animation. |
| `CategoryPills` | Custom | Homepage | Horizontal scrollable row of 12 category filter pills. Active state changes color. |
| `CategoryCard` | Custom | Homepage grid | Large category card (120px, tinted bg, 40px icon, name). |
| `ListingSkeleton` | Custom | Homepage, SearchResults, Favorites | Shimmer skeleton mirroring ListingCard layout (image + 3 text lines). |
| `LocationSelector` | Custom | TopNav, PostListing(Step 4) | Modal on desktop, full-screen bottom sheet on mobile. Search + popular locations list + "Use current location". |
| `FilterSidebar` | Custom | SearchResults | Desktop sticky sidebar (280px). Contains CategoryTree, PriceRangeSlider, ConditionCheckboxes, DistanceSlider, DatePostedRadio, SellerTypeCheckboxes. |
| `FilterBottomSheet` | Custom | SearchResults | Mobile: slides up from bottom (80vh). Same filter content as sidebar. |
| `SortDropdown` | Custom | SearchResults | Dropdown select for sort options. |
| `SearchDropdown` | Custom | TopNav(search bar) | Appears below search on focus. Shows recent searches (localStorage) + trending. Max 5 items. |
| `ImageGallery` | Custom | ListingDetail | Horizontal scrollable thumbnails + click-to-lightbox. |
| `ImageLightbox` | Custom | ListingDetail, ImageGallery | Fullscreen overlay. Image scale-up animation. Prev/next arrows. Touch swipe on mobile. Escape/click-backdrop to close. |
| `ChatConversation` | Custom | Inbox(conversation list row) | Row: listing thumbnail, title, last message preview, timestamp, unread badge. Swipe-to-delete on mobile. |
| `ChatMessage` | Custom | Inbox(chat detail) | Sent/right (primary bg) vs received/left (surface+border) bubbles. Offer variant with Accept/Decline/Counter buttons. System message variant (centered muted). |
| `ChatInput` | Custom | Inbox(chat detail) | Fixed bottom. Auto-expanding textarea (max 4 lines) + image attach + send button. |
| `OfferModal` | Custom | ListingDetail | Shown on "Make an offer". Price input + "Send offer" button. |
| `AuthModal` | Custom | Triggered by login-required actions | Centered card with Login ↔ SignUp toggle (cross-fade). Email/password/social login. |
| `EmptyState` | Custom | Inbox, Favorites, My Listings | Illustration + heading + description + optional CTA button. |
| `StarRating` | Custom | ListingDetail(seller), Profile | Display-only 5-star rating with numeric value and review count. |
| `StepIndicator` | Custom | PostListing | 5-step horizontal progress. Completed (primary+checkmark), current (primary+number), upcoming (border+gray). Click completed to go back. |
| `StickyActionBar` | Custom | ListingDetail(mobile) | Fixed bottom bar: save heart, "Message" primary button, "Make offer" outlined. |
| `ToastProvider` | sonner | Global | Wrapped in AppShell. Position: bottom-center mobile, top-right desktop. Custom styled with colored left-border per type. |

### shadcn/ui Components (installed via CLI, styled with design tokens)

| Component | Usage | Customization |
|-----------|-------|---------------|
| `Dialog` | LocationSelector, OfferModal, AuthModal, confirmation dialogs | Custom border-radius (--radius-lg), custom backdrop overlay |
| `DropdownMenu` | TopNav user avatar menu, Share menu | Standard shadcn styling with design token colors |
| `Tabs` | Profile page (My Listings / Reviews / Saved) | Custom active indicator color (--color-primary) |
| `Accordion` | Safety tips on ListingDetail, Browse-by-category on Homepage | Custom chevron animation |
| `Slider` | Price range dual-handle, Distance filter | Custom track/fill colors (--color-primary) |
| `Checkbox` | Condition filter, Seller type filter | Custom checked state color |
| `RadioGroup` | Condition selector in PostListing, Date posted filter | Custom selected indicator color |
| `ScrollArea` | Conversation list in Inbox, FilterSidebar content | Custom scrollbar styling |
| `Separator` | Various dividers throughout | Uses --color-border |

### Page Sections

| Section | Page | Notes |
|---------|------|-------|
| `HeroSection` | Homepage | Stats bar + category pills. No traditional hero image. |
| `CategoryGridSection` | Homepage | 4×2 grid of CategoryCards. |
| `ListingsFeedSection` | Homepage | "Discover more good finds" — 4×2 grid of ListingCards. |
| `SpotlightCarousel` | Homepage | Horizontal auto-scrolling carousel of 2–3 featured listings. 5s interval, pause on hover. |
| `SellCtaBanner` | Homepage | Full-width gradient banner: "Got something to sell?" + PostAd button. |
| `BrowseByCategorySection` | Homepage | Accordion list of categories with subcategories. |
| `BreadcrumbSummary` | SearchResults | "Home > Electronics > Phones" or "Results for 'sofa' in London". |
| `ActiveFiltersBar` | SearchResults | Horizontal row of removable filter pills + "Clear all". |
| `PostStepCategory` | PostListing | 3×4 grid of 12 category icons. Subcategory dropdown. |
| `PostStepDetails` | PostListing | Title, description, price, condition inputs. Category-specific dynamic fields. |
| `PostStepPhotos` | PostListing | Upload zone, thumbnail grid (drag-to-reorder), cover badge, remove button. |
| `PostStepLocation` | PostListing | Pre-filled location + "Use current location" + map preview. |
| `PostStepReview` | PostListing | Live preview ListingCard + Post button + optional promote upsell. |
| `ListingDetailLeft` | ListingDetail | Image gallery, price, title, metadata, condition, description, seller card, safety tips. |
| `ListingDetailRight` | ListingDetail | Sticky sidebar: Message/Make offer/Save/Share/Report buttons. |
| `ConversationList` | Inbox | Left panel (desktop) or full screen (mobile). List of ChatConversation rows. |
| `ChatPanel` | Inbox | Right panel (desktop) or full screen (mobile). Header, message bubble area, ChatInput. |
| `ProfileHeader` | Profile | Avatar, name, trust indicators (verification, rating, response rate). |
| `ProfileTabs` | Profile | My Listings / Reviews / Saved tab content. |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Scroll-triggered entrance (fade+translateY) | Framer Motion | `useInView` hook + `motion.div` with `initial`/`animate`/`transition`. Stagger via `variants` with `staggerChildren: 0.08`. IntersectionObserver threshold 0.1. | Low |
| Page navigation transitions | Framer Motion | `AnimatePresence` wrapping route Outlet. Exit: opacity 1→0 (150ms). Enter: opacity 0→1 + translateY 8→0 (250ms). | Low |
| Card hover lift + shadow | CSS transition | `transition: transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 250ms`. Hover: `translateY(-4px)` + `box-shadow: 0 12px 24px rgba(0,0,0,0.08)`. | Low |
| Card tap scale | Framer Motion | `whileTap={{ scale: 0.98 }}` on ListingCard. | Low |
| Modal/sheet entrance | Framer Motion | `AnimatePresence`. Modal: opacity 0→1 + translateY 20→0 (200ms ease-out). Backdrop: opacity 0→0.5 (200ms). | Low |
| Filter bottom sheet (mobile) | Framer Motion | `AnimatePresence`. `motion.div` with `initial={{ y: "100%" }}`, `animate={{ y: 0 }}`, `exit={{ y: "100%" }}`. 300ms spring animation. | Medium |
| Image lightbox | Framer Motion | `AnimatePresence`. Image: scale 0.9→1 (300ms ease-out). Backdrop: opacity fade. | Low |
| Toast entrance/exit | sonner (built-in) | Sonner handles slide-up + fade-in entrance and auto-dismiss fade-out. Custom styling via toast props for colored left-border. | Low |
| Category pill active transition | CSS transition | `transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease`. | Low |
| Spotlight carousel auto-scroll | CSS animation + JS | CSS `scroll-snap-type: x mandatory` + `scroll-snap-align: start`. JS `setInterval` every 5s to advance scroll position. `mouseenter`/`touchstart` clear interval, `mouseleave`/`touchend` restart. | Medium |
| Search bar focus highlight | CSS transition | `transition: border-color 200ms ease`. Focus: border-color → --color-primary. | Low |
| Bottom nav show/hide on scroll | Framer Motion | `useScroll` + `useMotionValueEvent` to detect scroll direction. `animate({ y: isScrollingDown ? 64 : 0 })`. 200ms ease. | Medium |
| Step indicator progress | CSS transition | `transition: all 300ms ease`. Circle fill and checkmark animate on step change. | Low |
| Image upload progress bar | CSS transition | Width transition on progress element. 100ms linear. | Low |
| Form error message slide-down | Framer Motion | `AnimatePresence`. `motion.div` with `initial={{ opacity: 0, y: -4 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0 }}`. 200ms. | Low |
| Pull-to-refresh spinner | CSS animation | `@keyframes rotate` on spinner element. Triggered by touch gesture detection (pull > 80px). | Medium |
| Typing indicator (3 dots) | CSS animation | `@keyframes pulse` with staggered `animation-delay` (0ms, 200ms, 400ms) per dot. Opacity 0.3→1.0. | Low |
| Chat message bubble appearance | Framer Motion | `motion.div` with `initial={{ opacity: 0, y: 10 }}`, `animate={{ opacity: 1, y: 0 }}`. 200ms ease-out. | Low |
| Auth modal login↔signup cross-fade | Framer Motion | `AnimatePresence` with `mode="wait"`. Exit: opacity 1→0 (150ms). Enter: opacity 0→1 (200ms). | Low |
| Form validation feedback (checkmark/error) | CSS transition | Icon + border-color transition, 200ms ease. | Low |
| Infinite scroll skeleton pulse | CSS animation | `@keyframes shimmer` with gradient background animation. 1.5s infinite linear. | Low |

---

## State & Logic Plan

### State Architecture

Zustand for all client state. React Query for all server state. No prop drilling — all shared state accessed via hooks.

#### Zustand Stores

| Store | Key State | Actions | Persistence |
|-------|-----------|---------|-------------|
| `useAuthStore` | `user` (null = logged out), `isLoading`, `isPremium` | `login(credentials)`, `signup(data)`, `logout()`, `updateProfile(data)` | `localStorage` (JWT token + minimal user info) |
| `useLocationStore` | `location` (city, lat, lng, radius, displayName), `isLocationSet`, `isUsingGPS` | `setLocation(loc)`, `useCurrentLocation()`, `clearLocation()` | `localStorage` |
| `useFavoritesStore` | `favorites: string[]` (listing UUIDs), `savedSearches: SavedSearch[]` | `toggleFavorite(id)`, `addSavedSearch(search)`, `removeSavedSearch(id)`, `toggleAlert(id)` | `localStorage` + sync with account (when logged in) |
| `usePostDraftStore` | `draft` (partial form data for all 5 steps), `currentStep` (1–5) | `updateStepData(step, data)`, `goToStep(step)`, `clearDraft()` | `localStorage` (auto-save every 10s via `setInterval` in component) |
| `useInboxStore` | `conversations`, `activeConversationId`, `unreadTotal`, `isTyping` | `sendMessage(convId, msg)`, `markRead(convId)`, `acceptOffer(convId, msgId)`, `declineOffer(convId, msgId)`, `deleteConversation(convId)` | Conversations persist server-side; unread count derived from conversations array |

#### React Query Keys

```
listings:     ["listings", { location, category, filters, sort, page }]
listing:      ["listing", listingId]
inbox:        ["inbox"]
conversation: ["conversation", conversationId]
userProfile:  ["user", userId]
myListings:   ["listings", "mine"]
searchResults:["search", { query, location, filters, sort, page }]
```

All list queries use `useInfiniteQuery` for scroll pagination (12 items per page). `staleTime: 5 * 60 * 1000` (5 min) for listings. `gcTime: 10 * 60 * 1000`.

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              AppShell                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────────────────┐  │
│  │  TopNav  │  │BottomNav │  │         Page Content (Outlet)         │  │
│  │(desktop) │  │(mobile)  │  │  ┌────────────────────────────────┐  │  │
│  └──────────┘  └──────────┘  │  │  Homepage / Search / Detail    │  │  │
│                              │  │  / Post / Inbox / Profile      │  │  │
│                              │  │  / Favorites / Auth            │  │  │
│                              │  └────────────────────────────────┘  │  │
│                              └──────────────────────────────────────┘  │
│                                         │                               │
│                    ┌────────────────────┼────────────────────┐          │
│                    ▼                    ▼                    ▼          │
│              ┌──────────┐       ┌──────────────┐     ┌──────────┐     │
│              │  Zustand │       │  React Query │     │  sonner  │     │
│              │  Stores  │       │   (server)   │     │  Toasts  │     │
│              └──────────┘       └──────────────┘     └──────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Auth flow:** TopNav checks `useAuthStore` for `user`. If null, shows login/signup buttons. Protected actions (PostAd, Save, Message) check auth → if not logged in, open AuthModal instead of navigating. AuthModal calls `login()`/`signup()` → on success, modal closes + page state refreshes.
- **Location flow:** On app load, `useLocationStore` reads from localStorage. If `!isLocationSet`, LocationSelector modal blocks interaction until location chosen. All listing queries include location in their key → changing location invalidates all listing caches automatically.
- **Search flow:** SearchBar controlled input → 300ms debounce → on Enter/click, navigate to `/search?q={query}` with location params. SearchResults page reads URL params → fetches via React Query.
- **Post listing flow:** 5-step wizard reads/writes `usePostDraftStore`. Each step validates via Zod → only completed steps clickable in StepIndicator. On final submit, draft clears + success toast → navigate to new listing.
- **Chat flow:** Inbox page fetches conversations. Selecting a conversation sets `activeConversationId`. Chat panel subscribes to WebSocket for real-time messages (mocked). Sending a message updates local state optimistically → syncs server-side.
- **Favorites flow:** `toggleFavorite(id)` updates localStorage immediately. If logged in, also syncs to server. Heart icon on every ListingCard reads from `favorites[]` → filled/unfilled state.

### Backend Mock API

All data mocked via `msw` (Mock Service Worker) intercepting fetch calls. MSW handlers provide:
- `GET /api/listings` — paginated, filterable by location/category/price/condition/search query
- `GET /api/listings/:id` — single listing detail
- `POST /api/listings` — create new listing (returns created listing)
- `PUT /api/listings/:id` — update listing
- `DELETE /api/listings/:id` — delete/mark as sold
- `GET /api/conversations` — user's conversation list
- `GET /api/conversations/:id` — conversation messages
- `POST /api/conversations/:id/messages` — send message
- `POST /api/offers` — make/accept/decline offer
- `POST /api/auth/login` — login
- `POST /api/auth/signup` — signup
- `GET /api/user/:id` — user profile
- `POST /api/favorites` — toggle favorite
- `GET /api/favorites` — get favorites

Mock data: 48 pre-generated listings across 8 categories with realistic titles, prices (£0–£15,000), locations (London, Manchester, Birmingham, Glasgow, Bristol, Leeds), conditions, and sellers. 6 pre-generated conversations with realistic message threads.

### Key Implementation Notes

- **Category-specific fields:** A config object maps each category to its required fields (e.g., Cars → year, mileage, fuel, transmission). PostListing Step 2 renders fields dynamically based on selected category. Same config drives FilterSidebar category tree.
- **Image handling:** Client-side compression before "upload" (Canvas API to resize to max 1200px wide, convert to WebP). Upload simulated with progressive delay. Gallery uses `srcset` for responsive images. Lazy loading via IntersectionObserver.
- **Location selector:** "Use current location" tries `navigator.geolocation` → falls back to IP-based geocoding. Search input filters popular locations list. Selection updates store + invalidates queries.
- **Filter state management:** All active filters stored as URL search params (e.g., `?category=electronics&priceMin=0&priceMax=500&condition=used_good`). This makes filters shareable via URL and enables browser back/forward. FilterSidebar reads from URL → updates URL on change → triggers React Query refetch.
- **Form draft persistence:** `usePostDraftStore` auto-saves to localStorage every 10 seconds via `useEffect` + `setInterval`. On component mount, if draft exists, show "Resume draft?" prompt. Draft cleared on successful post.
- **Infinite scroll:** IntersectionObserver on a sentinel div at bottom of grid. `useInfiniteQuery`'s `fetchNextPage` called when sentinel enters viewport + 200px buffer.
