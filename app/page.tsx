import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Results from "@/components/Results";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Zones from "@/components/Zones";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Results />
      <About />
      <Reviews />
      <Zones />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
