/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Jamais d’optimisation payante Vercel sur /_next/image :
   * - loader personnalisé = l’URL finale pointe vers /public ou l’URL absolue telle quelle ;
   * - `unoptimized` en complément pour les chemins que Next traiterait encore par défaut.
   */
  images: {
    unoptimized: true,
    loader: "custom",
    loaderFile: "./image-loader.mjs",
  },
};

export default nextConfig;

