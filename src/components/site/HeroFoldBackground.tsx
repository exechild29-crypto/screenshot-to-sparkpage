import { useEffect, useRef } from "react";

import { startFoldWave } from "@/lib/fold-wave";

/**
 * White 3D vertical-fold background for the homepage hero only.
 * A CSS gradient shows the static folds until WebGL takes over; the cursor
 * wave runs on devices with a fine pointer and without reduced motion.
 * Never captures pointer events, so buttons and links stay clickable.
 */
export function HeroFoldBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const host = wrap?.parentElement;
    if (!wrap || !canvas || !host) return;
    return startFoldWave(canvas, wrap, host);
  }, []);

  return (
    <div ref={wrapRef} className="hero-folds pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-folds__canvas" />
    </div>
  );
}
