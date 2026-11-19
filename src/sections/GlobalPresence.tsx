import { useCallback, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { globalPresence, type PresenceLocation } from "@/content/home";
import { useInView } from "@/hooks/use-in-view";
import { MAP_HEIGHT, MAP_WIDTH, arcPath, buildDotPath, project, type Point } from "@/lib/world-map";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const locations = globalPresence.locations;
type LocationId = PresenceLocation["id"];

/**
 * Mangalore and Bangalore sit ~3° apart, so their pins are fanned out into the ocean
 * with a leader line back to the true point. Offsets are in map units.
 */
const PIN_LAYOUT: Record<LocationId, { dx: number; dy: number; label: "top" | "bottom"; align: "center" | "start" }> = {
  dubai: { dx: 0, dy: 0, label: "top", align: "center" },
  mangalore: { dx: -42, dy: 44, label: "bottom", align: "center" },
  bangalore: { dx: 42, dy: 44, label: "bottom", align: "center" },
  california: { dx: 0, dy: 0, label: "top", align: "start" },
};

const points = locations.map((loc) => {
  const anchor = project(loc.lat, loc.lon);
  const pin = PIN_LAYOUT[loc.id];
  return { id: loc.id, anchor, pin: { x: anchor.x + pin.dx, y: anchor.y + pin.dy } as Point, offset: pin.dx !== 0 || pin.dy !== 0 };
});
const pinOf = (id: LocationId) => points.find((p) => p.id === id)?.pin ?? project(0, 0);

const ROUTES: { from: LocationId; to: LocationId; bend: number; future?: boolean }[] = [
  { from: "california", to: "dubai", bend: 0.22, future: true },
  { from: "dubai", to: "mangalore", bend: 0.28 },
  { from: "dubai", to: "bangalore", bend: 0.2 },
  { from: "mangalore", to: "bangalore", bend: -0.32 },
];
const routes = ROUTES.map((r) => ({ ...r, d: arcPath(pinOf(r.from), pinOf(r.to), r.bend) }));
const DOTS = buildDotPath();

export function GlobalPresence() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shownActive = inView ? active : -1;

  const onKey = useCallback((e: React.KeyboardEvent, i: number) => {
    const n = locations.length;
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % n,
      ArrowDown: (i + 1) % n,
      ArrowLeft: (i - 1 + n) % n,
      ArrowUp: (i - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    cardRefs.current[next]?.focus();
  }, []);

  return (
    <section id="global-presence" ref={ref} className={cn("section-pad relative overflow-hidden", inView && "is-in")}>
      <div className="bg-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--blue left-[8%] top-[30%] size-[32%]" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--purple right-[6%] top-[42%] size-[28%]" aria-hidden="true" />

      <div className="container-site relative">
        <SectionHeading
          align="center"
          stacked
          className="max-w-3xl"
          eyebrow={globalPresence.eyebrow}
          lead={globalPresence.heading.lead}
          highlight={globalPresence.heading.highlight}
          body={globalPresence.body}
        />

        <WorldMap active={shownActive} onSelect={setActive} />

        <div
          className="reveal mx-auto mt-3 flex max-w-[1120px] flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:justify-between"
          style={d(700)}
        >
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <span className="gp-legend gp-legend--live" aria-hidden="true" />
              {globalPresence.legend.operational}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="gp-legend gp-legend--soon" aria-hidden="true" />
              {globalPresence.legend.comingSoon}
            </span>
          </div>
          <span>{globalPresence.note}</span>
        </div>

        <div
          role="radiogroup"
          aria-label="Our locations"
          className="mx-auto mt-5 grid max-w-[1120px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {locations.map((loc, i) => (
            <LocationCard
              key={loc.id}
              loc={loc}
              selected={shownActive === i}
              focusable={active === i}
              delay={850 + i * 90}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onSelect={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorldMap({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const activeId = locations[active]?.id;

  return (
    <div className="gp-map reveal reveal--soft mx-auto mt-6 max-w-[1120px] lg:mt-8" style={d(300)}>
      <div className="overflow-hidden px-2 py-4 sm:px-6 sm:py-6">
        {/* Slightly wider than the frame on phones so markers stay tappable; edges are ocean/Arctic. */}
        <div
          className="relative -ml-[9%] w-[118%] sm:ml-0 sm:w-full"
          style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
          role="img"
          aria-label={globalPresence.mapLabel}
        >
          <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <linearGradient id="gp-route" gradientUnits="userSpaceOnUse" x1="140" y1="0" x2="760" y2="0">
                <stop offset="0%" stopColor="var(--brand-blue)" />
                <stop offset="100%" stopColor="var(--brand-purple)" />
              </linearGradient>
              <mask id="gp-future-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT}>
                <path
                  d={routes[0]?.d ?? ""}
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  pathLength={1}
                  className="draw-line"
                  style={d(900)}
                />
              </mask>
            </defs>

            <path d={DOTS} className="gp-land" strokeWidth="3.1" strokeLinecap="round" fill="none" />

            {/* Routes sit behind the markers */}
            {routes.map((r, i) => {
              const lit = activeId === r.from || activeId === r.to;
              return (
                <g key={`${r.from}-${r.to}`} className="gp-route" data-lit={lit}>
                  {r.future ? (
                    <path
                      d={r.d}
                      fill="none"
                      stroke="url(#gp-route)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeDasharray="5 6"
                      mask="url(#gp-future-mask)"
                    />
                  ) : (
                    <path
                      d={r.d}
                      fill="none"
                      stroke="url(#gp-route)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      pathLength={1}
                      className="draw-line"
                      style={d(1100 + i * 160)}
                    />
                  )}
                </g>
              );
            })}

            {/* True positions for fanned-out pins */}
            {points
              .filter((p) => p.offset)
              .map((p, i) => (
                <g key={p.id} className="reveal" style={d(950 + i * 100)}>
                  <line
                    x1={p.anchor.x}
                    y1={p.anchor.y}
                    x2={p.pin.x}
                    y2={p.pin.y}
                    className="gp-leader"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <circle cx={p.anchor.x} cy={p.anchor.y} r="3" className="gp-anchor" />
                </g>
              ))}
          </svg>

          {locations.map((loc, i) => {
            const p = points[i];
            if (!p) return null;
            const layout = PIN_LAYOUT[loc.id];
            const isActive = active === i;
            return (
              <button
                key={loc.id}
                type="button"
                tabIndex={-1}
                aria-label={`${loc.name}, ${loc.country} — ${loc.statusLabel}`}
                data-active={isActive}
                data-dim={active >= 0 && !isActive}
                data-status={loc.status}
                data-accent={loc.accent}
                onClick={() => onSelect(i)}
                onMouseEnter={() => onSelect(i)}
                className="gp-marker reveal reveal--scale absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-11"
                style={{
                  left: `${(p.pin.x / MAP_WIDTH) * 100}%`,
                  top: `${(p.pin.y / MAP_HEIGHT) * 100}%`,
                  zIndex: isActive ? 2 : 1,
                  ...d(650 + i * 140),
                }}
              >
                <span className="gp-marker__dot" />
                <span
                  className={cn(
                    "gp-pin-label pointer-events-none absolute",
                    layout.label === "top" ? "bottom-full mb-0.5 sm:mb-1" : "top-full mt-0.5 sm:mt-1",
                    layout.align === "center" ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-4",
                  )}
                  data-show={isActive}
                  aria-hidden="true"
                >
                  <span className="block whitespace-nowrap font-display text-[11px] font-semibold text-foreground sm:text-sm">
                    {loc.name}
                    <span className="hidden font-sans font-medium text-muted-foreground sm:inline">, {loc.country}</span>
                  </span>
                  {loc.status === "coming-soon" ? (
                    <span className="mt-1 hidden items-center gap-2 sm:flex">
                      <span className="gp-soon-badge">{loc.statusLabel}</span>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">{globalPresence.comingSoonMessage}</span>
                    </span>
                  ) : (
                    <span className="mt-0.5 hidden whitespace-nowrap text-xs text-muted-foreground sm:block">{loc.statusLabel}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  loc: PresenceLocation;
  selected: boolean;
  focusable: boolean;
  delay: number;
  ref: React.Ref<HTMLButtonElement>;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

function LocationCard({ loc, selected, focusable, delay, ref, onSelect, onKeyDown }: CardProps) {
  const soon = loc.status === "coming-soon";
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={focusable ? 0 : -1}
      data-accent={loc.accent}
      data-status={loc.status}
      onClick={onSelect}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onKeyDown={onKeyDown}
      className="gp-card reveal flex flex-col p-3.5 text-left sm:p-4"
      style={d(delay)}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="gp-card__icon inline-flex size-10 items-center justify-center rounded-xl">
          <MapPin className="size-5" />
        </span>
        <span className="gp-card__num font-display text-sm font-bold">{loc.num}</span>
      </span>
      <span className="mt-3 block font-display text-lg font-semibold leading-tight text-foreground sm:text-xl">{loc.name}</span>
      <span className="mt-0.5 block text-sm text-muted-foreground">{loc.country}</span>
      <span className="mt-auto pt-3">
        {soon ? (
          <span className="gp-soon-badge">{loc.statusLabel}</span>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs font-semibold leading-tight text-foreground sm:text-[0.8rem]">
            <span className="gp-status-dot" aria-hidden="true" />
            {loc.statusLabel}
          </span>
        )}
      </span>
    </button>
  );
}
