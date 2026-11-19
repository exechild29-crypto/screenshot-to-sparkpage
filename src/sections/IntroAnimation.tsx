import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/hooks/use-in-view";
import type { Infinity3D } from "@/lib/infinity-3d";

type Phase = "idle" | "draw" | "reveal" | "zoom" | "done";

/** Lemniscate-style path that crosses smoothly through the centre. */
const INFINITY_PATH =
  "M100,50 C120,18 172,18 172,50 C172,82 120,82 100,50 C80,18 28,18 28,50 C28,82 80,82 100,50";

const TIMINGS = { draw: 1700, reveal: 900, zoom: 1000 };
/** How long the white screen may wait for the 3D logo before using the flat logo. */
const LOGO_LOAD_TIMEOUT = 2500;

type LogoMode = "pending" | "3d" | "svg";

type Props = {
  /** Fires when the zoom starts — the page behind can begin its entrance. */
  onEnter: () => void;
};

export function IntroAnimation({ onEnter }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const entered = useRef(false);

  const [logo, setLogo] = useState<LogoMode>("pending");
  const logoHost = useRef<HTMLDivElement>(null);
  const engine = useRef<Infinity3D | null>(null);
  const logoDecided = useRef(false);

  const enter = () => {
    if (entered.current) return;
    entered.current = true;
    onEnter();
  };

  // Load the 3D logo in the browser; fall back to the flat logo if WebGL is
  // missing or loading is slow. The sequence waits on a white screen meanwhile.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    const decide = (mode: Exclude<LogoMode, "pending">) => {
      if (logoDecided.current) return false;
      logoDecided.current = true;
      setLogo(mode);
      return true;
    };
    const timeout = window.setTimeout(() => decide("svg"), LOGO_LOAD_TIMEOUT);
    import("@/lib/infinity-3d")
      .then(({ createInfinity3D }) => {
        if (cancelled || !logoHost.current) return;
        const created = createInfinity3D(logoHost.current);
        if (!created) {
          decide("svg");
          return;
        }
        if (decide("3d")) engine.current = created;
        else created.dispose();
      })
      .catch(() => {
        if (!cancelled) decide("svg");
      });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      enter();
      setPhase("done");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
    // Runs once per full page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The original timeline, started once the logo is ready to draw.
  useEffect(() => {
    if (logo === "pending") return;
    // Never step back once the intro is finished (e.g. after "Skip intro").
    const advance = (next: Phase) => setPhase((prev) => (prev === "done" ? prev : next));
    const timers: number[] = [];
    const raf = requestAnimationFrame(() => advance("draw"));
    timers.push(window.setTimeout(() => advance("reveal"), TIMINGS.draw));
    timers.push(
      window.setTimeout(() => {
        advance("zoom");
        enter();
      }, TIMINGS.draw + TIMINGS.reveal),
    );
    timers.push(
      window.setTimeout(() => advance("done"), TIMINGS.draw + TIMINGS.reveal + TIMINGS.zoom),
    );
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo]);

  useEffect(() => {
    if (phase === "draw") engine.current?.start(TIMINGS.draw);
    if (phase === "done") {
      // The intro stays mounted but renders nothing: free the 3D scene now.
      engine.current?.dispose();
      engine.current = null;
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "zoom" || phase === "done") document.documentElement.style.overflow = "";
  }, [phase]);

  const skip = () => {
    if (!entered.current) {
      entered.current = true;
      onEnter();
    }
    setPhase("done");
  };

  if (phase === "done") return null;

  return (
    <div className="intro" data-phase={phase} role="presentation">
      <div className="intro__stage">
        <div className="relative aspect-[2/1] w-[min(68vw,360px)]">
          {logo === "svg" ? (
            <svg
              viewBox="0 0 200 100"
              className="h-auto w-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="intro-grad" x1="28" y1="0" x2="172" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--brand-red)" />
                  <stop offset="50%" stopColor="var(--brand-purple)" />
                  <stop offset="100%" stopColor="var(--brand-blue)" />
                </linearGradient>
                <filter id="intro-shadow" x="-20%" y="-40%" width="140%" height="180%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              {/* soft depth shadow */}
              <path
                d={INFINITY_PATH}
                pathLength={1}
                className="intro__path"
                fill="none"
                stroke="url(#intro-grad)"
                strokeOpacity="0.35"
                strokeWidth="14"
                strokeLinecap="round"
                filter="url(#intro-shadow)"
                transform="translate(0 6)"
              />
              {/* body */}
              <path
                d={INFINITY_PATH}
                pathLength={1}
                className="intro__path"
                fill="none"
                stroke="url(#intro-grad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <div ref={logoHost} className="intro__logo3d" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="intro__word">
            <span className="text-brand-red">DevOps</span>{" "}
            <span className="text-gradient">MANAGER LLP</span>
          </p>
          <p className="intro__tag">Modern Business Management Suite</p>
        </div>
      </div>
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        Skip intro
      </button>
    </div>
  );
}
