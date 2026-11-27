import { UserRound } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { founders, type Founder } from "@/content/home";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Founders — renders real profiles from `founders.profiles`; shows placeholder cards until they are added. */
export function Founders() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 });
  const hasProfiles = founders.profiles.length > 0;
  const cards: (Founder | null)[] = hasProfiles ? founders.profiles : Array.from({ length: founders.placeholderCount }, () => null);

  return (
    <section id="founders" ref={ref} className={cn("section-pad relative overflow-hidden", inView && "is-in")}>
      <div className="container-site relative">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          eyebrow={founders.eyebrow}
          lead={founders.heading.lead}
          highlight={founders.heading.highlight}
          body={founders.body}
        />
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:gap-6">
          {cards.map((f, i) => (
            <li key={f?.name ?? i} className="reveal" style={d(360 + i * 120)}>
              <FounderCard founder={f} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FounderCard({ founder }: { founder: Founder | null }) {
  return (
    <article className="glass-card flex h-full flex-col items-center p-7 text-center">
      <div className="relative size-28 overflow-hidden rounded-full bg-surface p-[3px]" style={{ backgroundImage: "var(--gradient-brand)" }}>
        <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-background">
          {founder?.photo ? (
            <img src={founder.photo} alt={founder.name} className="size-full object-cover" loading="lazy" />
          ) : (
            <UserRound className="size-12 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </div>
      {founder ? (
        <>
          <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{founder.name}</h3>
          <p className="mt-1 text-sm font-semibold text-gradient">{founder.role}</p>
          {founder.bio && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{founder.bio}</p>}
          {founder.links && founder.links.length > 0 && (
            <ul className="mt-4 flex gap-3">
              {founder.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <p className="mt-5 font-display text-lg font-semibold text-foreground">{founders.placeholder.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{founders.placeholder.text}</p>
        </>
      )}
    </article>
  );
}
