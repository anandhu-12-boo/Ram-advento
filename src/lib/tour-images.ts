import kolukkumalai from "@/assets/dest-kolukkumalai.jpg";
import gaproad from "@/assets/dest-gaproad.jpg";
import mattupetty from "@/assets/dest-mattupetty.jpg";
import vattavada from "@/assets/dest-vattavada.jpg";
import topstation from "@/assets/dest-topstation.jpg";
import echopoint from "@/assets/dest-echopoint.jpg";
import anayirankal from "@/assets/dest-anayirankal.jpg";
import experienceJeep from "@/assets/experience-jeep.jpg";
import { valleyImage, forestPoster, heroPoster } from "@/lib/media";

/** Image keys stored on tours in the database, mapped to bundled assets. */
export const tourImageMap: Record<string, string> = {
  kolukkumalai,
  gaproad,
  mattupetty,
  vattavada,
  topstation,
  echopoint,
  anayirankal,
  jeep: experienceJeep,
  valley: valleyImage,
  forestPoster,
  heroPoster,
};

export const tourImageKeys = Object.keys(tourImageMap);

/** Resolves a stored image value: an asset key, or a full URL. */
export function resolveTourImage(value: string | undefined | null): string {
  if (!value) return heroPoster;
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return tourImageMap[value] ?? heroPoster;
}

export function resolveTourImages(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [heroPoster];
  return values.map(resolveTourImage);
}
