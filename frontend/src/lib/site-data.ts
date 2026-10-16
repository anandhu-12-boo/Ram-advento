import kolukkumalai from "@/assets/dest-kolukkumalai.jpg";
import gaproad from "@/assets/dest-gaproad.jpg";
import mattupetty from "@/assets/dest-mattupetty.jpg";
import vattavada from "@/assets/dest-vattavada.jpg";
import topstation from "@/assets/dest-topstation.jpg";
import echopoint from "@/assets/dest-echopoint.jpg";
import anayirankal from "@/assets/dest-anayirankal.jpg";
import experienceJeep from "@/assets/experience-jeep.jpg";
import { valleyImage, forestPoster, heroPoster } from "@/lib/media";

export const jeepImage = experienceJeep;

export type Destination = {
  slug: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  blurb: string;
};

export const destinations: Destination[] = [
  {
    slug: "kolukkumalai",
    name: "Kolukkumalai",
    location: "Munnar • 32 km",
    duration: "5 hours",
    price: 4500,
    image: kolukkumalai,
    blurb:
      "Sunrise above the clouds at the world's highest tea plantation, reachable only by jeep.",
  },
  {
    slug: "top-station",
    name: "Top Station",
    location: "Munnar • 34 km",
    duration: "4 hours",
    price: 3200,
    image: topstation,
    blurb: "The highest viewpoint of the Munnar range, looking over the Theni valley.",
  },
  {
    slug: "vattavada",
    name: "Vattavada",
    location: "Munnar • 40 km",
    duration: "6 hours",
    price: 4200,
    image: vattavada,
    blurb: "Terraced hill farms, strawberry fields and villages sitting inside the clouds.",
  },
  {
    slug: "gap-road",
    name: "Gap Road",
    location: "Munnar • 28 km",
    duration: "3 hours",
    price: 2800,
    image: gaproad,
    blurb: "A raw off-road trail cutting through tea estates and mist-soaked ridges.",
  },
  {
    slug: "mattupetty",
    name: "Mattupetty",
    location: "Munnar • 13 km",
    duration: "3 hours",
    price: 2500,
    image: mattupetty,
    blurb: "Dam waters held between green shoulders of hill, with echo valleys beyond.",
  },
  {
    slug: "echo-point",
    name: "Echo Point",
    location: "Munnar • 15 km",
    duration: "3 hours",
    price: 2500,
    image: echopoint,
    blurb: "Still lake water, boats and hills that answer back when you call.",
  },
  {
    slug: "kundala",
    name: "Kundala",
    location: "Munnar • 20 km",
    duration: "4 hours",
    price: 2900,
    image: valleyImage,
    blurb: "Cherry blossom season, the arch dam and quiet pine-lined mountain roads.",
  },
  {
    slug: "chinnakanal",
    name: "Chinnakanal",
    location: "Munnar • 22 km",
    duration: "4 hours",
    price: 3000,
    image: forestPoster,
    blurb: "Power House waterfalls, wild forest edges and elephant country.",
  },
  {
    slug: "anayirankal",
    name: "Anayirankal",
    location: "Munnar • 25 km",
    duration: "4 hours",
    price: 3100,
    image: anayirankal,
    blurb: "A reservoir ringed with pine forest where wild elephants come down to drink.",
  },
];

export type Tour = {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  duration: string;
  price: number;
  vehicle: string;
  maxGuests: number;
  rating: number;
  reviews: number;
  image: string;
  overview: string;
  highlights: string[];
  itinerary: { time: string; title: string; detail: string }[];
  included: string[];
  excluded: string[];
  pickup: string;
  gallery: string[];
  faqs: { q: string; a: string }[];
};

export type SiteSettings = {
  brandName: string;
  tagLine: string;
  locationLabel: string;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    supportEmail: string;
    address: string;
    mapsUrl: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  theme: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
};

export const defaultSiteSettings: SiteSettings = {
  brandName: "Ram Adventure",
  tagLine: "Jeep Safari • Mountain Trails",
  locationLabel: "Kerala • Adventure Routes",
  contact: {
    phone: "+91 98470 00000",
    whatsapp: "+91 98470 00000",
    email: "hello@ramadventure.in",
    supportEmail: "support@ramadventure.in",
    address: "Kerala, India",
    mapsUrl: "https://maps.google.com/?q=Kerala%20India",
  },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me/919847000000",
  },
  theme: {
    primary: "#1f3b2d",
    accent: "#b8634d",
    background: "#f3efe6",
    surface: "#111111",
    text: "#f9f6f0",
    muted: "#d9d1c5",
  },
};

export function readSiteSettings(): SiteSettings {
  if (typeof window === "undefined") {
    return defaultSiteSettings;
  }

  try {
    const raw = window.localStorage.getItem("site_settings");
    if (!raw) return defaultSiteSettings;

    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...defaultSiteSettings,
      ...parsed,
      contact: {
        ...defaultSiteSettings.contact,
        ...(parsed.contact ?? {}),
      },
      socials: {
        ...defaultSiteSettings.socials,
        ...(parsed.socials ?? {}),
      },
      theme: {
        ...defaultSiteSettings.theme,
        ...(parsed.theme ?? {}),
      },
    };
  } catch {
    return defaultSiteSettings;
  }
}

