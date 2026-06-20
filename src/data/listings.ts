export interface Seller {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseTime: string;
  memberSince: string;
}

export interface ListingLocation {
  city: string;
  area: string;
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: "fixed" | "negotiable" | "free" | "swap";
  category: string;
  subcategory: string;
  condition: "new" | "used_like_new" | "used_good" | "used_fair";
  images: string[];
  location: ListingLocation;
  seller: Seller;
  status: "active" | "sold" | "reserved" | "expired";
  isFeatured: boolean;
  isPromoted: boolean;
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { key: "cars", label: "Cars & Vehicles", icon: "Car" },
  { key: "home", label: "Home & Garden", icon: "Sofa" },
  { key: "electronics", label: "Electronics", icon: "Smartphone" },
  { key: "fashion", label: "Fashion", icon: "Shirt" },
  { key: "sports", label: "Sports & Leisure", icon: "Bike" },
  { key: "services", label: "Services", icon: "Briefcase" },
  { key: "property", label: "Property", icon: "HomeIcon" },
  { key: "pets", label: "Pets", icon: "Dog" },
  { key: "free", label: "Free Stuff", icon: "Gift" },
  { key: "jobs", label: "Jobs", icon: "Wrench" },
  { key: "community", label: "Community", icon: "Users" },
];

export const CATEGORY_CONFIG = CATEGORIES;

const LOCATIONS = [
  { city: "London", area: "Hackney", lat: 51.545, lng: -0.055 },
  { city: "London", area: "Brixton", lat: 51.461, lng: -0.115 },
  { city: "London", area: "Camden", lat: 51.539, lng: -0.142 },
  { city: "London", area: "Islington", lat: 51.534, lng: -0.103 },
  { city: "Manchester", area: "Didsbury", lat: 53.417, lng: -2.231 },
  { city: "Manchester", area: "Ancoats", lat: 53.483, lng: -2.221 },
  { city: "Birmingham", area: "Moseley", lat: 52.446, lng: -1.886 },
  { city: "Birmingham", area: "Jewellery Quarter", lat: 52.489, lng: -1.914 },
  { city: "Glasgow", area: "West End", lat: 55.871, lng: -4.288 },
  { city: "Glasgow", area: "Southside", lat: 55.825, lng: -4.268 },
  { city: "Bristol", area: "Clifton", lat: 51.455, lng: -2.621 },
  { city: "Bristol", area: "Stokes Croft", lat: 51.464, lng: -2.589 },
  { city: "Leeds", area: "Headingley", lat: 53.822, lng: -1.577 },
  { city: "Leeds", area: "Kirkstall", lat: 53.815, lng: -1.601 },
];

const SELLER_NAMES = [
  "Alex Johnson", "Sarah Williams", "James Brown", "Emily Davis",
  "Michael Wilson", "Emma Taylor", "Daniel Martinez", "Olivia Anderson",
  "William Thomas", "Sophia Jackson", "Henry White", "Ava Harris",
];

