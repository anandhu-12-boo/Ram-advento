import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { IntroLoader } from "@/components/IntroLoader";
import { SiteShell } from "@/components/SiteShell";
import { AboutMunnar } from "@/components/home/AboutMunnar";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { HeroSection } from "@/components/home/HeroSection";
import { PackagesSection } from "@/components/home/PackagesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { SafariSection } from "@/components/home/SafariSection";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Ram Adventure | Munnar Jeep Safari & Tours" },
      {
        name: "description",
        content:
          "Explore Munnar with Ram Adventure. Experience unforgettable jeep safaris, mountain trails, sightseeing tours and authentic Kerala adventures.",
      },
      { property: "og:title", content: "Ram Adventure | Munnar Jeep Safari & Tours" },
      {
        property: "og:description",
        content:
          "Cinematic jeep safaris across Munnar — Kolukkumalai sunrise, Top Station, Vattavada and the trails only locals know.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "Ram Adventure",
          description: "Munnar Jeep Safari & Tours",
          areaServed: "Munnar, Kerala, India",
          slogan: "Adventure Begins Where The Road Ends.",
        }),
      },
    ],
  }),
});

function Home() {
  // The intro is rendered in the server markup too, so it covers the screen from
  // the very first paint on every load and never depends on hydration timing.
  const [ready, setReady] = useState(true);

  return (
    <>
      <IntroLoader onDone={() => setReady(true)} />
      <SiteShell>
        <HeroSection ready={ready} />
        <AboutMunnar />
        <SafariSection limit={6} />
        <PackagesSection />
        <ExperiencesSection />
        <GalleryPreview />
        <ReviewsSection />
        <FinalCta />
      </SiteShell>
    </>
  );
}
