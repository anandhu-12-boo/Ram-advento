import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { SafariSection } from "@/components/home/SafariSection";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { jeepImage } from "@/lib/site-data";

export const Route = createFileRoute("/safari")({
  component: SafariPage,
  head: () => ({
    meta: [
      { title: "Munnar Jeep Safari Routes | Ram Adventure" },
      {
        name: "description",
        content:
          "Off-road jeep safari routes across Munnar — Kolukkumalai, Top Station, Vattavada, Gap Road, Mattupetty and more, with local driver-guides.",
      },
      { property: "og:title", content: "Munnar Jeep Safari Routes | Ram Adventure" },
      {
        property: "og:description",
        content: "Nine signature off-road routes through Munnar's tea hills, valleys and forests.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/safari" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/safari" }],
  }),
});

function SafariPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Jeep Safari"
        title="Trails only a jeep can reach"
        text="Nine signature routes through the Munnar high range, each driven by someone who grew up on it."
        image={jeepImage}
      />
      <SafariSection />
      <ExperiencesSection />
      <FinalCta />
    </SiteShell>
  );
}