function getSeller(index: number): Seller {
  return {
    id: `seller_${index}`,
    name: SELLER_NAMES[index % SELLER_NAMES.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${SELLER_NAMES[index % SELLER_NAMES.length]}`,
    verified: index % 3 === 0,
    rating: 3.5 + (index % 5) * 0.3,
    reviewCount: 5 + (index * 7) % 45,
    responseTime: ["< 1 hour", "< 2 hours", "< 4 hours", "< 1 day"][index % 4],
    memberSince: `${2022 + (index % 3)}-${String((index % 12) + 1).padStart(2, "0")}`,
  };
}

function timeAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// Generate 48 realistic listings
export const LISTINGS: Listing[] = [
  // Cars & Vehicles (6)
  {
    id: "l1", title: "Vauxhall Corsa 1.2 SE 2019, 28k miles, Full Service History",
    description: "Excellent condition Vauxhall Corsa 1.2 SE in metallic silver. Only 28,000 miles on the clock. Full service history with stamps. MOT until March 2027. Recently had new tyres and brake pads. Perfect first car, very economical on fuel. Selling as upgrading to a larger family car.",
    price: 6500, priceType: "negotiable", category: "cars", subcategory: "hatchbacks",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0adb?w=640", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640"],
    location: LOCATIONS[0], seller: getSeller(0), status: "active", isFeatured: true, isPromoted: false,
    views: 312, favorites: 24, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },
  {
    id: "l2", title: "Ford Fiesta Zetec 2017, 42k miles, Great First Car",
    description: "Ford Fiesta Zetec 1.0 EcoBoost in race red. 42,000 miles with full Ford service history. Two previous owners. Alloy wheels, air conditioning, Bluetooth connectivity. MOT valid until November 2026. Clean inside and out. Runs perfectly.",
    price: 5200, priceType: "fixed", category: "cars", subcategory: "hatchbacks",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=640", "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=640"],
    location: LOCATIONS[4], seller: getSeller(1), status: "active", isFeatured: false, isPromoted: false,
    views: 198, favorites: 15, createdAt: timeAgo(5), updatedAt: timeAgo(2),
  },
  {
    id: "l3", title: "VW Golf GTI Mk7.5 2018, DSG, 35k miles, Stage 1 Remap",
    description: "Stunning VW Golf GTI Mk7.5 in Deep Black Pearl. 35,000 miles. DSG automatic gearbox. Stage 1 remap (280bhp). Adaptive cruise control, heated seats, panoramic sunroof. Full VW service history. Absolutely immaculate condition inside and out. Serious buyers only.",
    price: 18950, priceType: "negotiable", category: "cars", subcategory: "hatchbacks",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1471444928139-48c5bf5163d8?w=640", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640"],
    location: LOCATIONS[7], seller: getSeller(2), status: "active", isFeatured: true, isPromoted: true,
    views: 567, favorites: 42, createdAt: timeAgo(1), updatedAt: timeAgo(0),
  },
  {
    id: "l4", title: "BMW 320d M Sport Touring 2020, 22k miles, Estate",
    description: "BMW 320d M Sport Touring in Alpine White. Only 22,000 miles. M Sport package with upgraded alloys, sport seats, and body kit. Professional navigation, Harman Kardon sound, parking sensors all round. One owner from new with BMW warranty remaining. Perfect family estate.",
    price: 24500, priceType: "fixed", category: "cars", subcategory: "estates",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=640"],
    location: LOCATIONS[2], seller: getSeller(3), status: "active", isFeatured: false, isPromoted: false,
    views: 245, favorites: 18, createdAt: timeAgo(7), updatedAt: timeAgo(3),
  },
  {
    id: "l5", title: "Honda Civic Type R FK8 2019, Championship White, 18k miles",
    description: "Honda Civic Type R FK8 in Championship White. 18,000 miles. Completely standard, never modified. Full Honda main dealer service history. Carbon fibre splitter and diffuser. Triple exhaust. Bucket seats with red stitching. This is the hot hatch of the decade. Must be seen.",
    price: 28900, priceType: "negotiable", category: "cars", subcategory: "hatchbacks",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=640"],
    location: LOCATIONS[8], seller: getSeller(4), status: "active", isFeatured: false, isPromoted: true,
    views: 890, favorites: 67, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l6", title: "Peugeot 208 Active 2016, 55k miles, Cheap Insurance",
    description: "Peugeot 208 Active 1.2 VTi in silver. 55,000 miles. Cheap to insure, cheap to run. Ideal first car or city runabout. Electric windows, central locking, CD player. MOT until August 2026. Some age-related marks but mechanically sound.",
    price: 2800, priceType: "negotiable", category: "cars", subcategory: "hatchbacks",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=640"],
    location: LOCATIONS[10], seller: getSeller(5), status: "active", isFeatured: false, isPromoted: false,
    views: 156, favorites: 8, createdAt: timeAgo(12), updatedAt: timeAgo(6),
  },

  // Home & Garden (6)
  {
    id: "l7", title: "IKEA Kivik 3-Seater Sofa in Grey, 18 months old",
    description: "IKEA Kivik 3-seater sofa in Gunnared medium grey. Bought 18 months ago for £599. Removable, machine-washable covers. Very comfortable with deep seats. From a smoke-free, pet-free home. Selling as we're moving to a furnished flat. Collection only.",
    price: 220, priceType: "fixed", category: "home", subcategory: "sofas",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640", "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=640"],
    location: LOCATIONS[1], seller: getSeller(6), status: "active", isFeatured: false, isPromoted: false,
    views: 178, favorites: 22, createdAt: timeAgo(4), updatedAt: timeAgo(2),
  },
  {
    id: "l8", title: "Solid Oak Dining Table + 6 Chairs, Extendable",
    description: "Beautiful solid oak extending dining table with 6 matching chairs. Table measures 160cm extending to 200cm. Chairs have upholstered cream seats in excellent condition. Bought from John Lewis 3 years ago for £1,200. Minor wear on table top consistent with use. A stunning centrepiece for any dining room.",
    price: 350, priceType: "negotiable", category: "home", subcategory: "dining",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=640", "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=640"],
    location: LOCATIONS[5], seller: getSeller(7), status: "active", isFeatured: false, isPromoted: false,
    views: 134, favorites: 19, createdAt: timeAgo(6), updatedAt: timeAgo(3),
  },
  {
    id: "l9", title: "Dyson V15 Detect Absolute Cordless Vacuum, Boxed",
    description: "Dyson V15 Detect Absolute cordless vacuum cleaner. Purchased 8 months ago. Complete with all attachments, charging dock, and original box. Laser dust detection, LCD screen showing particle count. Battery still holds full charge. RRP £599. Selling as received a newer model as a gift.",
    price: 320, priceType: "fixed", category: "home", subcategory: "appliances",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1558317374-a35186516d22?w=640"],
    location: LOCATIONS[3], seller: getSeller(8), status: "active", isFeatured: true, isPromoted: false,
    views: 267, favorites: 31, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l10", title: "Vintage Mid-Century Sideboard, Teak, 1960s",
    description: "Stunning Danish-style mid-century teak sideboard from the 1960s. Three cupboards and three drawers with beautiful tapered legs. Fully restored with original handles. Dimensions: W180 x H75 x D45cm. A genuine statement piece. Can deliver locally for a small fee.",
    price: 450, priceType: "negotiable", category: "home", subcategory: "furniture",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640"],
    location: LOCATIONS[11], seller: getSeller(9), status: "active", isFeatured: false, isPromoted: false,
    views: 198, favorites: 27, createdAt: timeAgo(8), updatedAt: timeAgo(4),
  },
  {
    id: "l11", title: " Bosch Washing Machine, 8kg, 1400rpm, A+++ Rated",
    description: "Bosch Serie 4 washing machine, 8kg load, 1400 spin speed. A+++ energy rating. Multiple programmes including quick wash, delicates, and eco modes. 2 years old, full working order. Clean and well-maintained. Selling due to kitchen renovation with integrated appliances.",
    price: 180, priceType: "fixed", category: "home", subcategory: "appliances",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1626806775351-538d0e0f980e?w=640"],
    location: LOCATIONS[6], seller: getSeller(10), status: "active", isFeatured: false, isPromoted: false,
    views: 89, favorites: 6, createdAt: timeAgo(10), updatedAt: timeAgo(5),
  },
  {
    id: "l12", title: "Large Rattan Garden Furniture Set - 6 Seater",
    description: "Rattan garden dining set with 6 high-back chairs and large rectangular table. Includes cushions in grey. Weather-resistant PE rattan on aluminium frame. 2 years old, stored in shed over winter. Table has tempered glass top. Perfect for summer entertaining. Collection or can help with delivery.",
    price: 280, priceType: "negotiable", category: "home", subcategory: "garden",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=640"],
    location: LOCATIONS[9], seller: getSeller(11), status: "active", isFeatured: false, isPromoted: false,
    views: 112, favorites: 14, createdAt: timeAgo(9), updatedAt: timeAgo(4),
  },

  // Electronics (6)
  {
    id: "l13", title: "iPhone 14 Pro 256GB Space Black, Unlocked, Apple Warranty",
    description: "iPhone 14 Pro 256GB in Space Black. Factory unlocked for any network. Apple warranty until January 2027. Battery health 96%. Always used with screen protector and case — no scratches anywhere. Comes with original box, cable, and unused EarPods. Selling as upgraded to 15 Pro.",
    price: 650, priceType: "fixed", category: "electronics", subcategory: "phones",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=640", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=640"],
    location: LOCATIONS[0], seller: getSeller(0), status: "active", isFeatured: true, isPromoted: false,
    views: 534, favorites: 48, createdAt: timeAgo(1), updatedAt: timeAgo(0),
  },
  {
    id: "l14", title: "Samsung 55\" QN90C Neo QLED 4K TV, 2023 Model",
    description: "Samsung QN90C 55-inch Neo QLED 4K Smart TV. 2023 model. Mini LED with Quantum Matrix technology. 144Hz refresh rate, perfect for gaming. Tizen OS with all streaming apps. HDMI 2.1 ports. Only 6 months old, immaculate condition. Includes stand, remote, and box. RRP £1,499.",
    price: 750, priceType: "negotiable", category: "electronics", subcategory: "tv",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=640"],
    location: LOCATIONS[4], seller: getSeller(2), status: "active", isFeatured: false, isPromoted: true,
    views: 312, favorites: 26, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },
  {
    id: "l15", title: "MacBook Air M2 13.6\" 16GB RAM 512GB SSD, Midnight",
    description: "MacBook Air M2 13.6-inch in Midnight. 16GB unified memory, 512GB SSD. AppleCare+ until June 2027. Battery cycle count: 87. Absolutely pristine condition — no marks, scratches or dents. Comes with original box, 35W dual charger, and MagSafe cable. Perfect for students or professionals.",
    price: 950, priceType: "fixed", category: "electronics", subcategory: "laptops",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=640", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=640"],
    location: LOCATIONS[7], seller: getSeller(3), status: "active", isFeatured: true, isPromoted: false,
    views: 445, favorites: 38, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l16", title: "Sony WH-1000XM5 Noise Cancelling Headphones, Silver",
    description: "Sony WH-1000XM5 wireless noise cancelling headphones in silver. Best noise cancellation on the market. 30-hour battery life. Multipoint connection. Purchased 4 months ago, barely used as I prefer earbuds. Comes with carrying case, cables, and box. As new condition.",
    price: 220, priceType: "fixed", category: "electronics", subcategory: "audio",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=640"],
    location: LOCATIONS[1], seller: getSeller(5), status: "active", isFeatured: false, isPromoted: false,
    views: 189, favorites: 21, createdAt: timeAgo(5), updatedAt: timeAgo(2),
  },
  {
    id: "l17", title: "Nintendo Switch OLED Model with 5 Games and Case",
    description: "Nintendo Switch OLED model in white. Perfect condition, no scratches on screen. Includes 5 games: Zelda TOTK, Mario Wonder, Animal Crossing, Smash Bros Ultimate, and Mario Kart 8. Also includes protective carrying case, screen protector (applied), and extra Joy-Con straps. Selling as I don't have time to play anymore.",
    price: 280, priceType: "negotiable", category: "electronics", subcategory: "gaming",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=640"],
    location: LOCATIONS[10], seller: getSeller(7), status: "active", isFeatured: false, isPromoted: false,
    views: 298, favorites: 33, createdAt: timeAgo(4), updatedAt: timeAgo(2),
  },
  {
    id: "l18", title: "Canon EOS R6 Mirrorless Camera Body + RF 24-105mm Lens",
    description: "Canon EOS R6 mirrorless camera body with RF 24-105mm F4-7.1 IS STM lens. 20MP full-frame sensor. In-body image stabilisation. 4K video. Shutter count: 12,400. Some minor cosmetic wear on grip but sensor is clean and everything works perfectly. Includes 2 batteries, charger, strap, and original boxes.",
    price: 1650, priceType: "negotiable", category: "electronics", subcategory: "cameras",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=640"],
    location: LOCATIONS[12], seller: getSeller(9), status: "active", isFeatured: false, isPromoted: false,
    views: 156, favorites: 12, createdAt: timeAgo(7), updatedAt: timeAgo(3),
  },

  // Fashion (5)
  {
    id: "l19", title: "Barbour Ashby Waxed Jacket, Olive, Size M, Worn Once",
    description: "Barbour Ashby waxed cotton jacket in olive. Size Medium. Worn literally once for a country walk — essentially new condition. No marks, no smells. Original tags not attached but I have them. This retails for £229. A classic British jacket that will last decades with proper care.",
    price: 145, priceType: "fixed", category: "fashion", subcategory: "mens-coats",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1544923246-77307dd218be?w=640"],
    location: LOCATIONS[2], seller: getSeller(1), status: "active", isFeatured: false, isPromoted: false,
    views: 87, favorites: 11, createdAt: timeAgo(6), updatedAt: timeAgo(3),
  },
  {
    id: "l20", title: "Doc Martens 1460 Pascal Black, UK Size 7, Near New",
    description: "Dr. Martens 1460 Pascal boots in black soft leather. UK size 7. Worn twice — decided they're not quite my style. Soles are basically unworn. Original box and spare laces included. These retail for £169. Breaking them in is already done for you!",
    price: 85, priceType: "fixed", category: "fashion", subcategory: "shoes",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=640"],
    location: LOCATIONS[6], seller: getSeller(4), status: "active", isFeatured: false, isPromoted: false,
    views: 134, favorites: 18, createdAt: timeAgo(5), updatedAt: timeAgo(2),
  },
  {
    id: "l21", title: "Vintage Levi's 501 Jeans, 32W 32L, Made in USA",
    description: "Genuine vintage Levi's 501 jeans, made in USA. 32-inch waist, 32-inch leg. Beautiful natural wear and fading — not artificially distressed. Red tab intact. Button fly. These are from the 90s when Levi's still made quality denim. Perfect vintage look without the work of breaking them in.",
    price: 55, priceType: "fixed", category: "fashion", subcategory: "jeans",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=640"],
    location: LOCATIONS[8], seller: getSeller(6), status: "active", isFeatured: false, isPromoted: false,
    views: 76, favorites: 9, createdAt: timeAgo(9), updatedAt: timeAgo(5),
  },
  {
    id: "l22", title: "The North Face Puffer Jacket, Black, Women's Size S",
    description: "The North Face 1996 Retro Nuptse puffer jacket in black. Women's size Small. 700-fill goose down. Excellent warmth-to-weight ratio. Worn for one winter season, still very puffy and warm. No rips, tears, or stains. Original stuff sack included. RRP £280.",
    price: 110, priceType: "negotiable", category: "fashion", subcategory: "womens-coats",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=640"],
    location: LOCATIONS[3], seller: getSeller(8), status: "active", isFeatured: false, isPromoted: false,
    views: 145, favorites: 16, createdAt: timeAgo(4), updatedAt: timeAgo(2),
  },
  {
    id: "l23", title: "Ray-Ban Aviator Sunglasses, Gold Frame, Polarized",
    description: "Ray-Ban Aviator Classic RB3025 in gold frame with polarized green G-15 lenses. 58mm lens size. Minor scratches on the frame consistent with use but lenses are in excellent condition with no deep scratches. Comes with original case and cleaning cloth. Model: RB3025 001/58.",
    price: 65, priceType: "fixed", category: "fashion", subcategory: "accessories",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=640"],
    location: LOCATIONS[11], seller: getSeller(10), status: "active", isFeatured: false, isPromoted: false,
    views: 98, favorites: 13, createdAt: timeAgo(8), updatedAt: timeAgo(4),
  },

  // Sports & Leisure (5)
  {
    id: "l24", title: "Trek Domane AL 2 Road Bike, 56cm, 2022, Excellent Condition",
    description: "Trek Domane AL 2 road bike, 56cm frame. 2022 model. Shimano Claris 2x8 speed. Aluminium frame with carbon fork. Bontrager wheels and tyres. Bontrager saddle. Probably done about 500 miles total. Recently serviced — new brake pads and gear cable. A brilliant entry-level road bike. Fits riders 5'9\" to 6'0\".",
    price: 450, priceType: "negotiable", category: "sports", subcategory: "cycling",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=640", "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=640"],
    location: LOCATIONS[5], seller: getSeller(0), status: "active", isFeatured: false, isPromoted: false,
    views: 234, favorites: 28, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },
  {
    id: "l25", title: "Brompton M6L Folding Bike, Black, 2023, Low Miles",
    description: "Brompton M6L folding bike in black. 2023 model with only about 200 miles of use. 6-speed BWR hub gears. Mudguards and rack fitted. Perfect for commuting — folds in 10 seconds. Always stored indoors. Recent service at Brompton Junction. RRP £1,190. Includes Brompton bag.",
    price: 780, priceType: "fixed", category: "sports", subcategory: "cycling",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=640"],
    location: LOCATIONS[0], seller: getSeller(2), status: "active", isFeatured: true, isPromoted: false,
    views: 367, favorites: 35, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l26", title: "Wilson Pro Staff RF97 Tennis Racket, Autograph Model",
    description: "Wilson Pro Staff RF97 Autograph tennis racket. 340g, 97 sq inch head. The same racket Roger Federer used on tour. Strung with Luxilon ALU Power at 52lbs. Grip size 3 (4 3/8). Some minor paint chips on the head guard from normal use but frame is structurally perfect. Original cover included.",
    price: 120, priceType: "negotiable", category: "sports", subcategory: "tennis",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=640"],
    location: LOCATIONS[4], seller: getSeller(5), status: "active", isFeatured: false, isPromoted: false,
    views: 67, favorites: 5, createdAt: timeAgo(10), updatedAt: timeAgo(5),
  },
  {
    id: "l27", title: "Yamaha P-45 Digital Piano with Stand, Pedal, and Bench",
    description: "Yamaha P-45 digital piano with X-frame stand, sustain pedal, and padded bench. 88 fully weighted keys with graded hammer action. 10 voices including concert grand, electric piano, and organs. USB MIDI connectivity. Perfect for beginners or intermediate players. Only used for 6 months of lessons. All in great condition.",
    price: 320, priceType: "negotiable", category: "sports", subcategory: "musical",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=640"],
    location: LOCATIONS[7], seller: getSeller(7), status: "active", isFeatured: false, isPromoted: false,
    views: 123, favorites: 15, createdAt: timeAgo(7), updatedAt: timeAgo(3),
  },
  {
    id: "l28", title: "Decathlon Quechua 2-Person Tent, 3-Season, Used Twice",
    description: "Decathlon Quechua 2 Seconds Easy 2-person tent. 3-season tent with 3000mm hydrostatic head. Pops up in literally 2 seconds. Used twice on camping trips — both dry weekends so it's in excellent condition. No mould, no tears, all pegs and guylines included. Compact when packed. Great for festivals or weekend camping.",
    price: 45, priceType: "fixed", category: "sports", subcategory: "camping",
    condition: "used_like_new",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=640"],
    location: LOCATIONS[9], seller: getSeller(9), status: "active", isFeatured: false, isPromoted: false,
    views: 89, favorites: 10, createdAt: timeAgo(11), updatedAt: timeAgo(6),
  },

  // Services (4)
  {
    id: "l29", title: "Professional House Cleaning Service — Regular or One-Off",
    description: "Reliable and thorough house cleaning service covering all London areas. I offer regular weekly/fortnightly cleaning or one-off deep cleans. All cleaning products and equipment provided. I pay attention to detail — not just a quick surface clean. References available from current clients. DBS checked. £18/hour, minimum 3 hours.",
    price: 18, priceType: "fixed", category: "services", subcategory: "cleaning",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=640"],
    location: LOCATIONS[0], seller: getSeller(1), status: "active", isFeatured: false, isPromoted: false,
    views: 198, favorites: 22, createdAt: timeAgo(5), updatedAt: timeAgo(2),
  },
  {
    id: "l30", title: "Man with a Van — Removals, Deliveries, Clearances, Cheap Rates",
    description: "Friendly and reliable man with a van service. Long wheelbase Mercedes Sprinter. Available for house/flat removals, furniture deliveries, student moves, single item transport, and house clearances. I help with loading and unloading. Fully insured. Same day service often available. Competitive rates starting from £40. No hidden charges.",
    price: 40, priceType: "fixed", category: "services", subcategory: "removals",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=640"],
    location: LOCATIONS[4], seller: getSeller(3), status: "active", isFeatured: false, isPromoted: false,
    views: 345, favorites: 41, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },
  {
    id: "l31", title: "Qualified Maths & Physics Tutor — GCSE to A-Level, Online or In-Person",
    description: "I'm a qualified teacher with 8 years of experience tutoring Maths and Physics. I cover all exam boards (AQA, Edexcel, OCR) for GCSE and A-Level. Lessons can be online via Zoom or in-person if you're local to Manchester. I focus on building understanding, not just memorising methods. First lesson is half price. £35/hour.",
    price: 35, priceType: "fixed", category: "services", subcategory: "tutoring",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640"],
    location: LOCATIONS[5], seller: getSeller(6), status: "active", isFeatured: false, isPromoted: false,
    views: 156, favorites: 19, createdAt: timeAgo(6), updatedAt: timeAgo(3),
  },
  {
    id: "l32", title: "Professional Dog Walking — North London, Fully Insured",
    description: "Experienced dog walker based in North London. I offer group walks (£12) and solo walks (£18) for dogs that need individual attention. Each walk is minimum 1 hour. I only walk compatible dogs together. Fully insured with Pet Business Insurance. Can provide daily photo updates. Available Monday to Saturday. References from vet practices available.",
    price: 12, priceType: "fixed", category: "services", subcategory: "pet-care",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=640"],
    location: LOCATIONS[2], seller: getSeller(8), status: "active", isFeatured: false, isPromoted: false,
    views: 234, favorites: 28, createdAt: timeAgo(4), updatedAt: timeAgo(2),
  },

  // Property (4)
  {
    id: "l33", title: "Double Room to Rent in Modern Flatshare — Bills Included",
    description: "Large double room available in a modern 3-bedroom flatshare in Camden. The flat has a shared kitchen/living area, bathroom with power shower, and a small balcony. High-speed fibre broadband included. Bills (gas, electric, water, council tax) all included in rent. Existing flatmates are two professionals in their late 20s. No couples, no pets, non-smokers preferred.",
    price: 850, priceType: "fixed", category: "property", subcategory: "rooms",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=640", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=640"],
    location: LOCATIONS[2], seller: getSeller(0), status: "active", isFeatured: true, isPromoted: false,
    views: 456, favorites: 52, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l34", title: "1-Bedroom Flat to Rent — Didsbury, Parking, Unfurnished",
    description: "Well-presented 1-bedroom first floor flat in popular Didsbury location. Open-plan living/kitchen area with integrated appliances. Double bedroom with fitted wardrobe. Modern bathroom with shower over bath. Allocated parking space. Unfurnished. Available 1st July 2026. Close to Didsbury Village metrolink and all amenities. No pets, no smokers.",
    price: 795, priceType: "fixed", category: "property", subcategory: "flats",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=640"],
    location: LOCATIONS[4], seller: getSeller(2), status: "active", isFeatured: false, isPromoted: false,
    views: 289, favorites: 34, createdAt: timeAgo(4), updatedAt: timeAgo(2),
  },
  {
    id: "l35", title: "2-Bedroom House to Rent — Garden, Garage, Pet Friendly",
    description: "Lovely 2-bedroom terraced house with private rear garden and garage. Recently redecorated throughout with new carpets. Modern fitted kitchen with dishwasher and washing machine. Two double bedrooms upstairs. Family bathroom with electric shower. Driveway parking for one car. Pets considered on a case-by-case basis. Available mid-July.",
    price: 950, priceType: "fixed", category: "property", subcategory: "houses",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=640"],
    location: LOCATIONS[6], seller: getSeller(5), status: "active", isFeatured: false, isPromoted: false,
    views: 312, favorites: 38, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },
  {
    id: "l36", title: "Parking Space for Rent — Central Bristol, Secure Gated, 24/7 Access",
    description: "Secure allocated parking space in a gated development in central Bristol. 24/7 fob access. Covered by CCTV. Only 5 minutes walk from Temple Meads station and Cabot Circus. Available for long-term rent. Minimum 3-month commitment. Perfect for commuters or city centre workers who are tired of paying NCP prices.",
    price: 120, priceType: "fixed", category: "property", subcategory: "parking",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=640"],
    location: LOCATIONS[10], seller: getSeller(7), status: "active", isFeatured: false, isPromoted: false,
    views: 156, favorites: 18, createdAt: timeAgo(8), updatedAt: timeAgo(4),
  },

  // Pets (4)
  {
    id: "l37", title: "Cocker Spaniel Puppies — KC Registered, Health Tested Parents",
    description: "Beautiful litter of 6 show-type Cocker Spaniel puppies, 3 boys and 3 girls. Golden and black colouring. KC registered with 5 generation pedigree. Both parents are health tested clear for PRA, FN, and AMS. Puppies will be microchipped, vet checked, wormed, and have first vaccination before leaving. Ready 15th August. £200 deposit secures.",
    price: 1200, priceType: "fixed", category: "pets", subcategory: "dogs",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=640", "https://images.unsplash.com/photo-1544568100-847a948585b9?w=640"],
    location: LOCATIONS[8], seller: getSeller(9), status: "active", isFeatured: true, isPromoted: true,
    views: 1234, favorites: 89, createdAt: timeAgo(1), updatedAt: timeAgo(0),
  },
  {
    id: "l38", title: "Large Cat Tree / Scratching Post — 170cm, Multi-Level",
    description: "Large multi-level cat tree standing 170cm tall. Features multiple platforms, two enclosed hideaways, sisal scratching posts, and hanging toys. In good used condition — some wear on the sisal posts which cats actually prefer. Our cat loved this but we've moved to a smaller place. Easy to assemble/disassemble. Collection from Headingley.",
    price: 35, priceType: "fixed", category: "pets", subcategory: "cat-accessories",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=640"],
    location: LOCATIONS[12], seller: getSeller(10), status: "active", isFeatured: false, isPromoted: false,
    views: 78, favorites: 9, createdAt: timeAgo(9), updatedAt: timeAgo(5),
  },
  {
    id: "l39", title: "Fish Tank / Aquarium — 100L with Filter, Heater, LED Light",
    description: "100-litre glass aquarium complete with everything you need to start. Includes: internal filter, 100W heater, LED light with day/night modes, gravel, ornaments (castle and plants), water testing kit, net, and food. Previously home to tropical fish. Tank is water-tight and clean. Dimensions: 80 x 35 x 40cm. Great starter setup.",
    price: 65, priceType: "negotiable", category: "pets", subcategory: "fish",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=640"],
    location: LOCATIONS[1], seller: getSeller(11), status: "active", isFeatured: false, isPromoted: false,
    views: 56, favorites: 7, createdAt: timeAgo(12), updatedAt: timeAgo(6),
  },
  {
    id: "l40", title: "Rabbit Hutch and Run — Large Double-Storey, Weatherproof",
    description: "Large double-storey rabbit hutch with attached outdoor run. Upper level has enclosed sleeping area. Lower level is open with wire mesh front. Attached run gives plenty of outdoor space. Weatherproofed roof. Dimensions: H120 x W150 x D65cm. Some weathering on the wood but structurally solid. Could do with a fresh coat of wood stain.",
    price: 45, priceType: "negotiable", category: "pets", subcategory: "small-pets",
    condition: "used_fair",
    images: ["https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=640"],
    location: LOCATIONS[3], seller: getSeller(0), status: "active", isFeatured: false, isPromoted: false,
    views: 43, favorites: 5, createdAt: timeAgo(14), updatedAt: timeAgo(7),
  },

  // Free Stuff (4)
  {
    id: "l41", title: "Free Moving Boxes — 20+ Cardboard Boxes, Various Sizes",
    description: "Just moved house and have over 20 cardboard boxes of various sizes that I don't need anymore. Mix of large wardrobe boxes, medium boxes, and small book boxes. Most are double-walled and in good condition. Free to anyone who can collect from Brixton. First come first served — please message before coming to check availability.",
    price: 0, priceType: "free", category: "free", subcategory: "boxes",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1603351154351-5cf2330927f6?w=640"],
    location: LOCATIONS[1], seller: getSeller(2), status: "active", isFeatured: false, isPromoted: false,
    views: 189, favorites: 31, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l42", title: "Free Wooden Pallets — Perfect for DIY Projects",
    description: "Around 15 wooden pallets free for collection. Various sizes, mostly standard Euro pallets. Some are in great condition, others have a broken slat or two but still usable. Perfect for upcycling into garden furniture, shelving, or firewood. Located in an industrial estate in Kirkstall with easy loading access.",
    price: 0, priceType: "free", category: "free", subcategory: "pallets",
    condition: "used_fair",
    images: ["https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=640"],
    location: LOCATIONS[13], seller: getSeller(4), status: "active", isFeatured: false, isPromoted: false,
    views: 234, favorites: 28, createdAt: timeAgo(4), updatedAt: timeAgo(2),
  },
  {
    id: "l43", title: "Free Baby Clothes — 0-12 Months, Boys, Good Condition",
    description: "Bag of baby boy clothes, sizes newborn to 12 months. Includes sleepsuits, vests, jumpers, trousers, and a few outdoor items. All in good clean condition from a smoke-free home. Some items barely worn. Would rather give to someone who needs them than take to a charity shop. Collection from Ancoats area.",
    price: 0, priceType: "free", category: "free", subcategory: "baby-clothes",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1522771930-78848dc92939?w=640"],
    location: LOCATIONS[5], seller: getSeller(6), status: "active", isFeatured: false, isPromoted: false,
    views: 156, favorites: 22, createdAt: timeAgo(6), updatedAt: timeAgo(3),
  },
  {
    id: "l44", title: "Free Old TV — 32\" Samsung LCD, Working Perfectly",
    description: "32-inch Samsung LCD TV, about 8 years old but still works perfectly. HDMI x 2, USB, Freeview built-in. Not a smart TV so you'll need a Fire Stick or similar for streaming. Remote included. Only getting rid of it because we upgraded to a bigger 4K TV. Would suit a bedroom, kitchen, or student flat.",
    price: 0, priceType: "free", category: "free", subcategory: "electronics",
    condition: "used_good",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=640"],
    location: LOCATIONS[11], seller: getSeller(8), status: "active", isFeatured: false, isPromoted: false,
    views: 312, favorites: 45, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },

  // Jobs (3)
  {
    id: "l45", title: "Part-Time Barista Needed — Independent Coffee Shop, Shoreditch",
    description: "Independent specialty coffee shop in Shoreditch looking for a part-time barista. 20-25 hours per week, flexible shifts. Previous coffee experience preferred but not essential — we'll train the right person. Must be passionate about coffee and customer service. £12/hour + tips (usually £20-40/shift). Free coffee and food on shift. Start date: ASAP.",
    price: 12, priceType: "fixed", category: "jobs", subcategory: "hospitality",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=640"],
    location: LOCATIONS[0], seller: getSeller(1), status: "active", isFeatured: false, isPromoted: false,
    views: 567, favorites: 42, createdAt: timeAgo(2), updatedAt: timeAgo(1),
  },
  {
    id: "l46", title: "Experienced Gardener Required — 2 Days Per Week, Clifton Area",
    description: "Looking for an experienced gardener for a large residential garden in Clifton, Bristol. Approximately 2 days per week (16 hours), flexible on which days. Duties include lawn care, pruning, weeding, planting, and general garden maintenance. Must have own tools and transport. £18/hour cash in hand. Long-term position for the right person.",
    price: 18, priceType: "fixed", category: "jobs", subcategory: "gardening",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=640"],
    location: LOCATIONS[10], seller: getSeller(3), status: "active", isFeatured: false, isPromoted: false,
    views: 234, favorites: 18, createdAt: timeAgo(5), updatedAt: timeAgo(2),
  },
  {
    id: "l47", title: "Delivery Driver — Evening & Weekend Shifts, Own Vehicle Required",
    description: "Local restaurant chain looking for reliable delivery drivers for evening and weekend shifts. Must have own vehicle (car, motorbike, or e-bike), valid licence, and insurance. Deliveries within 3-mile radius. £10/hour + £1.50 per delivery + keep all tips. Typical earnings £15-20/hour. Weekly pay. Immediate start available. Apply with your vehicle details.",
    price: 10, priceType: "fixed", category: "jobs", subcategory: "driving",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=640"],
    location: LOCATIONS[6], seller: getSeller(5), status: "active", isFeatured: false, isPromoted: false,
    views: 445, favorites: 56, createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },

  // Community (1)
  {
    id: "l48", title: "Looking for Tennis Partner — Beginner/Intermediate, Glasgow West End",
    description: "Hi! I'm looking for a tennis partner to play with regularly in the Glasgow West End area. I'm probably a beginner-to-intermediate level — I can hold a rally but my serve needs work! Available weekday evenings after 6pm and weekends. Happy to play at any of the public courts in the area (Kelvingrove, Victoria Park, etc.). Just looking to have fun and get some exercise.",
    price: 0, priceType: "free", category: "community", subcategory: "sports-partners",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=640"],
    location: LOCATIONS[8], seller: getSeller(7), status: "active", isFeatured: false, isPromoted: false,
    views: 67, favorites: 4, createdAt: timeAgo(7), updatedAt: timeAgo(3),
  },
];
