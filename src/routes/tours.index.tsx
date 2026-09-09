import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { PackagesSection } from "@/components/home/PackagesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalCta } from "@/components/home/FinalCta";
import { heroPoster } from "@/lib/media";

export const Route = createFileRoute("/tours/")({
  component: ToursPage,
  head: () => ({
    meta: [
      { title: "Munnar Tour Packages & Prices | Ram Adventure" },
      {
        name: "description",
        content:
          "Jeep safari and sightseeing packages in Munnar from ₹2,500 — half day safari, Kolukkumalai sunrise, full day tour and custom adventures.",
      },
      { property: "og:title", content: "Munnar Tour Packages & Prices | Ram Adventure" },
      {
        property: "og:description",
        content: "Half-day safaris, Kolukkumalai sunrise runs, full-day tours and custom routes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/tours" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tours" }],
  }),
});

function ToursPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Tour Packages"
        title="Pick your adventure"
        text="Transparent pricing, adventure-ready jeeps and drivers who know the range by heart."
        image={heroPoster}
      />
      <PackagesSection />
      <ReviewsSection />
      <FinalCta />
    </SiteShell>
  );
}
