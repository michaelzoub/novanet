"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const router = useRouter();
  const { lang } = useLanguage();

  const copy =
    lang === "fr"
      ? {
          description:
            "Service professionnel de lavage exterieur haute performance dans la region du Grand Montreal.",
          company: "Entreprise",
          services: "Services",
          legal: "Legal",
          rights: "Tous droits reserves.",
          links: {
            company: [
              { label: "A propos", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Portfolio", href: "#resultats" },
              { label: "Contact", href: "#contact" },
            ],
            services: [
              { label: "Lavage de Vitres", href: "#services" },
              { label: "Lavage a Pression", href: "#services" },
              { label: "Scellant de Paves", href: "#services" },
              { label: "Sablage", href: "#services" },
            ],
            legal: [
              { label: "Politique de confidentialite", href: "#" },
              { label: "Conditions d'utilisation", href: "#" },
              { label: "Mentions legales", href: "#" },
            ],
          },
        }
      : {
          description:
            "High-performance professional exterior cleaning across Greater Montreal.",
          company: "Company",
          services: "Services",
          legal: "Legal",
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
            legal: [
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Use", href: "#" },
              { label: "Legal Notice", href: "#" },
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
        const navbarHeight = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--navbar-height")
            .replace("px", "") || "64",
          10,
        );
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        router.push(href);
      }
    }
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-8 py-12 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 text-xl font-bold text-[#0f1f4b]">Nova Net</div>
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
                  className="block cursor-pointer text-[13px] text-gray-600 transition-colors hover:text-[#2563eb]"
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
                  className="block cursor-pointer text-[13px] text-gray-600 transition-colors hover:text-[#2563eb]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
              {copy.legal}
            </h4>
            <div className="space-y-1.5">
              {copy.links.legal.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block cursor-pointer text-[13px] text-gray-600 transition-colors hover:text-[#2563eb]"
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
