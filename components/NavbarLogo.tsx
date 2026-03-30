"use client";

import Image from "next/image";

const LOGO_SRC = "/Nova%20Net%20-%20Logo.jpg";

/** Logo without @imgly/background-removal (ONNX) — avoids Vercel/webpack build failures from onnxruntime-web. */
export default function NavbarLogo() {
  return (
    <span className="relative h-12 w-[176px] shrink-0 sm:h-[52px] sm:w-[212px]">
      <Image
        src={LOGO_SRC}
        alt="Nova Net"
        fill
        className="object-contain object-left mix-blend-multiply"
        sizes="240px"
        priority
      />
    </span>
  );
}
