import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import HeroClassicBackdrop from "@/components/HeroClassicBackdrop";
import HeroGradientAurora from "@/components/HeroGradientAurora";
import HeroCinematic from "@/components/HeroCinematic";
import HeroEditorialFrame from "@/components/HeroEditorialFrame";

export const metadata: Metadata = {
  title: "Hero layouts (preview)",
  robots: { index: false, follow: false },
};

const variants = [
  {
    id: "preview-split",
    title: "Production — split column",
    file: "components/Hero.tsx",
    Component: Hero,
  },
  {
    id: "preview-classic",
    title: "Static-site style — backdrop + white fade",
    file: "components/HeroClassicBackdrop.tsx",
    Component: HeroClassicBackdrop,
  },
  {
    id: "preview-aurora",
    title: "Gradient aurora — frosted card on photo",
    file: "components/HeroGradientAurora.tsx",
    Component: HeroGradientAurora,
  },
  {
    id: "preview-cinematic",
    title: "Cinematic band — light copy on image",
    file: "components/HeroCinematic.tsx",
    Component: HeroCinematic,
  },
  {
    id: "preview-editorial",
    title: "Editorial — framed image panel",
    file: "components/HeroEditorialFrame.tsx",
    Component: HeroEditorialFrame,
  },
] as const;

export default function HeroesPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-200 pb-24 sm:pb-20">
      <div className="sticky top-16 z-40 border-b border-slate-300 bg-white/95 px-3 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:px-4 sm:py-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-base font-semibold uppercase tracking-wide text-[#0f1f4b] sm:text-lg">
            Hero comparison
          </h1>
          <p className="mt-2 text-xs leading-snug text-slate-600 sm:text-sm sm:leading-relaxed">
            <span className="sm:hidden">
              Scroll each block. Use your chosen hero in{" "}
              <code className="mt-1 block w-full overflow-x-auto rounded-xs bg-slate-100 px-2 py-1.5 text-left font-mono text-[11px] [scrollbar-width:thin]">
                app/page.tsx
              </code>
            </span>
            <span className="hidden sm:inline">
              Scroll through each block. To use one on the homepage, set{" "}
              <code className="rounded-xs bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                import Hero from &quot;@/components/…&quot;
              </code>{" "}
              in{" "}
              <code className="rounded-xs bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                app/page.tsx
              </code>
              .
            </span>
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xs px-3 text-sm font-semibold text-[#0f1f4b] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0f1f4b] active:bg-slate-100/80"
          >
            Back to home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1680px] space-y-6 px-3 pt-5 sm:space-y-10 sm:px-4 sm:pt-8 md:px-5">
        {variants.map((v, index) => (
          <section
            key={v.id}
            id={v.id}
            className="scroll-mt-[calc(var(--navbar-height)+0.75rem)] overflow-hidden rounded-xs border border-slate-300 bg-white shadow-md"
          >
            <div className="flex flex-col gap-1.5 border-b border-slate-200 bg-slate-900 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4 sm:py-3">
              <h2 className="text-left text-[13px] font-semibold leading-tight text-white sm:text-sm">
                {v.title}
              </h2>
              <span className="block max-w-full break-all font-mono text-[10px] leading-snug text-slate-400 sm:text-[11px] sm:break-normal">
                {v.file}
              </span>
            </div>
            <div className="bg-white">
              <v.Component
                sectionId={v.id}
                imagePriority={index === 0}
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
