import { useEffect } from "react";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { SafariSection } from "@/components/home/SafariSection";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { jeepImage } from "@/lib/site-data";

export default function SafariPage() {
  useEffect(() => {
    document.title = "Munnar Jeep Safari Routes | Ram Adventure";
  }, []);

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
