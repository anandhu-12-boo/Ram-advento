import { useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { AboutMunnar } from "@/components/home/AboutMunnar";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalCta } from "@/components/home/FinalCta";
import { valleyImage } from "@/lib/media";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Ram Adventure | Munnar Jeep Safari Team";
  }, []);

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
