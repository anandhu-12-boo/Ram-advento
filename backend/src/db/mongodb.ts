import mongoose from "mongoose";
import { config } from "../config/env.js";

export async function connectMongoDB(): Promise<boolean> {
  if (!config.mongodbUrl) {
    console.warn("⚠️ MONGODB_URL is not set.");
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    await mongoose.connect(config.mongodbUrl, {
      dbName: "ram_tours",
      serverSelectionTimeoutMS: 5000,
    });
    console.log("🍃 Connected successfully to MongoDB (ram_tours database)");
    return true;
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    return false;
  }
}

// Tour Schema
const TourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "Jeep Safari" },
    location: { type: String, default: "Munnar, Kerala" },
    duration: { type: String, default: "" },
    price: { type: Number, default: 0 },
    max_guests: { type: Number, default: 6 },
    vehicle: { type: String, default: "Mahindra Thar 4x4" },
    images: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    itinerary: { type: Array, default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    pickup_locations: { type: [String], default: [] },
    rating: { type: Number, default: 4.9 },
    review_count: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Availability Schema
const AvailabilitySchema = new mongoose.Schema(
  {
    tour_id: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    time_slot: { type: String, required: true },
    total_slots: { type: Number, default: 6 },
    booked_slots: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);
AvailabilitySchema.index({ tour_id: 1, date: 1, time_slot: 1 }, { unique: true });

// Booking Schema
const BookingSchema = new mongoose.Schema(
  {
    booking_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    tour_id: { type: String, default: "" },
    tour_slug: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_phone: { type: String, default: "" },
    booking_date: { type: String, required: true },
    time_slot: { type: String, required: true },
    guests: { type: Number, default: 1 },
    vehicle: { type: String, default: "" },
    pickup_location: { type: String, default: "" },
    special_request: { type: String, default: "" },
    total_amount: { type: Number, default: 0 },
    payment_status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    booking_status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled"], default: "pending" },
    payment_id: { type: String, default: null },
  },
  { timestamps: true }
);

// Review Schema
const ReviewSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    tour_id: { type: String, default: null },
    booking_id: { type: String, default: null },
    author_name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Enquiry Schema
const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "responded", "archived"], default: "new" },
  },
  { timestamps: true }
);

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MongoTour = mongoose.models.Tour || mongoose.model("Tour", TourSchema);
export const MongoAvailability = mongoose.models.Availability || mongoose.model("Availability", AvailabilitySchema);
export const MongoBooking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export const MongoReview = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export const MongoEnquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
export const MongoUser = mongoose.models.User || mongoose.model("User", UserSchema);
