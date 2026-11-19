// The logo file lives in the project (not on outside storage) so every copy of the site shows it.
// Keep this file byte-identical to the approved artwork: never regenerate, redraw or recompress it.
import logo from "@/assets/devops-manager-logo.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="DevOps Manager LLP"
      width={492}
      height={160}
      className={cn("h-10 w-auto select-none", className)}
      draggable={false}
    />
  );
}
