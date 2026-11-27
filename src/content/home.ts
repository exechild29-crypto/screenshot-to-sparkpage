/**
 * Editable homepage content for DevOps Manager LLP.
 * Change copy here; sections read from this file.
 */
import {
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
  { label: "Founders", href: "#founders" },
  { label: "Whom We Serve", href: "#industries" },
  { label: "What We Do", href: "#what-we-do" },
  { label: "Locations", href: "#global-presence" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Modern Business Management Suite",
  headline: { lead: "Manage Today.", middle: "Build a", highlight: "Better Tomorrow." },
  body: "DevOps Manager builds business software, workflow automation, CRM, ERP and AI-powered systems that bring every part of your operations into one clear, connected place.",
  primaryCta: { label: "Explore Our Solutions", href: "#about" },
  secondaryCta: { label: "Contact Us", href: "#contact" },
};

export const about = {
  eyebrow: "About DevOps Manager",
  heading: { lead: "Technology That Makes Business Management", highlight: "Smarter." },
  paragraphs: [
    "DevOps Manager LLP designs software automation and intelligent management systems for organisations that want less friction and more control. We connect the people, processes and data behind your business so everyday work runs on clear, reliable systems.",
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
    { id: "bangalore", num: "01", name: "Bangalore", country: "India", status: "operational", statusLabel: "Operational Location", accent: "red", lat: 12.9716, lon: 77.5946 },
    { id: "mangalore", num: "02", name: "Mangalore", country: "India", status: "operational", statusLabel: "Operational Location", accent: "purple", lat: 12.9141, lon: 74.856 },
    { id: "dubai", num: "03", name: "Dubai", country: "United Arab Emirates", status: "operational", statusLabel: "Operational Location", accent: "blue", lat: 25.2048, lon: 55.2708 },
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

/** A future detail page. Until `live` is true the card points somewhere safe (see `exploreHref`). */
export type PlannedLink = { route: `/${string}`; live: boolean };

export type Industry = {
  id: "education" | "startups" | "ecommerce-retail";
  num: string;
  title: string;
  headline: string;
  text: string;
  focus: string[];
  accent: "blue" | "purple" | "red";
  imageAlt: string;
  link: PlannedLink;
};

export const whomWeServe = {
  eyebrow: "Whom We Serve",
  heading: { lead: "Technology designed around", highlight: "the way your industry works." },
  body: "Every industry has different challenges. We develop software and automation solutions that help businesses simplify operations, improve coordination, and move forward with confidence.",
  exploreLabel: "Explore Solutions",
  industries: [
    {
      id: "education",
      num: "01",
      title: "Education",
      headline: "Smarter Management for Better Learning Environments.",
      text: "Empower educational institutions with connected digital systems that simplify administration, improve coordination, and support better institutional management.",
      focus: ["Student and admission management", "Administrative workflows", "Fee and record management", "Institutional communication"],
      accent: "blue",
      imageAlt: "Two students working together on laptops in a bright, modern campus library",
      link: { route: "/industries/education", live: false },
    },
    {
      id: "startups",
      num: "02",
      title: "Start-ups",
      headline: "Build Faster. Manage Smarter. Scale Better.",
      text: "Help growing businesses establish efficient processes, manage customers, automate operations, and build a stronger foundation for sustainable growth.",
      focus: ["CRM and customer management", "Workflow automation", "Business process coordination", "Operational visibility"],
      accent: "purple",
      imageAlt: "A start-up team planning together at a whiteboard covered with notes in a sunny loft office",
      link: { route: "/industries/startups", live: false },
    },
    {
      id: "ecommerce-retail",
      num: "03",
      title: "E-commerce & Retail",
      headline: "Connect Every Part of Your Commerce Business.",
      text: "Simplify commerce operations through connected systems that help manage products, orders, inventory, customers, and everyday sales activities.",
      focus: ["Order management", "Inventory workflows", "Customer management", "Sales operations"],
      accent: "red",
      imageAlt: "A shop owner packing a customer order at a clean counter, with stocked shelves and an order tablet behind her",
      link: { route: "/industries/ecommerce-retail", live: false },
    },
  ] satisfies Industry[],
  closing: {
    title: "Different industries. One smarter approach.",
    text: "We bring software, automation, and intelligent systems together to address the unique challenges of every business.",
  },
};

export type Capability = {
  id: "business-software" | "workflow-automation" | "crm-erp" | "ai-systems";
  num: string;
  title: string;
  headline: string;
  text: string;
  size: "large" | "small";
  link: PlannedLink;
};

export const whatWeDo = {
  eyebrow: "What We Do",
  heading: { lead: "Technology that works", highlight: "for your business." },
  body: "From custom software to intelligent automation, we build systems that make everyday business operations simpler, smarter, and more connected.",
  exploreLabel: "Explore Solutions",
  capabilities: [
    {
      id: "business-software",
      num: "01",
      title: "Business Software",
      headline: "Software Built Around Your Business.",
      text: "Purpose-built software designed to support your organization's unique requirements, processes, and operational goals.",
      size: "large",
      link: { route: "/solutions/business-software", live: false },
    },
    {
      id: "workflow-automation",
      num: "02",
      title: "Workflow Automation",
      headline: "Make Workflows Work Smarter.",
      text: "Connect business processes, reduce repetitive tasks, and simplify the way work gets done.",
      size: "small",
      link: { route: "/solutions/workflow-automation", live: false },
    },
    {
      id: "crm-erp",
      num: "03",
      title: "CRM & ERP Systems",
      headline: "Bring Your Business Together.",
      text: "Create connected management systems that help organizations coordinate customers, resources, and operations.",
      size: "small",
      link: { route: "/solutions/crm-erp", live: false },
    },
    {
      id: "ai-systems",
      num: "04",
      title: "AI-Powered Systems",
      headline: "Make Intelligence Part of Your Operations.",
      text: "Integrate intelligent capabilities into business systems to support smarter workflows and business processes.",
      size: "large",
      link: { route: "/solutions/ai-systems", live: false },
    },
  ] satisfies Capability[],
  closing: {
    lead: "One business. Multiple possibilities.",
    highlight: "Smarter technology.",
    text: "We bring software, automation, and intelligent systems together to help businesses operate with greater clarity and efficiency.",
  },
};

export type Founder = {
  name: string;
  role: string;
  /** Image URL (e.g. an imported asset's url). */
  photo?: string;
  bio?: string;
  links?: { label: string; href: string }[];
};

export const founders = {
  eyebrow: "Founders",
  heading: { lead: "Meet Our", highlight: "Founders" },
  body: "The people behind DevOps Manager LLP. Founder profiles will be shared here soon.",
  /** Add founder profiles here; placeholder cards show while this is empty. */
  profiles: [] as Founder[],
  placeholderCount: 2,
  placeholder: { title: "Founder profile", text: "Coming soon" },
};
