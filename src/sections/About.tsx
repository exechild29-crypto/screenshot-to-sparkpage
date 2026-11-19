import { Boxes, Building2, Workflow, BrainCircuit } from "lucide-react";

import aiCore from "@/assets/ai-core.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { about } from "@/content/home";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const areaIcons = [Boxes, Building2, Workflow, BrainCircuit];

export function About() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.18 });

  return (
    <section id="about" ref={ref} className={cn("section-pad relative overflow-hidden", inView && "is-in")}>
      <div className="container-site grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <AboutVisual />

        <div>
          <SectionHeading eyebrow={about.eyebrow} lead={about.heading.lead} highlight={about.heading.highlight} />
          <div className="mt-4 space-y-3">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="lead reveal" style={d(260 + i * 100)}>
                {p}
              </p>
            ))}
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {about.areas.map((a, i) => {
              const Icon = areaIcons[i % areaIcons.length] ?? Boxes;
              return (
                <li
                  key={a.title}
                  className="reveal group flex gap-4 rounded-2xl border border-border bg-background p-3.5 transition-shadow duration-300 hover:shadow-float"
                  style={d(420 + i * 80)}
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-purple transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-foreground">{a.title}</span>
                    <span className="text-sm text-muted-foreground">{a.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="reveal mt-5 flex flex-wrap items-center gap-2" style={d(780)}>
            <span className="mr-1 text-sm font-semibold text-foreground">Built for</span>
            {about.audiences.map((a) => (
              <span key={a} className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted-foreground">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutVisual() {
  const n = about.modules.length;
  const nodes = about.modules.map((label, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { label, x: 50 + 40 * Math.cos(a), y: 50 + 40 * Math.sin(a) };
  });

  return (
    <div className="reveal reveal--scale relative mx-auto aspect-square w-full max-w-[min(540px,var(--visual-max))]" style={d(300)} aria-hidden="true">
      <div className="ambient-orb ambient-orb--purple inset-[15%]" />
      <div className="ambient-orb ambient-orb--blue left-[40%] top-[5%] size-[40%]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="about-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="var(--brand-red)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="0.3" />
        <g className="spin-slow" style={{ transformOrigin: "50px 50px" }}>
          <circle cx="50" cy="50" r="47" fill="none" stroke="url(#about-line)" strokeOpacity="0.35" strokeWidth="0.3" strokeDasharray="0.6 2.4" />
        </g>
        {nodes.map((p, i) => (
          <g key={p.label}>
            <line
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              pathLength={1}
              stroke="url(#about-line)"
              strokeOpacity="0.55"
              strokeWidth="0.35"
              className="draw-line"
              style={d(600 + i * 90)}
            />
          </g>
        ))}
        {[
          [22, 30], [80, 26], [84, 70], [18, 72], [50, 10], [62, 88], [34, 86],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="0.9"
            fill={i % 2 ? "var(--brand-blue)" : "var(--brand-red)"}
            className="pulse-dot"
            style={{ animationDelay: `${i * 0.35}s`, transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>

      <div className="blend-on-white absolute inset-[22%] float-a">
        <img src={aiCore} alt="" width={1024} height={1024} loading="lazy" className="size-full object-contain" />
      </div>

      {nodes.map((p, i) => (
        <span
          key={p.label}
          className="reveal absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%`, ...d(800 + i * 90) }}
        >
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-float sm:text-sm",
              i % 2 ? "float-b" : "float-c",
            )}
          >
            <span className="size-1.5 rounded-full bg-gradient-brand" />
            {p.label}
          </span>
        </span>
      ))}
    </div>
  );
}
