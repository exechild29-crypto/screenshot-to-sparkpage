/**
 * Editable homepage content for DevOps Manager LLP.
 * Change copy here; sections read from this file.
 */
import {
  BarChart3,
  Users,
  SquareCheckBig,
  TrendingUp,
  Network,
  LineChart,
  UserCheck,
  Layers,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export const brand = {
  name: "DevOps Manager LLP",
  shortName: "DevOps Manager",
  tagline: "Modern Business Management Suite",
};

export type NavItem = { label: string; href?: `#${string}`; soon?: boolean };

/** Items without href are kept in the menu for a later phase and render as "Soon". */
export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Solutions", soon: true },
  { label: "Why Manager", href: "#why-manager" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Modern Business Management Suite",
  headline: { lead: "Manage Today.", middle: "Build a", highlight: "Better Tomorrow." },
  body: "DevOps Manager builds business software, workflow automation, CRM, ERP and AI-powered systems that bring every part of your operations into one clear, connected place.",
  primaryCta: { label: "Explore Our Solutions", href: "#about" },
  secondaryCta: { label: "Contact Us", href: "#contact" },
  pillars: [
    { icon: BarChart3, title: "Projects", sub: "Made Simple" },
    { icon: Users, title: "Teams", sub: "More Productive" },
    { icon: SquareCheckBig, title: "Work", sub: "Better Organised" },
    { icon: TrendingUp, title: "Business", sub: "Ready to Scale" },
  ] satisfies { icon: LucideIcon; title: string; sub: string }[],
};

export const about = {
  eyebrow: "About DevOps Manager",
  heading: { lead: "Technology That Makes Business Management", highlight: "Smarter." },
  paragraphs: [
    "DevOps Manager LLP designs software automation and intelligent management systems for organisations that want less friction and more control. We connect the people, processes and data behind your business so everyday work runs on clear, reliable systems.",
    "From educational institutions to fast-moving startups and retail brands, we build solutions that fit how you actually operate — and grow with you as you scale.",
  ],
  areas: [
    { title: "Business Management Software", text: "One suite for daily operations." },
    { title: "CRM & ERP", text: "Customers, resources and finance in sync." },
    { title: "Workflow Automation", text: "Repetitive steps handled for you." },
    { title: "AI-Powered Solutions", text: "Insights and forecasts built in." },
  ],
  audiences: ["Educational institutions", "Startups", "E-commerce & retail"],
  modules: ["CRM", "ERP", "Workflows", "Analytics", "AI Engine", "Finance"],
};

export type LocationStatus = "operational" | "coming-soon";
export type PresenceLocation = {
  id: "dubai" | "mangalore" | "bangalore" | "california";
  num: string;
  name: string;
  country: string;
  status: LocationStatus;
  statusLabel: string;
  accent: "blue" | "purple" | "red" | "muted";
  /** Approximate city/region coordinates for map placement — not office addresses. */
  lat: number;
  lon: number;
};

export const globalPresence = {
  eyebrow: "Our Global Presence",
  heading: { lead: "Connecting Businesses.", highlight: "Expanding Possibilities." },
  body: "With a growing international presence, DevOps Manager LLP brings technology and business automation solutions closer to organizations across different markets.",
  mapLabel: "World map showing DevOps Manager LLP locations",
  legend: { operational: "Operational", comingSoon: "Coming soon" },
  note: "Markers show approximate city and region locations.",
  comingSoonMessage: "Expanding our reach",
  locations: [
    { id: "dubai", num: "01", name: "Dubai", country: "United Arab Emirates", status: "operational", statusLabel: "Operational Location", accent: "blue", lat: 25.2048, lon: 55.2708 },
    { id: "mangalore", num: "02", name: "Mangalore", country: "India", status: "operational", statusLabel: "Operational Location", accent: "purple", lat: 12.9141, lon: 74.856 },
    { id: "bangalore", num: "03", name: "Bangalore", country: "India", status: "operational", statusLabel: "Operational Location", accent: "red", lat: 12.9716, lon: 77.5946 },
    { id: "california", num: "04", name: "California", country: "United States", status: "coming-soon", statusLabel: "Coming Soon", accent: "muted", lat: 36.7783, lon: -119.4179 },
  ] satisfies PresenceLocation[],
};

export type Feature = {
  num: string;
  title: string;
  short: string;
  text: string;
  highlights: string[];
  icon: LucideIcon;
};

export const whyManager = {
  eyebrow: "Why The Manager",
  heading: { lead: "More than management.", highlight: "A smarter way to move forward." },
  body: "Bring clarity, coordination and control to the everyday operations that drive your business.",
  features: [
    {
      num: "01",
      title: "Everything Works Together",
      short: "Unified",
      text: "Connect essential business functions through a unified management experience.",
      highlights: ["Shared data", "One workspace", "Fewer handoffs"],
      icon: Network,
    },
    {
      num: "02",
      title: "Decisions Backed by Clarity",
      short: "Clarity",
      text: "Present business information in a way that helps teams understand performance and make informed decisions.",
      highlights: ["Live dashboards", "Clear reports", "Real-time insight"],
      icon: LineChart,
    },
    {
      num: "03",
      title: "Built Around Accountability",
      short: "Accountable",
      text: "Highlight ownership, coordination, and visibility across everyday business operations.",
      highlights: ["Clear ownership", "Task visibility", "Audit trails"],
      icon: UserCheck,
    },
    {
      num: "04",
      title: "Adaptable to Your Industry",
      short: "Adaptable",
      text: "Support different business environments and operational requirements with solutions shaped around you.",
      highlights: ["Education", "Startups", "Retail & e-commerce"],
      icon: Layers,
    },
    {
      num: "05",
      title: "Ready for What's Next",
      short: "Scalable",
      text: "Scale with automation and systems that evolve as your business needs grow.",
      highlights: ["Automation", "AI-ready", "Built to scale"],
      icon: Rocket,
    },
  ] satisfies Feature[],
};
