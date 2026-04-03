import { Suspense } from "react";
import HeroClassicBackdrop from "@/components/HeroClassicBackdrop";
import Services from "@/components/Services";
import Results from "@/components/Results";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Zones from "@/components/Zones";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import ReferralsPromo from "@/components/ReferralsPromo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroClassicBackdrop />
      <Services />
      <Results />
      <About />
      <Reviews />
      <Zones />
      <Process />
      <ReferralsPromo />
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
      <Footer />
    </main>
  );
}
