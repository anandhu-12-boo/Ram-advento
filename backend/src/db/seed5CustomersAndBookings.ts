import { connectMongoDB, MongoBooking, MongoTour, MongoUser } from "./mongodb.js";

const DEFAULT_TOURS = [
  {
    title: "Munnar Jeep Safari",
    slug: "munnar-jeep-safari",
    tagline: "The classic off-road introduction to the high range",
    description: "Half-day off-road run through tea estates and viewpoint trails.",
    category: "Jeep Safari",
    location: "Munnar, Kerala",
    duration: "4 Hours",
    price: 2500,
    max_guests: 6,
    vehicle: "Mahindra Thar 4x4",
  },
  {
    title: "Kolukkumalai Adventure",
    slug: "kolukkumalai-adventure",
    tagline: "Sunrise above the clouds at 7,900 ft",
    description: "Pre-dawn climb up India's highest tea plantation.",
    category: "Jeep Safari",
    location: "Kolukkumalai, Idukki",
    duration: "8 Hours",
    price: 4500,
    max_guests: 6,
    vehicle: "Mahindra Thar 4x4",
  },
];

const customersAndBookings = [
  {
    ref: "RAM-2026-001",
    user_id: "11111111-1111-4111-a111-111111111111",
    tour_slug: "munnar-jeep-safari",
    name: "Arjun Ramesh",
    email: "arjun.ramesh@gmail.com",
    phone: "+91 9876543210",
    date: "2026-09-25",
    time: "06:30 AM",
    guests: 4,
    vehicle: "Mahindra Thar 4x4",
    pickup: "Tea County Munnar",
    special: "Window seats preferred for nature photos",
    total_amount: 10000,
    booking_status: "confirmed",
    payment_status: "paid",
  },
  {
    ref: "RAM-2026-002",
    user_id: "22222222-2222-4222-a222-222222222222",
    tour_slug: "kolukkumalai-adventure",
    name: "Priya Nair",
    email: "priya.nair@yahoo.com",
    phone: "+91 9847123456",
    date: "2026-09-26",
    time: "04:30 AM",
    guests: 2,
    vehicle: "Mahindra Thar 4x4",
    pickup: "Sterling Munnar",
    special: "Celebrating anniversary",
    total_amount: 9000,
    booking_status: "confirmed",
    payment_status: "paid",
  },
  {
    ref: "RAM-2026-003",
    user_id: "33333333-3333-4333-a333-333333333333",
    tour_slug: "munnar-jeep-safari",
    name: "Rahul Verma",
    email: "rahul.verma@outlook.com",
    phone: "+91 9912345678",
    date: "2026-09-27",
    time: "07:00 AM",
    guests: 5,
    vehicle: "Mahindra Thar 4x4",
    pickup: "Blanket Hotel & Spa",
    special: "Family group with kids",
    total_amount: 12500,
    booking_status: "confirmed",
    payment_status: "paid",
  },
  {
    ref: "RAM-2026-004",
    user_id: "44444444-4444-4444-a444-444444444444",
    tour_slug: "kolukkumalai-adventure",
    name: "Sneha Kulkarni",
    email: "sneha.k@hotmail.com",
    phone: "+91 9765432109",
    date: "2026-09-28",
    time: "04:30 AM",
    guests: 3,
    vehicle: "Mahindra Thar 4x4",
    pickup: "Chithirapuram Resort",
    special: "Need sunrise guidance",
    total_amount: 13500,
    booking_status: "confirmed",
    payment_status: "paid",
  },
  {
    ref: "RAM-2026-005",
    user_id: "55555555-5555-4555-a555-555555555555",
    tour_slug: "munnar-jeep-safari",
    name: "Vikram Malhotra",
    email: "vikram.m@gmail.com",
    phone: "+91 9823456789",
    date: "2026-09-29",
    time: "03:30 PM",
    guests: 4,
    vehicle: "Mahindra Thar 4x4",
    pickup: "Fragrant Nature Munnar",
    special: "Sunset photography trail",
    total_amount: 10000,
    booking_status: "confirmed",
    payment_status: "paid",
  },
];

async function seed() {
  console.log("🌱 Starting 5 Customers & Accepted Bookings seeding into MongoDB...");

  const mongoOk = await connectMongoDB();
  if (!mongoOk) {
    console.error("❌ Failed to connect to MongoDB.");
    process.exit(1);
  }

  // 1. Seed Tours
  for (const t of DEFAULT_TOURS) {
    await MongoTour.findOneAndUpdate({ slug: t.slug }, t, { upsert: true, returnDocument: "after" });
  }

  // 2. Seed Customers and Bookings
  for (const b of customersAndBookings) {
    // Upsert customer user
    await MongoUser.findOneAndUpdate(
      { email: b.email.toLowerCase() },
      {
        name: b.name,
        email: b.email.toLowerCase(),
        password: "CustomerPassword123!",
        role: "customer",
        phone: b.phone,
      },
      { upsert: true, returnDocument: "after" }
    );

    // Upsert booking
    await MongoBooking.findOneAndUpdate(
      { booking_id: b.ref },
      {
        booking_id: b.ref,
        user_id: b.user_id,
        tour_slug: b.tour_slug,
        customer_name: b.name,
        customer_email: b.email,
        customer_phone: b.phone,
        booking_date: b.date,
        time_slot: b.time,
        guests: b.guests,
        vehicle: b.vehicle,
        pickup_location: b.pickup,
        special_request: b.special,
        total_amount: b.total_amount,
        payment_status: b.payment_status,
        booking_status: b.booking_status,
      },
      { upsert: true, returnDocument: "after" }
    );
  }

  console.log("✅ 5 Customers & Bookings seeded successfully into MongoDB!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
