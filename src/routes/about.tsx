import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { AboutMunnar } from "@/components/home/AboutMunnar";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalCta } from "@/components/home/FinalCta";
import { valleyImage } from "@/lib/media";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Ram Adventure | Munnar Jeep Safari Team" },
      {
        name: "description",
        content:
          "Ram Adventure is a Munnar jeep safari company run by local drivers with over ten years on the high range trails of Kerala.",
      },
      { property: "og:title", content: "About Ram Adventure | Munnar Jeep Safari Team" },
      {
        property: "og:description",
        content: "Local drivers, adventure-ready jeeps and ten years of Munnar trails.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About Us"
        title="Born on these hills"
        text="Ram Adventure began with one jeep, one driver and a belief that Munnar is best met off the tar road."
        image={valleyImage}
      />
      <AboutMunnar />
      <ExperiencesSection />
      <ReviewsSection />
      <FinalCta />
    </SiteShell>
  );
}
