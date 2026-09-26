import { MongoTour } from "./mongodb.js";

const DEFAULT_TOURS = [
  {
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
      { time: "10:30", title: "Drop off", detail: "Return to your stay." }
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
      { time: "11:30", title: "Drop off", detail: "Back in Munnar by late morning." }
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
      { time: "17:00", title: "Drop off", detail: "Return by evening." }
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
      { time: "Step 3", title: "Confirm", detail: "Pay a small advance and your jeeps are held." }
    ],
    inclusions: ["Route planning", "Jeeps and drivers", "Permits", "24/7 support line"],
    exclusions: ["Stays and meals", "Entry tickets"],
    pickup_locations: ["Munnar Town", "Chithirapuram", "Devikulam", "Chinnakanal", "Anachal", "Other (we will call you)"],
    rating: 4.9,
    review_count: 96,
    available: true,
    featured: false,
  }
];

export async function seedMongoTours() {
  try {
    const count = await MongoTour.countDocuments();
    if (count === 0) {
      await MongoTour.insertMany(DEFAULT_TOURS);
      console.log("🌱 Seeded initial tours into MongoDB!");
    }
  } catch (err: any) {
    console.error("Failed to seed MongoDB tours:", err.message);
  }
}
