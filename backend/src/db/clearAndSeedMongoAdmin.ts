import {
  connectMongoDB,
  MongoUser,
  MongoTour,
  MongoAvailability,
  MongoBooking,
  MongoReview,
  MongoEnquiry,
} from "./mongodb.js";

const DEFAULT_TOURS = [
  {
    title: "Munnar Jeep Safari",
    slug: "munnar-jeep-safari",
    tagline: "The classic off-road introduction to the high range",
    description: "A half-day off-road run through tea estates, forest trails and viewpoints that regular cars never reach.",
    category: "Jeep Safari",
    location: "Munnar, Kerala",
    duration: "4 Hours",
    price: 2500,
    max_guests: 6,
    vehicle: "Mahindra Thar 4x4",
    images: ["gaproad", "mattupetty", "heroPoster"],
    highlights: ["Off-road tea estate trails", "Mist valley viewpoints", "Local driver-guide"],
    available: true,
    featured: true,
  },
  {
    title: "Kolukkumalai Adventure",
    slug: "kolukkumalai-adventure",
    tagline: "Sunrise above the clouds at 7,900 ft",
    description: "A pre-dawn climb up one of India's roughest jeep tracks to the highest tea plantation in the world.",
    category: "Jeep Safari",
    location: "Kolukkumalai, Idukki",
    duration: "8 Hours",
    price: 4500,
    max_guests: 6,
    vehicle: "Mahindra Thar 4x4",
    images: ["kolukkumalai", "topstation"],
    highlights: ["Sunrise above the cloud line", "World's highest tea estate"],
    available: true,
    featured: true,
  },
];

async function run() {
  console.log("🧹 Connecting to MongoDB & clearing database...");
  const connected = await connectMongoDB();
  if (!connected) {
    console.error("❌ MongoDB connection failed");
    process.exit(1);
  }

  // 1. Clear all MongoDB collections
  await Promise.all([
    MongoUser.deleteMany({}),
    MongoBooking.deleteMany({}),
    MongoTour.deleteMany({}),
    MongoAvailability.deleteMany({}),
    MongoReview.deleteMany({}),
    MongoEnquiry.deleteMany({}),
  ]);
  console.log("🗑️ Cleared all MongoDB collections successfully.");

  // 2. Create the FIRST Admin account in MongoDB
  const adminAccount = await MongoUser.create({
    name: "Ram Adventure Admin",
    email: "admin@ramtours.com",
    password: "AdminPassword123!",
    role: "admin",
    phone: "+91 9876543210",
  });
  console.log("👑 Created First Admin Account in MongoDB:");
  console.log(`   - Name: ${adminAccount.name}`);
  console.log(`   - Email: ${adminAccount.email}`);
  console.log(`   - Role: ${adminAccount.role}`);

  // 3. Seed initial default tours
  await MongoTour.insertMany(DEFAULT_TOURS);
  console.log("✨ Seeded initial tour catalog into MongoDB.");

  console.log("✅ MongoDB reset & Admin creation finished successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Execution error:", err);
  process.exit(1);
});
