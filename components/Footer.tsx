"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Facebook, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSectionById } from "@/lib/scroll-to-section";
import HiringDialog from "./HiringDialog";
import NavbarLogo from "./NavbarLogo";

const PHONE_DISPLAY = "514-758-6241";
const PHONE_TEL = "tel:+15147586241";

export default function Footer() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [hiringOpen, setHiringOpen] = useState(false);

  const copy =
    lang === "fr"
      ? {
          description:
            "Service professionnel de lavage extérieur haute performance dans la région du Grand Montréal.",
          company: "Entreprise",
          services: "Services",
          rights: "Tous droits réservés.",
          phoneLabel: "Téléphone",
          hiringCta: "On embauche",
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
          phoneLabel: "Phone",
          hiringCta: "We're hiring",
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
            <a
              href={PHONE_TEL}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#0f1f4b] transition-colors hover:underline"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {copy.phoneLabel}
                </span>
                {PHONE_DISPLAY}
              </span>
            </a>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1aQPKtddCf/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-500 transition-colors hover:text-[#0f1f4b]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/nova-net-lavage-ext%C3%A9rieur/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-500 transition-colors hover:text-[#0f1f4b]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setHiringOpen(true)}
                className="text-[13px] font-semibold text-[#0f766e] transition-colors hover:text-[#0d9488] hover:underline"
              >
                {copy.hiringCta}
              </button>
            </div>
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
      <HiringDialog isOpen={hiringOpen} onClose={() => setHiringOpen(false)} />
    </footer>
  );
}
