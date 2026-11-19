import type { PlannedLink } from "@/content/home";

/** Where an "Explore Solutions" card goes: its detail page once live, otherwise the contact area (never a broken page). */
export const FALLBACK_HREF = "#contact";

export function exploreHref(link: PlannedLink) {
  return link.live ? link.route : FALLBACK_HREF;
}
