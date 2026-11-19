import { useEffect, useRef, type ReactNode } from "react";

import { prefersReducedMotion } from "@/hooks/use-in-view";
import { edgeStrength, slideProgress } from "@/lib/slide-over";

/**
 * Hero → About only: the hero stays pinned (once its bottom reaches the viewport
 * bottom) while the About panel scrolls up over it like a sheet. Movement is
 * native scrolling, so it tracks slow and fast scrolls 1:1 with no snapping;
 * a rAF only updates the edge shadow and corner radius.
 * The #home anchor is an in-flow marker so the nav link and scroll spy keep
 * working while the hero is pinned. Reduced motion: plain scrolling.
 */
export function HeroSlideOver({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!root || !stage || !panel) return;

    const setHeight = () => root.style.setProperty("--hero-h", `${stage.offsetHeight}px`);
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(stage);

    if (prefersReducedMotion()) return () => ro.disconnect();
    root.setAttribute("data-armed", "true");

    let raf = 0;
    let lastP = -1;
    const update = () => {
      raf = 0;
      const p = slideProgress(panel.getBoundingClientRect().top, window.innerHeight);
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      panel.style.setProperty("--slide-p", p.toFixed(4));
      panel.style.setProperty("--slide-edge", edgeStrength(p).toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeAttribute("data-armed");
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-slide">
      <span id="home" className="hero-slide__anchor" aria-hidden="true" />
      <div ref={stageRef} className="hero-slide__stage">
        {hero}
      </div>
      <div ref={panelRef} className="hero-slide__panel">
        {children}
      </div>
    </div>
  );
}
