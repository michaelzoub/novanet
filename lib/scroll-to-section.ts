/** Smooth-scroll to an element id (respects CSS scroll-margin-top on sections). */
export function scrollToSectionById(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
