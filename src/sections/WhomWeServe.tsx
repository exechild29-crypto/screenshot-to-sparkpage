import educationImg from "@/assets/industry-education.jpg";
import retailImg from "@/assets/industry-retail.jpg";
import startupsImg from "@/assets/industry-startups.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { IndustryMockup } from "@/components/site/mockups/IndustryMockups";
import { whomWeServe, type Industry } from "@/content/home";
import { useInView } from "@/hooks/use-in-view";
import { exploreHref } from "@/lib/explore-link";
import { cn } from "@/lib/utils";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const photos: Record<Industry["id"], string> = {
  education: educationImg,
  startups: startupsImg,
  "ecommerce-retail": retailImg,
};

/** Section 05 — editorial three-panel industry showcase (photo + floating software preview). */
export function WhomWeServe() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });
  const { industries, closing } = whomWeServe;

  return (
    <section id="industries" ref={ref} className={cn("section-pad relative overflow-hidden !pb-8 lg:!pb-10", inView && "is-in")}>
      <div className="container-site relative">
        <div className="grid items-end gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <SectionHeading eyebrow={whomWeServe.eyebrow} lead={whomWeServe.heading.lead} highlight={whomWeServe.heading.highlight} />
          <p className="lead reveal max-w-xl lg:pb-1.5" style={d(260)}>
            {whomWeServe.body}
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-7 lg:grid-cols-3 lg:gap-6">
          {industries.map((ind, i) => (
            <li
              key={ind.id}
              className={cn("reveal", i === 2 && "md:col-span-2 lg:col-span-1")}
              style={d(380 + i * 130)}
            >
              <IndustryCard ind={ind} index={i} wideOnTablet={i === 2} />
            </li>
          ))}
        </ul>

        <div className="reveal mt-7 flex flex-col gap-1.5 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:mt-8" style={d(800)}>
          <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {closing.title.split(". ")[0]}. <span className="text-gradient">{closing.title.split(". ")[1]}</span>
          </p>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">{closing.text}</p>
        </div>
      </div>
    </section>
  );
}

function IndustryCard({ ind, index, wideOnTablet }: { ind: Industry; index: number; wideOnTablet: boolean }) {
  return (
    <a
      href={exploreHref(ind.link)}
      aria-label={`${ind.title}: ${whomWeServe.exploreLabel}`}
      className={cn(
        `industry-card ind-${ind.accent} group h-full`,
        wideOnTablet && "md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:items-stretch",
      )}
    >
      <div className="relative">
        <div className="industry-card__media aspect-[4/3]">
          <div className="industry-photo size-full" style={d(450 + index * 130)}>
            <img
              src={photos[ind.id]}
              alt={ind.imageAlt}
              width={960}
              height={720}
              loading="lazy"
              decoding="async"
              className="industry-photo__img size-full object-cover"
            />
          </div>
        </div>
        <div
          className={cn(
            "reveal reveal--scale absolute -bottom-7 right-3 w-[62%] max-w-[15rem] sm:right-4 sm:w-[58%]",
            wideOnTablet && "md:max-lg:bottom-4",
          )}
          style={d(700 + index * 130)}
          aria-hidden="true"
        >
          <IndustryMockup id={ind.id} />
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-5 pt-10 sm:px-6 sm:pb-6 sm:pt-11", wideOnTablet && "md:max-lg:justify-center md:max-lg:pt-6")}>
        <p className="ui-ind-text flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.18em]">
          <span className="text-muted-foreground">{ind.num}</span>
          <span className="ui-ind-fill h-px w-5" />
          {ind.title}
        </p>
        <h3 className="mt-2.5 text-xl font-semibold leading-snug text-foreground">{ind.headline}</h3>
      </div>
    </a>
  );
}
