import { ArrowRight, Sparkles, Check, Database, Cpu, ShieldCheck, Workflow } from "lucide-react";

import infinity3d from "@/assets/infinity-3d.jpg";
import { Button } from "@/components/ui/button";
import { hero } from "@/content/home";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero({ ready }: { ready: boolean }) {
  return (
    <section
      id="home"
      data-ready={ready}
      className="relative overflow-hidden pt-[calc(var(--header-h)+1.5rem)] pb-10 md:pb-14 lg:flex lg:min-h-[100dvh] lg:items-center lg:pt-[calc(var(--header-h)+1.5rem)] lg:pb-10"
    >
      <div className="bg-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-site relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
        {/* Copy */}
        <div className="max-w-xl">
          <p
            className="hero-enter inline-flex items-center gap-2.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-soft"
            style={d(0)}
          >
            <span className="pulse-dot size-2 rounded-full bg-gradient-brand" />
            {hero.eyebrow}
          </p>

          <h1 className="display-xl mt-4 sm:mt-5 text-foreground">
            <span className="hero-enter block" style={d(100)}>
              {hero.headline.lead}
            </span>
            <span className="hero-enter block" style={d(220)}>
              {hero.headline.middle} <span className="text-gradient">{hero.headline.highlight}</span>
            </span>
          </h1>

          <p className="lead hero-enter mt-4 max-w-lg" style={d(380)}>
            {hero.body}
          </p>

          <div className="hero-enter mt-6 flex flex-col gap-3 sm:flex-row" style={d(520)}>
            <Button asChild variant="brand" size="xl" className="group">
              <a href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild variant="brandOutline" size="xl">
              <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
            </Button>
          </div>

          <ul className="hero-enter mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4" style={d(660)}>
            {hero.pillars.map(({ icon: Icon, title, sub }) => (
              <li key={title} className="flex flex-col gap-2">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-brand-purple">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-semibold text-foreground">{title}</span>
                  <span className="text-muted-foreground">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div
      className="hero-enter hero-enter--scale relative mx-auto aspect-square w-full max-w-[var(--visual-max)]"
      style={d(450)}
      aria-hidden="true"
    >
      <div className="ambient-orb ambient-orb--blue left-[18%] top-[12%] size-[60%]" />
      <div className="ambient-orb ambient-orb--red bottom-[8%] right-[10%] size-[40%]" />

      {/* connection lines */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="hero-line" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="var(--brand-red)" />
          </linearGradient>
        </defs>
        {[
          "M24,24 C30,38 38,44 50,50",
          "M78,18 C70,34 62,42 50,50",
          "M76,80 C68,66 60,58 50,50",
          "M22,78 C30,66 40,58 50,50",
        ].map((p) => (
          <path
            key={p}
            d={p}
            fill="none"
            stroke="url(#hero-line)"
            strokeOpacity="0.5"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            className="flow-line"
          />
        ))}
      </svg>

      {/* centre object */}
      <div className="blend-on-white absolute inset-x-[8%] top-[28%] float-a">
        <img
          src={infinity3d}
          alt=""
          width={1280}
          height={896}
          className="h-auto w-full"
          fetchPriority="high"
        />
      </div>

      {/* Dashboard panel */}
      <div className="glass-card float-b absolute left-0 top-[3%] w-[48%] p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
            Operations
          </p>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-bold text-brand-purple sm:text-[0.65rem]">
            +24%
          </span>
        </div>
        <p className="mt-1 font-display text-base font-bold text-foreground sm:text-xl">Live overview</p>
        <div className="mt-3 flex h-12 items-end gap-1.5 sm:h-16">
          {[40, 62, 48, 78, 58, 90, 72].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md bg-gradient-brand"
              style={{ height: `${h}%`, opacity: 0.35 + i * 0.09 }}
            />
          ))}
        </div>
      </div>

      {/* AI insight */}
      <div className="glass-card float-c absolute right-0 top-[9%] w-[42%] p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground sm:size-8">
            <Sparkles className="size-4" />
          </span>
          <p className="text-xs font-bold text-foreground sm:text-sm">AI forecast</p>
        </div>
        <p className="mt-2 text-[0.68rem] leading-snug text-muted-foreground sm:text-xs">
          Demand expected to rise next week. Stock plan updated.
        </p>
      </div>

      {/* CRM */}
      <div className="glass-card float-c absolute bottom-[10%] left-[2%] hidden w-[40%] p-3 sm:block sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CRM</p>
        <div className="mt-2 flex -space-x-2">
          {["bg-brand-blue", "bg-brand-purple", "bg-brand-magenta", "bg-brand-red"].map((c) => (
            <span key={c} className={`size-7 rounded-full border-2 border-background ${c}`} />
          ))}
        </div>
        <p className="mt-2 font-display text-sm font-bold text-foreground">Pipeline in sync</p>
      </div>

      {/* Workflow */}
      <div className="glass-card float-a absolute bottom-[3%] right-[1%] w-[48%] p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <Workflow className="size-4 text-primary" />
          <p className="text-xs font-bold text-foreground sm:text-sm">Workflow automation</p>
        </div>
        <ol className="mt-2.5 space-y-1.5">
          {["Request captured", "Approved", "Invoice sent"].map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-[0.68rem] text-muted-foreground sm:text-xs">
              <span
                className={`inline-flex size-4 items-center justify-center rounded-full ${
                  i < 2 ? "bg-gradient-brand text-primary-foreground" : "border border-border"
                }`}
              >
                {i < 2 && <Check className="size-2.5" />}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* floating tech tiles */}
      {[
        { Icon: Database, cls: "left-[44%] top-[6%] float-b" },
        { Icon: Cpu, cls: "right-[4%] top-[46%] float-a" },
        { Icon: ShieldCheck, cls: "left-[2%] top-[50%] float-c" },
      ].map(({ Icon, cls }, i) => (
        <span
          key={i}
          className={`absolute inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-background text-brand-purple shadow-float sm:size-12 ${cls}`}
        >
          <Icon className="size-5" />
        </span>
      ))}
    </div>
  );
}
