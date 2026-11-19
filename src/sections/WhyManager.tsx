import { useCallback, useRef, useState } from "react";

import managerHub from "@/assets/manager-hub.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { whyManager, type Feature } from "@/content/home";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const features = whyManager.features;
const RADIUS = 38; // % of stage
const INNER = 24; // inner ring the lines start from
const nodePos = features.map((_, i) => {
  const deg = -90 + (360 / features.length) * i;
  const a = (deg * Math.PI) / 180;
  return {
    deg,
    x: 50 + RADIUS * Math.cos(a),
    y: 50 + RADIUS * Math.sin(a),
    sx: 50 + INNER * Math.cos(a),
    sy: 50 + INNER * Math.sin(a),
  };
});

export function WhyManager() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = useCallback((e: React.KeyboardEvent, i: number) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const step = keys[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = (i + step + features.length) % features.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }, []);

  const current = features[active] ?? features[0];
  if (!current) return null;
  const shownActive = inView ? active : -1;

  return (
    <section
      id="why-manager"
      ref={ref}
      className={cn("section-pad relative overflow-hidden bg-surface", inView && "is-in")}
    >
      <div className="bg-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-site relative">
        <SectionHeading
          align="center"
          stacked
          className="max-w-3xl"
          eyebrow={whyManager.eyebrow}
          lead={whyManager.heading.lead}
          highlight={whyManager.heading.highlight}
          body={whyManager.body}
        />

        <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:mt-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          {/* Selectors — desktop */}
          <div role="tablist" aria-orientation="vertical" aria-label="Why the Manager" className="order-2 hidden flex-col gap-2 lg:order-1 lg:flex">
            {features.map((f, i) => (
              <button
                key={f.num}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`why-tab-${i}`}
                aria-selected={shownActive === i}
                aria-controls="why-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className="feature-item reveal reveal--left"
                style={d(500 + i * 90)}
              >
                <span className="feature-num pt-0.5">{f.num}</span>
                <span>
                  <span className="block font-display text-lg font-semibold text-foreground">{f.title}</span>
                  <span className="feature-desc">
                    <span className="overflow-hidden">
                      <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-muted-foreground">{f.text}</span>
                      <Highlights f={f} className="mt-3" />
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Central visual */}
          <div className="order-1 min-w-0 lg:order-2" id="why-panel" role="tabpanel" aria-labelledby={`why-tab-${active}`}>
            <Stage active={shownActive} onSelect={setActive} />

            {/* Selectors — mobile/tablet */}
            <div className="mt-6 lg:hidden">
              <div role="tablist" aria-label="Why the Manager" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
                {features.map((f, i) => (
                  <button
                    key={f.num}
                    role="tab"
                    aria-selected={active === i}
                    onClick={(e) => {
                      setActive(i);
                      e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                    }}
                    className="chip-tab reveal shrink-0 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all aria-selected:text-primary-foreground"
                    style={d(600 + i * 70)}
                  >
                    <span className="mr-1.5 opacity-70">{f.num}</span>
                    {f.short}
                  </button>
                ))}
              </div>
              <div key={active} className="glass-card mt-4 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="font-display text-sm font-bold text-gradient">{current.num}</p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">{current.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{current.text}</p>
                <Highlights f={current} className="mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights({ f, className }: { f: Feature; className?: string }) {
  return (
    <span className={cn("flex flex-wrap gap-2", className)}>
      {f.highlights.map((h) => (
        <span key={h} className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-brand-purple">
          {h}
        </span>
      ))}
    </span>
  );
}

function Stage({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const ActiveIcon = features[active]?.icon ?? null;
  const pointerDeg = (nodePos[active]?.deg ?? -90) + 90;

  return (
    <div className="reveal reveal--scale relative mx-auto aspect-square w-full max-w-[min(600px,calc(100dvh-var(--header-h)-12rem))] min-w-[min(100%,300px)]" style={d(250)}>
      <div className="ambient-orb ambient-orb--blue inset-[18%]" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--purple left-[45%] top-[10%] size-[35%]" aria-hidden="true" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="why-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="55%" stopColor="var(--brand-purple)" />
            <stop offset="100%" stopColor="var(--brand-red)" />
          </linearGradient>
          <linearGradient id="why-arc" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--brand-purple)" />
            <stop offset="100%" stopColor="var(--brand-red)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="0.3" strokeDasharray="0.5 1.5" />
        <circle cx="50" cy="50" r={INNER} fill="none" stroke="var(--border)" strokeWidth="0.25" />

        {/* Rotating emphasis arc that points at the active node */}
        <g
          style={{
            transform: `rotate(${pointerDeg}deg)`,
            transformOrigin: "50px 50px",
            transition: "transform 700ms var(--ease-out)",
            opacity: active >= 0 ? 1 : 0,
          }}
        >
          <path d="M36,28.5 A24,24 0 0 1 64,28.5" fill="none" stroke="url(#why-arc)" strokeWidth="1.1" strokeLinecap="round" />
        </g>

        {nodePos.map((p, i) => (
          <g key={i}>
            <line
              x1={p.sx}
              y1={p.sy}
              x2={p.x}
              y2={p.y}
              pathLength={1}
              stroke="var(--border)"
              strokeWidth="0.45"
              className="draw-line"
              style={d(500 + i * 120)}
            />
            <line
              x1={p.sx}
              y1={p.sy}
              x2={p.x}
              y2={p.y}
              stroke="url(#why-line)"
              strokeWidth="0.7"
              strokeLinecap="round"
              className={active === i ? "flow-line" : undefined}
              style={{
                opacity: active === i ? 1 : 0,
                transition: "opacity 400ms var(--ease-out)",
                strokeDasharray: "1.2 1.4",
              }}
            />
          </g>
        ))}
      </svg>

      {/* Central management object */}
      <div className="absolute inset-[27%]" aria-hidden="true">
        <div
          className="absolute inset-[8%] rounded-full bg-gradient-brand blur-3xl transition-opacity duration-700"
          style={{ opacity: active >= 0 ? 0.14 + active * 0.025 : 0 }}
        />
        <img
          src={managerHub}
          alt=""
          width={1024}
          height={1024}
          loading="lazy"
          className="blend-on-white float-a relative size-full object-contain"
        />
        {ActiveIcon && (
          <span
            key={active}
            className="absolute left-1/2 top-[6%] inline-flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-background text-brand-purple shadow-float animate-in fade-in zoom-in-50 duration-500 sm:size-11"
          >
            <ActiveIcon className="size-4 sm:size-5" />
          </span>
        )}
      </div>

      {/* Nodes */}
      {features.map((f, i) => {
        const p = nodePos[i];
        if (!p) return null;
        const Icon = f.icon;
        const labelBelow = p.y > 50;
        return (
          <button
            key={f.num}
            type="button"
            tabIndex={-1}
            aria-label={f.title}
            data-active={active === i}
            onClick={() => onSelect(i)}
            onMouseEnter={() => onSelect(i)}
            className="node reveal reveal--scale absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%`, ...d(800 + i * 120) }}
          >
            <span className="node__disc inline-flex size-11 items-center justify-center rounded-2xl sm:size-14">
              <Icon className="size-5 sm:size-6" />
            </span>
            <span
              className={cn(
                "absolute left-1/2 -translate-x-1/2",
                labelBelow ? "top-full mt-2.5" : "bottom-full mb-2.5",
              )}
            >
              <NodeLabel f={f} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function NodeLabel({ f }: { f: Feature }) {
  return (
    <span className="node__label whitespace-nowrap font-display text-xs font-semibold sm:text-sm">
      <span className="mr-1 opacity-60">{f.num}</span>
      {f.short}
    </span>
  );
}
