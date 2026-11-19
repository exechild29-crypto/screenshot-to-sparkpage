import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "./BrandLogo";
import { Button } from "@/components/ui/button";
import { navItems } from "@/content/home";
import { cn } from "@/lib/utils";

const tracked = navItems.flatMap((n) => (n.href ? [n.href.slice(1)] : []));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      // The short footer never reaches the spy band, so mark the last item at page end.
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atEnd) setActive(tracked[tracked.length - 1] ?? "home");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy for the implemented sections
  useEffect(() => {
    const els = tracked.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      data-scrolled={scrolled || open}
      className="site-header fixed inset-x-0 top-0 z-50"
      style={{ height: "var(--header-h)" }}
    >
      <div className="container-site flex h-full items-center justify-between gap-6">
        <a href="#home" aria-label="DevOps Manager LLP — home" className="shrink-0">
          <BrandLogo className="h-10 md:h-12" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a href={item.href} className="nav-link" data-active={active === item.href.slice(1)}>
                    {item.label}
                  </a>
                ) : (
                  <span className="nav-link inline-flex items-center gap-1.5" aria-disabled="true" title="Coming soon">
                    {item.label}
                    <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Soon
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="brand" className="hidden h-11 px-6 sm:inline-flex">
            <a href="#contact">Get Started</a>
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-b border-border bg-background shadow-soft lg:hidden",
          open ? "block animate-in fade-in slide-in-from-top-2" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="container-site py-4">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-3.5 font-display text-lg font-semibold",
                      active === item.href.slice(1) ? "bg-surface text-primary" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex items-center justify-between px-3 py-3.5 font-display text-lg font-semibold text-muted-foreground"
                  >
                    {item.label}
                    <span className="text-xs font-bold uppercase tracking-wider">Soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <Button asChild variant="brand" size="xl" className="mt-3 w-full sm:hidden">
            <a href="#contact" onClick={() => setOpen(false)}>
              Get Started
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
