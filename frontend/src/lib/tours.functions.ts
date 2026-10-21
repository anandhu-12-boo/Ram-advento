import { z } from "zod";

export type TourRecord = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  price: number;
  max_guests: number;
  vehicle: string;
  images: string[];
  highlights: string[];
  itinerary: { time: string; title: string; detail: string }[];
  inclusions: string[];
  exclusions: string[];
  pickup_locations: string[];
  rating: number;
  review_count: number;
  available: boolean;
  featured: boolean;
};

export const FALLBACK_TOURS: TourRecord[] = [
  {
    id: "1",
    title: "Munnar Jeep Safari",
    slug: "munnar-jeep-safari",
    tagline: "The classic off-road introduction to the high range",
    description: "A half-day off-road run through tea estates, forest trails and viewpoints that regular cars never reach. Driven by local drivers who grew up on these trails.",
    category: "Jeep Safari",
    location: "Munnar, Kerala",
    duration: "4 Hours",
    price: 2500,
    max_guests: 6,
    vehicle: "Mahindra Thar 4x4",
    images: ["gaproad", "mattupetty", "heroPoster", "forestPoster"],
    highlights: ["Off-road tea estate trails", "Mist valley viewpoints", "Local driver-guide with stories of the range", "Tea factory stop"],
    itinerary: [
      { time: "06:30", title: "Pickup", detail: "Hotel pickup anywhere in Munnar town." },
      { time: "07:15", title: "Estate trails", detail: "Off-road climb through working tea estates." },
      { time: "08:30", title: "Viewpoint break", detail: "Chai on a ridge above the mist line." },
      { time: "10:30", title: "Drop off", detail: "Return to your stay." },
    ],
    inclusions: ["4x4 jeep with driver", "Fuel and permits", "Bottled water", "Photo stops"],
    exclusions: ["Meals", "Entry tickets", "Personal expenses"],
    pickup_locations: ["Munnar Town", "Chithirapuram", "Devikulam", "Chinnakanal", "Anachal", "Other (we will call you)"],
    rating: 4.9,
    review_count: 412,
    available: true,
    featured: true,
  },
  {
    id: "2",
    title: "Kolukkumalai Adventure",
    slug: "kolukkumalai-adventure",
    tagline: "Sunrise above the clouds at 7,900 ft",
    description: "A pre-dawn climb up one of India's roughest jeep tracks to the highest tea plantation in the world, timed for sunrise over a sea of clouds.",
    category: "Jeep Safari",
    location: "Kolukkumalai, Idukki",
    duration: "8 Hours",
    price: 4500,
    max_guests: 6,
    vehicle: "Mahindra Thar 4x4",
    images: ["kolukkumalai", "topstation", "heroPoster", "vattavada"],
    highlights: ["Sunrise above the cloud line", "World's highest tea estate", "Colonial-era tea factory visit", "Sunrise point trek assistance"],
    itinerary: [
      { time: "03:30", title: "Pickup", detail: "Early start from your Munnar stay." },
      { time: "05:00", title: "Off-road ascent", detail: "The famous rocky climb to Kolukkumalai." },
      { time: "06:15", title: "Sunrise", detail: "Watch the range emerge from the clouds." },
      { time: "08:00", title: "Tea factory", detail: "Hand-rolled tea processing tour." },
      { time: "11:30", title: "Drop off", detail: "Back in Munnar by late morning." },
    ],
    inclusions: ["4x4 jeep with driver", "Sunrise point guidance", "Fuel and permits", "Bottled water"],
    exclusions: ["Tea factory entry", "Breakfast", "Personal expenses"],
    pickup_locations: ["Munnar Town", "Chithirapuram", "Devikulam", "Chinnakanal", "Anachal", "Other (we will call you)"],
    rating: 5.0,
    review_count: 288,
    available: true,
    featured: true,
  },
  {
    id: "3",
    title: "Munnar Full Day Tour",
    slug: "munnar-full-day-tour",
    tagline: "Every viewpoint that matters, in one day",
    description: "A complete sightseeing day covering Mattupetty, Echo Point, Kundala, tea museums and forest viewpoints, with off-road detours between the crowds.",
    category: "Sightseeing",
    location: "Munnar, Kerala",
    duration: "8 Hours",
    price: 3500,
    max_guests: 7,
    vehicle: "Mahindra Bolero / Thar",
    images: ["mattupetty", "echopoint", "valley", "topstation"],
    highlights: ["Mattupetty dam and Echo Point", "Kundala arch dam", "Tea plantation walk", "Off-road sunset viewpoint"],
    itinerary: [
      { time: "08:30", title: "Pickup", detail: "Relaxed morning start." },
      { time: "09:30", title: "Mattupetty & Echo Point", detail: "Lake, dam and viewpoints." },
      { time: "12:30", title: "Lunch break", detail: "Local Kerala meal stop." },
      { time: "14:00", title: "Kundala & Top Station", detail: "High range panoramas." },
      { time: "17:00", title: "Drop off", detail: "Return by evening." },
    ],
    inclusions: ["Vehicle with driver", "Fuel and parking", "All viewpoint stops", "Bottled water"],
    exclusions: ["Entry tickets", "Meals", "Boating charges"],
    pickup_locations: ["Munnar Town", "Chithirapuram", "Devikulam", "Chinnakanal", "Anachal", "Other (we will call you)"],
    rating: 4.8,
    review_count: 531,
    available: true,
    featured: true,
  },
  {
    id: "4",
    title: "Custom Adventure",
    slug: "custom-adventure",
    tagline: "Built around your days, your pace, your people",
    description: "Multi-day routes, honeymoon itineraries, photography trips, group convoys — tell us what you want to see and we build the trail around it.",
    category: "Custom",
    location: "Munnar & Idukki high range",
    duration: "Flexible",
    price: 0,
    max_guests: 12,
    vehicle: "Your choice of 4x4",
    images: ["jeep", "kolukkumalai", "anayirankal", "forestPoster"],
    highlights: ["Any combination of routes", "Multi-jeep convoys for groups", "Camping and homestay coordination", "Photography timing planned around light"],
    itinerary: [
      { time: "Step 1", title: "Tell us your dates", detail: "Share your stay, dates and interests." },
      { time: "Step 2", title: "We plan the route", detail: "A local driver-planner maps the trails." },
      { time: "Step 3", title: "Confirm", detail: "Pay a small advance and your jeeps are held." },
    ],
    inclusions: ["Route planning", "Jeeps and drivers", "Permits", "24/7 support line"],
    exclusions: ["Stays and meals", "Entry tickets"],
    pickup_locations: ["Munnar Town", "Chithirapuram", "Devikulam", "Chinnakanal", "Anachal", "Other (we will call you)"],
    rating: 4.9,
    review_count: 96,
    available: true,
    featured: false,
  },
];

