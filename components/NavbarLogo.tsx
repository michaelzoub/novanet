"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LOGO_SRC = "/Nova%20Net%20-%20Logo.jpg";

export default function NavbarLogo() {
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { removeBackground } = await import("@imgly/background-removal");
        const absolute = new URL(LOGO_SRC, window.location.origin).href;
        const blob = await removeBackground(absolute);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setCutoutUrl(objectUrl);
      } catch {}
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  if (cutoutUrl) {
    return (
      <img
        src={cutoutUrl}
        alt="Nova Net"
        className="h-11 w-auto max-w-[200px] object-contain object-left sm:h-12 sm:max-w-[220px]"
      />
    );
  }

  return (
    <span className="relative h-11 w-[160px] shrink-0 sm:h-12 sm:w-[190px]">
      <Image
        src={LOGO_SRC}
        alt="Nova Net"
        fill
        className="object-contain object-left mix-blend-multiply"
        sizes="220px"
        priority
      />
    </span>
  );
}
