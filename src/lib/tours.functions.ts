import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

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

const TOUR_COLUMNS =
  "id,title,slug,tagline,description,category,location,duration,price,max_guests,vehicle,images,highlights,itinerary,inclusions,exclusions,pickup_locations,rating,review_count,available,featured";

export async function listTours(): Promise<TourRecord[]> {
  try {
    const { data, error } = await supabase
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("available", true)
      .order("price", { ascending: true });
    if (!error && data && data.length > 0) {
      return data as unknown as TourRecord[];
    }
  } catch (e) {
    console.warn("Notice: listTours Supabase query failed, falling back to local fallback:", e);
  }
  return [];
}

export async function getTour({ slug }: { slug: string }): Promise<TourRecord | null> {
  z.object({ slug: z.string().min(1) }).parse({ slug });
  try {
    const { data: tour, error } = await supabase
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();
    if (!error && tour) {
      return tour as unknown as TourRecord;
    }
  } catch (e) {
    console.warn("Notice: getTour error:", e);
  }
  return null;
}

export async function getSlotAvailability({ slug, date }: { slug: string; date: string }) {
  z.object({ slug: z.string().min(1), date: z.string().min(4) }).parse({ slug, date });
  try {
    const { data: tour } = await supabase
      .from("tours")
      .select("id,max_guests")
      .eq("slug", slug)
      .maybeSingle();
    if (!tour) return [];
    const { data: rows } = await supabase
      .from("availability")
      .select("time_slot,total_slots,booked_slots,available_slots,status")
      .eq("tour_id", tour.id)
      .eq("date", date);
    return (rows ?? []).map((r) => ({
      time_slot: r.time_slot,
      total_slots: r.total_slots,
      booked_slots: r.booked_slots,
      available_slots: r.available_slots ?? r.total_slots - r.booked_slots,
      status: r.status,
    }));
  } catch (e) {
    console.warn("Notice: getSlotAvailability error:", e);
    return [];
  }
}

export async function listApprovedReviews() {
  try {
    const { data } = await supabase
      .from("reviews")
      .select("id,author_name,rating,comment,created_at,tour_id")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);
    return data ?? [];
  } catch (e) {
    console.warn("Notice: listApprovedReviews error:", e);
    return [];
  }
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

  const { error } = await supabase.from("contact_enquiries").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });
  if (error) throw new Error("We could not send your message. Please try again or call us.");
  return { ok: true };
}
