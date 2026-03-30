/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pas d’API `/_next/image` (évite 402 / paiement sur l’optimiseur Vercel ; `<img>` sert les fichiers /public tels quels).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

