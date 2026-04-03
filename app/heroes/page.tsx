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
    <main className="min-h-screen bg-slate-200 pb-20">
      <div className="sticky top-16 z-40 border-b border-slate-300 bg-white/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-lg font-semibold uppercase tracking-wide text-[#0f1f4b]">
            Hero comparison
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Scroll through each block. To use one on the homepage, set{" "}
            <code className="rounded-xs bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
              import Hero from &quot;@/components/…&quot;
            </code>{" "}
            in{" "}
            <code className="rounded-xs bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
              app/page.tsx
            </code>
            .
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-semibold text-[#0f1f4b] underline decoration-slate-300 underline-offset-4 hover:decoration-[#0f1f4b]"
          >
            Back to home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1680px] space-y-10 px-3 pt-8 sm:px-4">
        {variants.map((v, index) => (
          <section
            key={v.id}
            id={v.id}
            className="scroll-mt-[5.5rem] overflow-hidden rounded-xs border border-slate-300 bg-white shadow-md"
          >
            <div className="flex flex-col gap-0.5 border-b border-slate-200 bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-white">{v.title}</h2>
              <span className="font-mono text-[11px] text-slate-400">{v.file}</span>
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
