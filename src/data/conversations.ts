export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: "text" | "offer" | "image" | "system";
  offerAmount?: number;
  offerStatus?: "pending" | "accepted" | "declined";
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: number;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    listingId: "l13",
    listingTitle: "iPhone 14 Pro 256GB Space Black",
    listingImage: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=200",
    listingPrice: 650,
    otherUser: { id: "seller_0", name: "Alex Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Johnson" },
    messages: [
      { id: "m1", senderId: "buyer", content: "Hi! Is this iPhone still available?", type: "text", timestamp: "2026-06-18T09:15:00Z", read: true },
      { id: "m2", senderId: "seller_0", content: "Yes it is! Are you interested?", type: "text", timestamp: "2026-06-18T09:22:00Z", read: true },
      { id: "m3", senderId: "buyer", content: "Great! Would you consider £600? I can collect today.", type: "offer", offerAmount: 600, offerStatus: "pending", timestamp: "2026-06-18T09:30:00Z", read: true },
      { id: "m4", senderId: "seller_0", content: "I could do £620. It's basically new condition with warranty until 2027.", type: "text", timestamp: "2026-06-18T10:05:00Z", read: false },
    ],
    lastMessageAt: "2026-06-18T10:05:00Z",
    unreadCount: 1,
  },
  {
    id: "c2",
    listingId: "l7",
    listingTitle: "IKEA Kivik 3-Seater Sofa in Grey",
    listingImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200",
    listingPrice: 220,
    otherUser: { id: "seller_6", name: "Emily Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily%20Davis" },
    messages: [
      { id: "m5", senderId: "buyer", content: "Hi Emily, is the sofa still available? I'd love to come see it.", type: "text", timestamp: "2026-06-17T14:20:00Z", read: true },
      { id: "m6", senderId: "seller_6", content: "Hi! Yes it is. I'm free this weekend if you want to come by.", type: "text", timestamp: "2026-06-17T14:35:00Z", read: true },
      { id: "m7", senderId: "buyer", content: "Perfect! Would Saturday afternoon around 2pm work? I'm in Brixton so not far.", type: "text", timestamp: "2026-06-17T15:00:00Z", read: true },
      { id: "m8", senderId: "seller_6", content: "Saturday at 2pm works for me. I'll send you my address.", type: "text", timestamp: "2026-06-17T15:10:00Z", read: true },
    ],
    lastMessageAt: "2026-06-17T15:10:00Z",
    unreadCount: 0,
  },
  {
    id: "c3",
    listingId: "l25",
    listingTitle: "Brompton M6L Folding Bike, Black, 2023",
    listingImage: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200",
    listingPrice: 780,
    otherUser: { id: "seller_2", name: "James Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Brown" },
    messages: [
      { id: "m9", senderId: "buyer", content: "Is this still available? I'm very interested.", type: "text", timestamp: "2026-06-16T11:00:00Z", read: true },
      { id: "m10", senderId: "seller_2", content: "Yes it is! It's a great bike, barely used.", type: "text", timestamp: "2026-06-16T11:15:00Z", read: true },
      { id: "m11", senderId: "buyer", content: "Would you be open to £700? I can collect from Hackney.", type: "text", timestamp: "2026-06-16T11:30:00Z", read: true },
    ],
    lastMessageAt: "2026-06-16T11:30:00Z",
    unreadCount: 0,
  },
  {
    id: "c4",
    listingId: "l29",
    listingTitle: "Professional House Cleaning Service",
    listingImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200",
    listingPrice: 18,
    otherUser: { id: "seller_1", name: "Sarah Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Williams" },
    messages: [
      { id: "m12", senderId: "buyer", content: "Hi Sarah, do you have availability for a one-off deep clean next week?", type: "text", timestamp: "2026-06-15T16:00:00Z", read: true },
      { id: "m13", senderId: "seller_1", content: "Hi! Yes I have Tuesday or Thursday available. What area are you in?", type: "text", timestamp: "2026-06-15T16:20:00Z", read: true },
      { id: "m14", senderId: "buyer", content: "I'm in Camden. It's a 2-bedroom flat. Would 4 hours be enough?", type: "text", timestamp: "2026-06-15T16:45:00Z", read: true },
      { id: "m15", senderId: "seller_1", content: "4 hours should be plenty for a 2-bed flat. Shall we say Tuesday at 10am?", type: "text", timestamp: "2026-06-15T17:00:00Z", read: true },
      { id: "m16", senderId: "buyer", content: "Tuesday 10am works perfectly. See you then!", type: "text", timestamp: "2026-06-15T17:05:00Z", read: true },
    ],
    lastMessageAt: "2026-06-15T17:05:00Z",
    unreadCount: 0,
  },
  {
    id: "c5",
    listingId: "l41",
    listingTitle: "Free Moving Boxes — 20+ Cardboard Boxes",
    listingImage: "https://images.unsplash.com/photo-1603351154351-5cf2330927f6?w=200",
    listingPrice: 0,
    otherUser: { id: "seller_2", name: "James Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Brown" },
    messages: [
      { id: "m17", senderId: "buyer", content: "Hi! Are the boxes still available? I could collect tomorrow.", type: "text", timestamp: "2026-06-18T08:00:00Z", read: true },
      { id: "m18", senderId: "seller_2", content: "Yes they are! Someone else is interested too though so first to collect gets them.", type: "text", timestamp: "2026-06-18T08:15:00Z", read: false },
    ],
    lastMessageAt: "2026-06-18T08:15:00Z",
    unreadCount: 1,
  },
  {
    id: "c6",
    listingId: "l33",
    listingTitle: "Double Room to Rent in Modern Flatshare",
    listingImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=200",
    listingPrice: 850,
    otherUser: { id: "seller_0", name: "Alex Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Johnson" },
    messages: [
      { id: "m19", senderId: "buyer", content: "Hi, is the room still available? I'm looking to move in early July.", type: "text", timestamp: "2026-06-14T10:00:00Z", read: true },
      { id: "m20", senderId: "seller_0", content: "Hi! Yes it is. Are you working full time? What's your situation?", type: "text", timestamp: "2026-06-14T10:30:00Z", read: true },
    ],
    lastMessageAt: "2026-06-14T10:30:00Z",
    unreadCount: 0,
  },
];
