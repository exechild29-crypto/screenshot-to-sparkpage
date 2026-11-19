import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  lead: string;
  highlight: string;
  body?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  /** Put the highlighted phrase on its own line (from sm up). */
  stacked?: boolean;
  className?: string;
};

/** Eyebrow + headline with a gradient highlight + optional lead. Children reveal via parent `.is-in`. */
export function SectionHeading({ eyebrow, lead, highlight, body, align = "left", as: Tag = "h2", stacked = false, className }: Props) {
  const center = align === "center";
  return (
    <div className={cn(center && "mx-auto text-center", className)}>
      <p className={cn("eyebrow reveal", center && "justify-center")} style={{ "--d": "0ms" } as React.CSSProperties}>
        {eyebrow}
      </p>
      <Tag className="display-lg reveal mt-3 sm:mt-4 text-foreground" style={{ "--d": "120ms" } as React.CSSProperties}>
        {lead} {stacked && <br className="hidden sm:block" />}
        <span className="text-gradient">{highlight}</span>
      </Tag>
      {body && (
        <p
          className={cn("lead reveal mt-3 sm:mt-4 max-w-2xl", center && "mx-auto")}
          style={{ "--d": "240ms" } as React.CSSProperties}
        >
          {body}
        </p>
      )}
    </div>
  );
}
