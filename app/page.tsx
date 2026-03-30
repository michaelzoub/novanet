import { Suspense } from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Results from "@/components/Results";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Zones from "@/components/Zones";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import ReferralsPromo from "@/components/ReferralsPromo";
import Footer from "@/components/Footer";
import HomePagePresence from "@/components/HomePagePresence";

export default function Home() {
  return (
    <HomePagePresence>
      <Hero />
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
    </HomePagePresence>
  );
}
