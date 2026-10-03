// Copy and figures shared across the public pages. Update prices and catalogue
// numbers here; every page reads from this file.

export const CATALOGUE = {
  programmes: "730+",
  universities: "71",
  country: "Italy",
};

export type Plan = {
  id: "trial" | "starter" | "growth" | "enterprise";
  name: string;
  monthly: number | null;
  yearly: number | null;
  blurb: string;
  profiles: string;
  seats: string;
  features: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

// Prices are in US dollars per workspace. Yearly billing charges ten months.
export const PLANS: Plan[] = [
  {
    id: "trial",
    name: "Trial",
    monthly: 0,
    yearly: 0,
    blurb: "Try Eligify with real students before you commit.",
    profiles: "10 student profiles",
    seats: "2 counsellors",
    features: [
      "14 days, no card needed",
      "Transcript reading and ECTS conversion",
      "Exact and close programme matches",
    ],
    cta: { label: "Start free", href: "/app" },
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 49,
    yearly: 490,
    blurb: "For small teams placing students every intake.",
    profiles: "30 student profiles a month",
    seats: "3 counsellors",
    features: [
      "Everything in Trial",
      "PDF shortlist reports for families",
      "Deadline reminders by email",
    ],
    cta: { label: "Choose Starter", href: "/book?plan=starter" },
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 149,
    yearly: 1490,
    blurb: "For busy consultancies running several counsellors.",
    profiles: "150 student profiles a month",
    seats: "10 counsellors",
    features: [
      "Everything in Starter",
      "Application tracking across the team",
      "Manager and counsellor roles",
      "Priority support",
    ],
    cta: { label: "Choose Growth", href: "/book?plan=growth" },
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    yearly: null,
    blurb: "For networks with branches in several cities.",
    profiles: "Unlimited student profiles",
    seats: "Unlimited counsellors",
    features: [
      "Everything in Growth",
      "Onboarding for every branch",
      "Custom programme lists",
      "Invoice and bank transfer billing",
    ],
    cta: { label: "Talk to us", href: "/book?plan=enterprise" },
  },
];

export const PAYMENT_OPTIONS = [
  {
    title: "Monthly",
    body: "Pay each month by card and cancel whenever you like.",
  },
  {
    title: "Yearly",
    body: "Pay once a year and get two months free. Useful if you plan around the September and February intakes.",
  },
  {
    title: "Instalments",
    body: "On yearly Growth and Enterprise plans you can split the payment into quarterly instalments at no extra cost.",
  },
];

export const PRICING_FAQ = [
  {
    q: "What counts as a student profile?",
    a: "A profile is one student whose documents you upload and confirm in a month. Editing an existing student or running new matches for them does not use another profile.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrades apply straight away, and downgrades start at your next billing date.",
  },
  {
    q: "Do you charge students or families?",
    a: "No. Eligify is paid for by the consultancy. Families only see the shortlist reports you choose to share with them.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Card payments for monthly and yearly plans. Enterprise customers can also pay by invoice and bank transfer.",
  },
];

export const PHOTOS = {
  rome: "Sapienza University of Rome. Photo by Diagram Lajard, CC0, via Wikimedia Commons",
  milan: "Ca' Granda, University of Milan. Photo by Luca Borghi, public domain, via Wikimedia Commons",
  pisa: "Palazzo della Sapienza, University of Pisa. Photo by Antonio D'Agnelli, public domain, via Wikimedia Commons",
  turin: "Valentino Castle, Politecnico di Torino. Photo by Golden globe, public domain, via Wikimedia Commons",
};