export function saveSiteSettings(settings: Partial<SiteSettings>) {
  const merged = {
    ...readSiteSettings(),
    ...settings,
    contact: { ...readSiteSettings().contact, ...(settings.contact ?? {}) },
    socials: { ...readSiteSettings().socials, ...(settings.socials ?? {}) },
    theme: { ...readSiteSettings().theme, ...(settings.theme ?? {}) },
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem("site_settings", JSON.stringify(merged));
  }

  return merged;
}

export const siteSettings = readSiteSettings();

export const tours: Tour[] = [
  {
    slug: "anakulam-jeep-safari",
    name: "Anakulam Jeep Safari",
    tagline: "Scenic mountain and viewpoint experience.",
    location: "Anakulam, Kerala",
    duration: "6 hours",
    price: 5500,
    vehicle: "Mahindra Thar 4x4",
    maxGuests: 6,
    rating: 4.9,
    reviews: 140,
    image: gaproad,
    overview:
      "Explore Anakulam, Kottapara View Point, waterfalls, tea plantations and scenic mountain destinations with Ram Adventure jeep safari tours.",
    highlights: [
      "Scenic mountain and viewpoint experience.",
      "Waterfall and tea plantation stops.",
      "Tiger Cave clearly marked as optional.",
      "A six-hour jeep safari experience.",
    ],
    itinerary: [
      { time: "Stop 1", title: "Kottapara View Point", detail: "Scenic mountain viewpoint." },
      { time: "Stop 2", title: "Kainagiri Waterfalls", detail: "Waterfall stop." },
      { time: "Stop 3", title: "Tea Plantation", detail: "Tea estate experience." },
      { time: "Stop 4", title: "Tiger Cave", detail: "Optional stop." },
      { time: "Stop 5", title: "33 Waterfall", detail: "Scenic waterfall circuit." },
      { time: "Stop 6", title: "Hanging Bridge", detail: "Viewpoint stop." },
      { time: "Stop 7", title: "Check Dam", detail: "Dam stop." },
      { time: "Stop 8", title: "Anakulam", detail: "Final destination." },
    ],
    included: [],
    excluded: [],
    pickup: "Pickup details can be confirmed by the administrator.",
    gallery: [gaproad, mattupetty, vattavada, topstation],
    faqs: [
      {
        q: "Is Tiger Cave optional?",
        a: "Yes. Tiger Cave is clearly marked as an optional stop.",
      },
      {
        q: "What is the trip duration?",
        a: "This experience runs for six hours.",
      },
    ],
  },
  {
    slug: "ponmudi-jeep-safari",
    name: "Ponmudi Jeep Safari",
    tagline: "Waterfalls, viewpoints and flexible trip timing.",
    location: "Ponmudi, Kerala",
    duration: "3 hours",
    price: 3000,
    vehicle: "Mahindra Thar 4x4",
    maxGuests: 6,
    rating: 4.8,
    reviews: 120,
    image: topstation,
    overview:
      "Discover Ripple Waterfalls, Hanging Bridge, Ponmudi Dam, Eco Point and Nadukani View Point with Ram Adventure jeep safari tours.",
    highlights: [
      "Sunrise trips available.",
      "Sunset trips available.",
      "Waterfalls and viewpoint circuit.",
      "Three-hour jeep safari experience.",
    ],
    itinerary: [
      { time: "Stop 1", title: "Ripple Waterfalls", detail: "Scenic waterfall stop." },
      { time: "Stop 2", title: "Hanging Bridge", detail: "Bridge stop." },
      { time: "Stop 3", title: "Ponmudi Dam", detail: "Dam stop." },
      { time: "Stop 4", title: "Ponmudi Eco Point", detail: "Eco point stop." },
      { time: "Stop 5", title: "Nadukani View Point", detail: "Panoramic viewpoint." },
    ],
    included: [],
    excluded: [],
    pickup: "Pickup details can be confirmed by the administrator.",
    gallery: [topstation, valleyImage, echopoint, gaproad],
    faqs: [
      {
        q: "Are sunrise and sunset slots available?",
        a: "Yes, sunrise and sunset departures may be offered when the administrator configures those slots as available.",
      },
      {
        q: "How long is the trip?",
        a: "This safari is a three-hour route.",
      },
    ],
  },
  {
    slug: "kallipara-view-point-safari",
    name: "Kallipara View Point & Mountain Peak Safari",
    tagline: "Mountain peak and scenic viewpoint experience.",
    location: "Ponmudi, Kerala",
    duration: "6 hours",
    price: 8000,
    vehicle: "Mahindra Thar 4x4",
    maxGuests: 6,
    rating: 4.9,
    reviews: 165,
    image: vattavada,
    overview:
      "Explore Kallipara View Point, Kallimali View Point, Ripple Waterfalls and scenic Ponmudi destinations with Ram Adventure.",
    highlights: [
      "Mountain peak and scenic viewpoint experience.",
      "Waterfall exploration.",
      "Multiple sightseeing stops.",
      "Six-hour jeep safari experience.",
    ],
    itinerary: [
      { time: "Stop 1", title: "Ripple Waterfalls", detail: "Waterfall stop." },
      { time: "Stop 2", title: "Hanging Bridge", detail: "Bridge stop." },
      { time: "Stop 3", title: "Ponmudi Dam", detail: "Dam stop." },
      { time: "Stop 4", title: "Ponmudi Eco Point", detail: "Eco point stop." },
      { time: "Stop 5", title: "Kallimali View Point", detail: "Scenic viewpoint." },
      { time: "Stop 6", title: "Koothungal Waterfalls", detail: "Waterfall stop." },
      { time: "Stop 7", title: "Marakkanm Waterfalls", detail: "Waterfall stop." },
      { time: "Stop 8", title: "Kallipara View Point", detail: "Final scenic stop." },
    ],
    included: [],
    excluded: [],
    pickup: "Pickup details can be confirmed by the administrator.",
    gallery: [vattavada, topstation, valleyImage, gaproad],
    faqs: [
      {
        q: "Does this include multiple viewpoints?",
        a: "Yes. The route includes several viewpoint and waterfall stops across the scenic Ponmudi region.",
      },
      {
        q: "What is the duration?",
        a: "This safari lasts six hours.",
      },
    ],
  },
];

