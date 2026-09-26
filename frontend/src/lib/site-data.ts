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

export const tours: Tour[] = [
  {
    slug: "munnar-jeep-safari",
    name: "Munnar Jeep Safari",
    tagline: "The classic off-road introduction to the high range",
    location: "Munnar, Kerala",
    duration: "4 Hours",
    price: 2500,
    vehicle: "Mahindra Thar 4x4",
    maxGuests: 6,
    rating: 4.9,
    reviews: 412,
    image: gaproad,
    overview:
      "A half-day off-road run through tea estates, forest trails and viewpoints that regular cars never reach. Driven by local drivers who grew up on these trails.",
    highlights: [
      "Off-road tea estate trails",
      "Mist valley viewpoints",
      "Local driver-guide with stories of the range",
      "Tea factory stop",
    ],
    itinerary: [
      { time: "06:30", title: "Pickup", detail: "Hotel pickup anywhere in Munnar town." },
      {
        time: "07:15",
        title: "Estate trails",
        detail: "Off-road climb through working tea estates.",
      },
      { time: "08:30", title: "Viewpoint break", detail: "Chai on a ridge above the mist line." },
      { time: "10:30", title: "Drop off", detail: "Return to your stay." },
    ],
    included: ["4x4 jeep with driver", "Fuel and permits", "Bottled water", "Photo stops"],
    excluded: ["Meals", "Entry tickets", "Personal expenses"],
    pickup: "Free pickup within Munnar town limits. Outside pickups on request.",
    gallery: [gaproad, mattupetty, heroPoster, forestPoster],
    faqs: [
      {
        q: "Is it safe for children?",
        a: "Yes. Trails are driven slowly and our jeeps are maintained weekly.",
      },
      {
        q: "What if it rains?",
        a: "Munnar rain is part of the experience. Severe weather means a free reschedule.",
      },
    ],
  },
  {
    slug: "kolukkumalai-adventure",
    name: "Kolukkumalai Adventure",
    tagline: "Sunrise above the clouds at 7,900 ft",
    location: "Kolukkumalai, Idukki",
    duration: "8 Hours",
    price: 4500,
    vehicle: "Mahindra Thar 4x4",
    maxGuests: 6,
    rating: 5.0,
    reviews: 288,
    image: kolukkumalai,
    overview:
      "A pre-dawn climb up one of India's roughest jeep tracks to the highest tea plantation in the world, timed for sunrise over a sea of clouds.",
    highlights: [
      "Sunrise above the cloud line",
      "World's highest tea estate",
      "Colonial-era tea factory visit",
      "Sunrise point trek assistance",
    ],
    itinerary: [
      { time: "03:30", title: "Pickup", detail: "Early start from your Munnar stay." },
      {
        time: "05:00",
        title: "Off-road ascent",
        detail: "The famous rocky climb to Kolukkumalai.",
      },
      { time: "06:15", title: "Sunrise", detail: "Watch the range emerge from the clouds." },
      { time: "08:00", title: "Tea factory", detail: "Hand-rolled tea processing tour." },
      { time: "11:30", title: "Drop off", detail: "Back in Munnar by late morning." },
    ],
    included: [
      "4x4 jeep with driver",
      "Sunrise point guidance",
      "Fuel and permits",
      "Bottled water",
    ],
    excluded: ["Tea factory entry", "Breakfast", "Personal expenses"],
    pickup: "Pickup between 03:00 and 04:00 depending on your location.",
    gallery: [kolukkumalai, topstation, heroPoster, vattavada],
    faqs: [
      {
        q: "How rough is the track?",
        a: "Genuinely rough — that is the adventure. Not advised for severe back or neck issues.",
      },
      {
        q: "Will we see the sunrise every day?",
        a: "Clear skies are most likely between December and March.",
      },
    ],
  },
  {
    slug: "munnar-full-day-tour",
    name: "Munnar Full Day Tour",
    tagline: "Every viewpoint that matters, in one day",
    location: "Munnar, Kerala",
    duration: "8 Hours",
    price: 3500,
    vehicle: "Mahindra Bolero / Thar",
    maxGuests: 7,
    rating: 4.8,
    reviews: 531,
    image: mattupetty,
    overview:
      "A complete sightseeing day covering Mattupetty, Echo Point, Kundala, tea museums and forest viewpoints, with off-road detours between the crowds.",
    highlights: [
      "Mattupetty dam and Echo Point",
      "Kundala arch dam",
      "Tea plantation walk",
      "Off-road sunset viewpoint",
    ],
    itinerary: [
      { time: "08:30", title: "Pickup", detail: "Relaxed morning start." },
      { time: "09:30", title: "Mattupetty & Echo Point", detail: "Lake, dam and viewpoints." },
      { time: "12:30", title: "Lunch break", detail: "Local Kerala meal stop." },
      { time: "14:00", title: "Kundala & Top Station", detail: "High range panoramas." },
      { time: "17:00", title: "Drop off", detail: "Return by evening." },
    ],
    included: ["Vehicle with driver", "Fuel and parking", "All viewpoint stops", "Bottled water"],
    excluded: ["Entry tickets", "Meals", "Boating charges"],
    pickup: "Free pickup within Munnar town limits.",
    gallery: [mattupetty, echopoint, valleyImage, topstation],
    faqs: [
      {
        q: "Can we customise the stops?",
        a: "Yes — tell your driver in the morning and the route is adjusted.",
      },
      { q: "Is boating included?", a: "Boating tickets are paid directly at the lake." },
    ],
  },
  {
    slug: "custom-adventure",
    name: "Custom Adventure",
    tagline: "Built around your days, your pace, your people",
    location: "Munnar & Idukki high range",
    duration: "Flexible",
    price: 0,
    vehicle: "Your choice of 4x4",
    maxGuests: 12,
    rating: 4.9,
    reviews: 96,
    image: experienceJeep,
    overview:
      "Multi-day routes, honeymoon itineraries, photography trips, group convoys — tell us what you want to see and we build the trail around it.",
    highlights: [
      "Any combination of routes",
      "Multi-jeep convoys for groups",
      "Camping and homestay coordination",
      "Photography timing planned around light",
    ],
    itinerary: [
      {
        time: "Step 1",
        title: "Tell us your dates",
        detail: "Share your stay, dates and interests.",
      },
      {
        time: "Step 2",
        title: "We plan the route",
        detail: "A local driver-planner maps the trails.",
      },
      { time: "Step 3", title: "Confirm", detail: "Pay a small advance and your jeeps are held." },
    ],
    included: ["Route planning", "Jeeps and drivers", "Permits", "24/7 support line"],
    excluded: ["Stays and meals", "Entry tickets"],
    pickup: "Anywhere in Munnar, Devikulam, Chinnakanal or Anachal.",
    gallery: [experienceJeep, kolukkumalai, anayirankal, forestPoster],
    faqs: [
      {
        q: "Is there a minimum group size?",
        a: "No. We plan for couples and for groups of thirty.",
      },
      {
        q: "How is pricing decided?",
        a: "Based on distance, hours and number of jeeps. Quoted before you pay.",
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
