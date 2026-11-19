import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { SolutionMockup } from "@/components/site/mockups/SolutionMockups";
import { whatWeDo, type Capability } from "@/content/home";
import { useInView } from "@/hooks/use-in-view";
import { exploreHref } from "@/lib/explore-link";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** 12-column spans on desktop (7/5 then 5/7); on tablet the large panels take the full row. */
const spans: Record<Capability["id"], string> = {
  "business-software": "md:col-span-2 lg:col-span-7",
  "workflow-automation": "lg:col-span-5",
  "crm-erp": "lg:col-span-5",
  "ai-systems": "md:col-span-2 lg:col-span-7",
};

/** Section 06 — asymmetric bento grid of capabilities, each with a custom software preview. */
export function WhatWeDo() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 });
  const { capabilities, closing } = whatWeDo;

  return (
    <section id="what-we-do" ref={ref} className={cn("what-we-do section-pad relative overflow-hidden", inView && "is-in")}>
      <div className="container-site relative">
        <SectionHeading
          className="max-w-2xl"
          eyebrow={whatWeDo.eyebrow}
          lead={whatWeDo.heading.lead}
          highlight={whatWeDo.heading.highlight}
          body={whatWeDo.body}
        />

        <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-10 lg:grid-cols-12 lg:gap-6">
          {capabilities.map((c, i) => (
            <li key={c.id} className={cn("reveal", spans[c.id])} style={d(360 + i * 120)}>
              <CapabilityPanel cap={c} index={i} />
            </li>
          ))}
        </ul>

        <div className="reveal mt-10 max-w-3xl lg:mt-12" style={d(820)}>
          <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {closing.lead} <span className="text-gradient">{closing.highlight}</span>
          </p>
          <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">{closing.text}</p>
        </div>
      </div>
    </section>
  );
}

function CapabilityPanel({ cap, index }: { cap: Capability; index: number }) {
  const large = cap.size === "large";
  return (
    <a
      href={exploreHref(cap.link)}
      aria-label={`${cap.title}: ${whatWeDo.exploreLabel}`}
      className="bento-card group flex h-full flex-col"
    >
      <div className={cn("p-5 sm:p-6", large && "lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8")}>
        <div className="max-w-md">
          <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <span className="text-muted-foreground">{cap.num}</span>
            <span className="h-px w-5 bg-gradient-brand" />
            {cap.title}
          </p>
          <h3 className="mt-2.5 text-xl font-semibold leading-snug text-foreground sm:text-[1.4rem]">{cap.headline}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{cap.text}</p>
        </div>
        <span className={cn("mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary", large && "lg:mt-0")}>
          {whatWeDo.exploreLabel}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
        </span>
      </div>

      <div className="bento-card__stage mt-auto px-4 pt-4 sm:px-6 sm:pt-5" aria-hidden="true">
        <div className="reveal reveal--soft" style={d(560 + index * 120)}>
          <div className="bento-card__mock">
            <SolutionMockup id={cap.id} />
          </div>
        </div>
      </div>
    </a>
  );
}
