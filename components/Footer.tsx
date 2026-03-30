"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSectionById } from "@/lib/scroll-to-section";
import NavbarLogo from "./NavbarLogo";

export default function Footer() {
  const router = useRouter();
  const { lang } = useLanguage();

  const copy =
    lang === "fr"
      ? {
          description:
            "Service professionnel de lavage extérieur haute performance dans la région du Grand Montréal.",
          company: "Entreprise",
          services: "Services",
          rights: "Tous droits réservés.",
          links: {
            company: [
              { label: "À propos", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Portfolio", href: "#resultats" },
              { label: "Contact", href: "#contact" },
            ],
            services: [
              { label: "Lavage de vitres", href: "#services" },
              { label: "Lavage à pression", href: "#services" },
              { label: "Scellant de pavés", href: "#services" },
              { label: "Sablage", href: "#services" },
            ],
          },
        }
      : {
          description:
            "High-performance professional exterior cleaning across Greater Montreal.",
          company: "Company",
          services: "Services",
          rights: "All rights reserved.",
          links: {
            company: [
              { label: "About", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Portfolio", href: "#resultats" },
              { label: "Contact", href: "#contact" },
            ],
            services: [
              { label: "Window Washing", href: "#services" },
              { label: "Pressure Washing", href: "#services" },
              { label: "Paver Sealing", href: "#services" },
              { label: "Sanding", href: "#services" },
            ],
          },
        };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);

      if (element) {
        scrollToSectionById(targetId);
      } else {
        router.push(href);
      }
    }
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-8 py-12 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center">
              <NavbarLogo />
            </div>
            <p className="text-[13px] leading-relaxed text-gray-600">
              {copy.description}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
              {copy.company}
            </h4>
            <div className="space-y-1.5">
              {copy.links.company.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block cursor-pointer text-[13px] text-gray-600 transition-colors hover:text-[#0f1f4b]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
              {copy.services}
            </h4>
            <div className="space-y-1.5">
              {copy.links.services.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block cursor-pointer text-[13px] text-gray-600 transition-colors hover:text-[#0f1f4b]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-5 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} Nova Net. {copy.rights}
        </div>
      </div>
    </footer>
  );
}
