import { BrandLogo } from "./BrandLogo";
import { brand } from "@/content/home";

/** Minimal structural footer for phase one. Doubles as the #contact anchor. */
export function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-20 border-t border-border bg-surface">
      <div className="container-site flex flex-col gap-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <BrandLogo className="h-10" />
          <p className="mt-3 text-muted-foreground">
            People. Processes. Progress. <span className="text-gradient font-semibold">Together.</span>
          </p>
        </div>
      </div>
      <div className="container-site border-t border-border py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