export const whyCards = [
  { title: "Local Expertise", text: "Experienced Munnar drivers and guides." },
  { title: "Safe & Reliable", text: "Comfortable and dependable adventure experiences." },
  { title: "Authentic Experiences", text: "Discover places beyond normal tourist routes." },
  { title: "Flexible Tours", text: "Choose packages based on your schedule." },
  { title: "Comfortable Jeeps", text: "Adventure-ready vehicles." },
  { title: "24/7 Support", text: "Always available for assistance." },
];

export const stats = [
  { value: "5000+", label: "Travelers" },
  { value: "20+", label: "Routes" },
  { value: "10+", label: "Years Experience" },
  { value: "4.9/5", label: "Customer Rating" },
];

export const reviews = [
  {
    name: "Aditya Menon",
    from: "Bengaluru",
    text: "The Kolukkumalai sunrise run was the single best morning of our Kerala trip. Our driver knew exactly where to stop for light.",
    rating: 5,
  },
  {
    name: "Sarah Whitfield",
    from: "London",
    text: "Genuinely off the tourist trail. We ended up having tea with a family in a tea estate village. Unforgettable.",
    rating: 5,
  },
  {
    name: "Rahul & Divya",
    from: "Chennai",
    text: "Booked a custom two-day route for our honeymoon. Everything was on time, safe and beautifully planned.",
    rating: 5,
  },
  {
    name: "Thomas Kurian",
    from: "Kochi",
    text: "Third time with Ram Adventure. The jeeps are properly maintained and the drivers are the real highlight.",
    rating: 5,
  },
];

export const galleryCategories = [
  "All",
  "Jeep Safari",
  "Mountains",
  "Tea Plantations",
  "Adventure",
  "Munnar",
  "Travel Experiences",
] as const;

export const galleryItems = [
  { src: kolukkumalai, category: "Mountains", location: "Kolukkumalai", tall: true },
  { src: gaproad, category: "Jeep Safari", location: "Gap Road", tall: false },
  { src: experienceJeep, category: "Travel Experiences", location: "Munnar trails", tall: false },
  { src: mattupetty, category: "Munnar", location: "Mattupetty", tall: true },
  { src: vattavada, category: "Tea Plantations", location: "Vattavada", tall: false },
  { src: topstation, category: "Mountains", location: "Top Station", tall: true },
  { src: echopoint, category: "Munnar", location: "Echo Point", tall: false },
  { src: anayirankal, category: "Adventure", location: "Anayirankal", tall: false },
  { src: valleyImage, category: "Mountains", location: "Kundala valley", tall: true },
  { src: forestPoster, category: "Adventure", location: "Chinnakanal forest", tall: false },
  { src: heroPoster, category: "Munnar", location: "High range", tall: false },
];

export const vehicles = [
  {
    id: "thar",
    name: "Mahindra Thar 4x4",
    seats: "Up to 6 guests",
    note: "Open-top trail specialist",
  },
  {
    id: "bolero",
    name: "Mahindra Bolero",
    seats: "Up to 7 guests",
    note: "Comfort for full-day tours",
  },
  { id: "convoy", name: "Jeep Convoy", seats: "8+ guests", note: "Multiple jeeps for groups" },
];

export const pickupPoints = [
  "Munnar Town",
  "Chithirapuram",
  "Devikulam",
  "Chinnakanal",
  "Anachal",
  "Other (we will call you)",
];

export const contact = {
  phone: "+91 98470 00000",
  whatsapp: "+91 98470 00000",
  email: "hello@ramadventure.in",
  address: "Munnar, Idukki District, Kerala 685612",
};
