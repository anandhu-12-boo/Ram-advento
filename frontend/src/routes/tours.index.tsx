import { useEffect } from "react";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { PackagesSection } from "@/components/home/PackagesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalCta } from "@/components/home/FinalCta";
import { heroPoster } from "@/lib/media";

export default function ToursPage() {
  useEffect(() => {
    document.title = "Munnar Tour Packages & Prices | Ram Adventure";
  }, []);

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
