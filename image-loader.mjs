/**
 * Loader Next.js : renvoie l’URL telle quelle — aucun appel à /_next/image
 * (évite OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED sur Vercel).
 *
 * @param {{ src: string; width: number; quality?: number }} param0
 */
export default function imageLoader({ src }) {
  if (!src) return "";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }
  return `/${src}`;
}