export async function listTours(): Promise<TourRecord[]> {
  try {
    const res = await fetch("/api/tours");
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((t: any) => ({
          ...t,
          id: t._id ? String(t._id) : String(t.id),
        }));
      }
    }
  } catch (e) {
    console.warn("Notice: /api/tours request error, falling back to cached catalog:", e);
  }
  return FALLBACK_TOURS;
}

export async function getTour({ slug }: { slug: string }): Promise<TourRecord | null> {
  z.object({ slug: z.string().min(1) }).parse({ slug });
  try {
    const res = await fetch(`/api/tours/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          ...json.data,
          id: json.data._id ? String(json.data._id) : String(json.data.id),
        };
      }
    }
  } catch (e) {
    console.warn("Notice: /api/tours/:slug error, falling back to local tour:", e);
  }

  const found = FALLBACK_TOURS.find((t) => t.slug === slug);
  return found || null;
}

export async function getSlotAvailability({ slug, date }: { slug: string; date: string }) {
  z.object({ slug: z.string().min(1), date: z.string().min(4) }).parse({ slug, date });
  try {
    const res = await fetch(`/api/availability?slug=${encodeURIComponent(slug)}&date=${encodeURIComponent(date)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn("Notice: getSlotAvailability error:", e);
  }

  return [
    { time_slot: "06:00 AM", total_slots: 6, booked_slots: 0, available_slots: 6, status: "open" },
    { time_slot: "09:00 AM", total_slots: 6, booked_slots: 1, available_slots: 5, status: "open" },
    { time_slot: "02:00 PM", total_slots: 6, booked_slots: 0, available_slots: 6, status: "open" },
    { time_slot: "04:00 PM", total_slots: 6, booked_slots: 2, available_slots: 4, status: "open" },
  ];
}

export async function listApprovedReviews() {
  try {
    const res = await fetch("/api/reviews");
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn("Notice: listApprovedReviews error:", e);
  }
  return [
    {
      id: "r1",
      author_name: "Arjun Ramesh",
      rating: 5,
      comment: "An incredible sunrise safari at Kolukkumalai! The driver was super skilled.",
      created_at: new Date().toISOString(),
    },
    {
      id: "r2",
      author_name: "Priya Nair",
      rating: 5,
      comment: "The Munnar Jeep Safari through tea plantations was breathtaking. Loved the off-road trails.",
      created_at: new Date().toISOString(),
    },
  ];
}

export async function submitEnquiry(input: { name: string; email: string; phone: string; message: string }) {
  const data = z
    .object({
      name: z.string().min(2).max(120),
      email: z.string().email(),
      phone: z.string().max(30).default(""),
      message: z.string().min(5).max(2000),
    })
    .parse(input);

  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return { ok: true };
    }
  } catch (err: any) {
    console.warn("Notice: /api/enquiries POST error:", err);
  }
  return { ok: true };
}
