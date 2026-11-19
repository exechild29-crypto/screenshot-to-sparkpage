import {
  ArrowUp,
  BarChart3,
  Bot,
  Boxes,
  Check,
  CircleDollarSign,
  Flag,
  FolderKanban,
  LayoutDashboard,
  Play,
  Sparkles,
  Users,
} from "lucide-react";

import type { Capability } from "@/content/home";
import { cn } from "@/lib/utils";

/** Custom, illustrative software interfaces for the What We Do bento panels. Decorative only. */
export function SolutionMockup({ id }: { id: Capability["id"] }) {
  if (id === "business-software") return <BusinessSoftwareMock />;
  if (id === "workflow-automation") return <WorkflowMock />;
  if (id === "crm-erp") return <CrmErpMock />;
  return <AiMock />;
}

const Dot = ({ className }: { className?: string }) => <span className={cn("size-1.5 shrink-0 rounded-full", className)} />;

function BusinessSoftwareMock() {
  const nav = [
    { Icon: LayoutDashboard, label: "Dashboard", on: true },
    { Icon: FolderKanban, label: "Projects" },
    { Icon: CircleDollarSign, label: "Finance" },
    { Icon: Users, label: "Team" },
    { Icon: BarChart3, label: "Reports" },
  ];
  const kpis = [
    { label: "Projects", value: "24", delta: "+3" },
    { label: "Tasks done", value: "182", delta: "+12%" },
    { label: "On-time", value: "96%", delta: "+2%" },
  ];
  const activity = [
    { text: "Invoice #2041 approved", time: "2m", c: "bg-brand-blue" },
    { text: "New project: Store rollout", time: "18m", c: "bg-brand-purple" },
    { text: "Payroll synced with finance", time: "1h", c: "bg-brand-red" },
  ];
  return (
    <div className="ui-mock ui-mock--lg flex overflow-hidden">
      <aside className="hidden w-36 shrink-0 flex-col gap-1 border-r border-border bg-surface p-3 sm:flex">
        <span className="mb-2 flex items-center gap-1.5 font-display text-[0.7rem] font-bold text-foreground">
          <span className="size-4 rounded-md bg-gradient-brand" /> Manager
        </span>
        {nav.map(({ Icon, label, on }) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.65rem]",
              on ? "bg-background font-semibold text-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("size-3", on && "text-primary")} /> {label}
          </span>
        ))}
      </aside>
      <div className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="ui-label">Overview</p>
            <p className="font-display text-sm font-bold text-foreground">This month</p>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] text-muted-foreground">Export</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-border p-2">
              <p className="ui-label truncate">{k.label}</p>
              <p className="font-display text-sm font-bold text-foreground sm:text-base">
                {k.value} <span className="text-[0.55rem] font-bold text-primary">{k.delta}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg border border-border p-2.5">
            <p className="ui-label mb-1">Operations throughput</p>
            <svg viewBox="0 0 200 64" className="h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="bs-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="bs-line" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--brand-blue)" />
                  <stop offset="100%" stopColor="var(--brand-purple)" />
                </linearGradient>
              </defs>
              <path d="M0,50 C20,46 30,38 50,40 C70,42 80,26 100,28 C120,30 130,18 150,20 C170,22 180,10 200,8 L200,64 L0,64 Z" fill="url(#bs-area)" />
              <path d="M0,50 C20,46 30,38 50,40 C70,42 80,26 100,28 C120,30 130,18 150,20 C170,22 180,10 200,8" fill="none" stroke="url(#bs-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="hidden rounded-lg border border-border p-2.5 md:block">
            <p className="ui-label mb-1.5">Recent activity</p>
            <ul className="space-y-1.5">
              {activity.map((a) => (
                <li key={a.text} className="flex items-center gap-1.5 text-[0.6rem] text-foreground">
                  <Dot className={a.c} />
                  <span className="min-w-0 flex-1 truncate">{a.text}</span>
                  <span className="text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowMock() {
  const steps = [
    { label: "Request submitted", meta: "Trigger", Icon: Play, state: "start" },
    { label: "Manager approval", meta: "Auto-assigned", Icon: Check, state: "done" },
    { label: "Generate invoice", meta: "Running", Icon: Check, state: "run" },
    { label: "Completed", meta: "Notify team", Icon: Flag, state: "end" },
  ] as const;
  return (
    <div className="ui-mock grid gap-3 p-3 sm:grid-cols-[1fr_8.5rem] sm:p-4">
      <div className="relative">
        <svg className="absolute left-[0.8rem] top-4 h-[calc(100%-2rem)] w-1 overflow-visible" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="1" y1="0" x2="1" y2="100" stroke="var(--border)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line x1="1" y1="0" x2="1" y2="100" pathLength={1} stroke="var(--brand-purple)" strokeWidth="2" vectorEffect="non-scaling-stroke" className="draw-line" style={{ "--d": "900ms" } as React.CSSProperties} />
        </svg>
        <ol className="relative space-y-2.5">
          {steps.map(({ label, meta, Icon, state }) => (
            <li key={label} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex size-6.5 shrink-0 items-center justify-center rounded-full border-2 border-background shadow-soft",
                  state === "run" ? "bg-accent text-brand-purple" : state === "end" ? "bg-secondary text-muted-foreground" : "bg-gradient-brand text-primary-foreground",
                )}
              >
                <Icon className="size-3" />
              </span>
              <span className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 py-1.5">
                <span className="block truncate text-[0.65rem] font-semibold text-foreground">{label}</span>
                <span className="flex items-center gap-1 text-[0.55rem] text-muted-foreground">
                  {state === "run" && <Dot className="pulse-dot bg-brand-purple" />}
                  {meta}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="hidden space-y-2 rounded-lg bg-surface p-2.5 sm:block">
        <p className="ui-label">Automation</p>
        {[
          ["Auto-assign", true],
          ["Email updates", true],
          ["Weekend runs", false],
        ].map(([label, on]) => (
          <p key={String(label)} className="flex items-center justify-between text-[0.6rem] text-foreground">
            {label}
            <span className={cn("relative h-3 w-5.5 rounded-full", on ? "bg-brand-purple" : "bg-border")}>
              <span className={cn("absolute top-0.5 size-2 rounded-full bg-background", on ? "right-0.5" : "left-0.5")} />
            </span>
          </p>
        ))}
        <p className="border-t border-border pt-2 text-[0.55rem] text-muted-foreground">
          Saved <span className="font-semibold text-foreground">14 h</span> this week
        </p>
      </div>
    </div>
  );
}

function CrmErpMock() {
  const modules = [
    { label: "CRM", c: "bg-brand-blue" },
    { label: "Inventory", c: "bg-brand-purple" },
    { label: "Finance", c: "bg-brand-red" },
    { label: "HR", c: "bg-brand-magenta" },
  ];
  return (
    <div className="ui-mock space-y-3 p-3 sm:p-4">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent font-display text-[0.65rem] font-bold text-brand-purple">NR</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.7rem] font-bold text-foreground">Northwind Retail</p>
          <p className="text-[0.55rem] text-muted-foreground">Customer since 2022 · Key account</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.55rem] font-bold text-brand-purple">
          <Dot className="bg-brand-purple" /> Active
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Open deals", "12"],
          ["Orders", "348"],
          ["Invoices due", "3"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-surface p-2">
            <p className="ui-label truncate">{l}</p>
            <p className="font-display text-sm font-bold text-foreground">{v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border p-2">
        <p className="ui-label mb-1.5 flex items-center gap-1">
          <Boxes className="size-3" /> Connected modules
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {modules.map((m, i) => (
            <span key={m.label} className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[0.6rem] font-semibold text-foreground">
                <Dot className={m.c} /> {m.label}
              </span>
              {i < modules.length - 1 && <span className="h-px w-2 bg-border" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiMock() {
  const steps = [
    { label: "Reading CRM & ERP records", done: true },
    { label: "Matching orders to stock", done: true },
    { label: "Forecasting demand", done: false },
  ];
  return (
    <div className="ui-mock ui-mock--lg grid overflow-hidden md:grid-cols-[1.35fr_1fr]">
      <div className="flex min-w-0 flex-col gap-2.5 p-3 sm:p-4">
        <p className="flex items-center gap-1.5 font-display text-[0.7rem] font-bold text-foreground">
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-gradient-brand text-primary-foreground">
            <Bot className="size-3" />
          </span>
          Operations Assistant
        </p>
        <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-secondary px-2.5 py-1.5 text-[0.65rem] text-foreground">
          Summarise this week's operations and flag risks.
        </p>
        <div className="max-w-[94%] rounded-xl rounded-bl-sm border border-border bg-background px-2.5 py-2 text-[0.65rem] text-foreground">
          <p className="flex items-center gap-1 font-semibold">
            <Sparkles className="size-3 text-brand-purple" /> Weekly summary
          </p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            <li>• Orders up 12%, fulfilment on schedule</li>
            <li>• 2 approvals waiting over 48 hours</li>
            <li className="hidden sm:list-item">• Stock for 6 items runs low by Friday</li>
          </ul>
          <p className="mt-1.5 flex flex-wrap gap-1">
            {["CRM", "ERP", "Workflows"].map((s) => (
              <span key={s} className="rounded bg-accent px-1.5 py-px text-[0.55rem] font-semibold text-brand-purple">
                {s}
              </span>
            ))}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-3 pr-1 text-[0.6rem] text-muted-foreground">
          <span className="flex-1 truncate">Ask about your operations…</span>
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground">
            <ArrowUp className="size-3" />
          </span>
        </div>
      </div>
      <div className="hidden space-y-2.5 border-l border-border bg-surface p-3 sm:p-4 md:block">
        <p className="ui-label">Processing</p>
        <ul className="space-y-1.5">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-1.5 text-[0.6rem] text-foreground">
              <span
                className={cn(
                  "inline-flex size-3.5 items-center justify-center rounded-full",
                  s.done ? "bg-gradient-brand text-primary-foreground" : "border border-brand-purple",
                )}
              >
                {s.done ? <Check className="size-2" /> : <Dot className="pulse-dot size-1 bg-brand-purple" />}
              </span>
              {s.label}
            </li>
          ))}
        </ul>
        <span className="block h-1 overflow-hidden rounded-full bg-border">
          <span className="block h-full w-[72%] rounded-full bg-gradient-brand" />
        </span>
        <p className="ui-label pt-1">Capabilities</p>
        <p className="flex flex-wrap gap-1">
          {["Summarise", "Forecast", "Classify", "Recommend"].map((c) => (
            <span key={c} className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[0.55rem] font-semibold text-foreground">
              {c}
            </span>
          ))}
        </p>
        <p className="ui-label pt-1">Context</p>
        <p className="text-[0.6rem] leading-snug text-muted-foreground">Last 7 days · 3 connected systems · 1,240 records</p>
      </div>
    </div>
  );
}
