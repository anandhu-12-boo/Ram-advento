import { useState, useEffect } from "react";
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

export default function HomePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Ram Adventure | Munnar Jeep Safari & Tours";
  }, []);

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
