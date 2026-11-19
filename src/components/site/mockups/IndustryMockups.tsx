import { GraduationCap, Package, Rocket } from "lucide-react";

import type { Industry } from "@/content/home";

/** Compact, illustrative software previews that float over each industry photo. Decorative only. */
export function IndustryMockup({ id }: { id: Industry["id"] }) {
  if (id === "education") return <EducationMock />;
  if (id === "startups") return <StartupMock />;
  return <RetailMock />;
}

function MockHeader({ icon: Icon, label, tag }: { icon: typeof Rocket; label: string; tag: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
      <span className="flex items-center gap-1.5 font-display text-[0.7rem] font-bold text-foreground">
        <span className="ui-ind-chip inline-flex size-5 items-center justify-center rounded-md">
          <Icon className="size-3" />
        </span>
        {label}
      </span>
      <span className="ui-ind-chip rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold">{tag}</span>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
      <span className="ui-ind-fill block h-full rounded-full" style={{ width: `${value}%` }} />
    </span>
  );
}

function EducationMock() {
  return (
    <div className="ui-mock">
      <MockHeader icon={GraduationCap} label="Campus Desk" tag="Live" />
      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-surface p-2">
            <p className="ui-label">Students</p>
            <p className="font-display text-sm font-bold text-foreground">2,480</p>
          </div>
          <div className="rounded-lg bg-surface p-2">
            <p className="ui-label">Admissions</p>
            <p className="font-display text-sm font-bold text-foreground">
              312 <span className="ui-ind-text text-[0.55rem] font-bold">+8%</span>
            </p>
          </div>
        </div>
        <div>
          <p className="mb-1 flex justify-between text-[0.6rem] text-muted-foreground">
            <span>Fee collection</span>
            <span className="font-semibold text-foreground">78%</span>
          </p>
          <Bar value={78} />
        </div>
        <p className="hidden items-center justify-between rounded-lg border border-border px-2 py-1.5 text-[0.6rem] sm:flex">
          <span className="text-muted-foreground">Academic records</span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <span className="ui-ind-fill size-1.5 rounded-full" /> Synced
          </span>
        </p>
      </div>
    </div>
  );
}

function StartupMock() {
  const stages = [
    { label: "Leads", value: 86, n: 42 },
    { label: "Demos", value: 58, n: 18 },
    { label: "Won", value: 34, n: 9 },
  ];
  return (
    <div className="ui-mock">
      <MockHeader icon={Rocket} label="Growth HQ" tag="+18%" />
      <div className="space-y-2.5 p-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="ui-label">Performance</p>
            <p className="font-display text-sm font-bold text-foreground">On track</p>
          </div>
          <svg viewBox="0 0 80 28" className="h-7 w-20" aria-hidden="true">
            <path d="M2,24 L14,20 L26,22 L38,14 L50,16 L62,8 L78,4" fill="none" stroke="var(--ind)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <p className="ui-label">Customer pipeline</p>
          {stages.map((s) => (
            <div key={s.label} className="grid grid-cols-[2.6rem_1fr_1rem] items-center gap-2 text-[0.6rem] text-muted-foreground">
              <span>{s.label}</span>
              <Bar value={s.value} />
              <span className="text-right font-semibold text-foreground">{s.n}</span>
            </div>
          ))}
        </div>
        <p className="hidden items-center justify-between rounded-lg border border-border px-2 py-1.5 text-[0.6rem] sm:flex">
          <span className="text-muted-foreground">Onboarding workflow</span>
          <span className="font-semibold text-foreground">3 / 4 tasks</span>
        </p>
      </div>
    </div>
  );
}

function RetailMock() {
  const orders = [
    { id: "#1042", status: "Packed" },
    { id: "#1043", status: "Shipped" },
  ];
  return (
    <div className="ui-mock">
      <MockHeader icon={Package} label="Store Ops" tag="Today" />
      <div className="space-y-2.5 p-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="ui-label">Orders</p>
            <p className="font-display text-sm font-bold text-foreground">184</p>
          </div>
          <div className="text-right">
            <p className="ui-label">Sales</p>
            <p className="ui-ind-text font-display text-sm font-bold">+12%</p>
          </div>
        </div>
        <ul className="space-y-1">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between rounded-md bg-surface px-2 py-1 text-[0.6rem]">
              <span className="font-semibold text-foreground">{o.id}</span>
              <span className="ui-ind-chip rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold">{o.status}</span>
            </li>
          ))}
        </ul>
        <div className="hidden sm:block">
          <p className="mb-1 flex justify-between text-[0.6rem] text-muted-foreground">
            <span>Inventory health</span>
            <span className="font-semibold text-foreground">6 low</span>
          </p>
          <Bar value={88} />
        </div>
      </div>
    </div>
  );
}
