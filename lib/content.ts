// All page copy in one place. Bracketed values are placeholders until real ones exist.

export const NAV_LINKS = [
  { label: "Card", href: "#anatomy" },
  { label: "Ledger", href: "#ledger" },
  { label: "Global", href: "#global" },
  { label: "Pricing", href: "#cta" },
];

export const PARTNER_LINE = "Banking services by [PARTNER BANK], Member FDIC";

export const HERO = {
  eyebrow: "The titanium card + live ledger",
  words: ["Money", "that", "moves", "at", "the", "speed", "of", "intent."],
  body: "One titanium card, one live ledger, every currency. Meridian settles, sorts and reconciles your money the moment it moves.",
  chips: [
    { icon: "up", title: "Payroll · Northwind", amount: "+$4,820.00", lime: true },
    { icon: "swap", title: "Converted · settled", amount: "€1,180.00 → $1,281.40", lime: false },
    { icon: "check", title: "Rent · split 3 ways", amount: "−$1,050.00 each", lime: false },
  ],
} as const;

export const LAYERS = [
  { n: "01", t: "Face", d: "Laser-etched and numberless. Your details live in the app, not on the card." },
  {
    n: "02",
    t: "Secure element",
    d: "Keys are generated on the chip and never leave it. Freeze or reissue in one tap.",
  },
  { n: "03", t: "Live ledger", d: "Every swipe posts in real time, sorted and matched to its receipt." },
  { n: "04", t: "Titanium shell", d: "A solid titanium core with a bead-blasted finish." },
];

export const OPENING_BALANCE = 43442.14;

export const INCOMING = [
  { a: "BB", n: "Blue Bottle", amt: "−6.50", meta: "Just now · Food", delta: -6.5, lime: false },
  { a: "NW", n: "Northwind payroll", amt: "+4,820.00", meta: "Just now · Income", delta: 4820, lime: true },
  { a: "FG", n: "Figma", amt: "−45.00", meta: "Just now · Software", delta: -45, lime: false },
];

export const EARLIER = [
  { a: "AW", n: "AWS", amt: "−312.08", meta: "07:15 · Infra" },
  { a: "LH", n: "Lufthansa", amt: "−842.10", meta: "Yesterday · Travel" },
  { a: "UB", n: "Uber", amt: "−18.40", meta: "Yesterday · Travel" },
];

export const FEATURES = [
  {
    n: "01",
    t: "Auto-split.",
    d: "Rent, dinners, trips. Split a payment as it happens and everyone settles automatically.",
    k: "Rent · 3 ways",
    v: "$1,050.00 each",
    w: 100,
  },
  {
    n: "02",
    t: "A card for every purpose.",
    d: "Create a virtual card per subscription, trip or teammate. Set a limit and an end date.",
    k: "Travel · Lisbon",
    v: "$1,240 of $2,000",
    w: 62,
  },
  {
    n: "03",
    t: "Receipts, matched.",
    d: "Forward an email or snap a photo. Meridian finds the transaction it belongs to.",
    k: "Matched this month",
    v: "41 of 43",
    w: 95,
  },
  {
    n: "04",
    t: "Control, instantly.",
    d: "Freeze, unfreeze and set per-merchant limits from your phone. Changes apply before the next tap.",
    k: "Card status",
    v: "Frozen",
    w: 0,
  },
];

export const NUMBERS = { saved: 9312, currencies: 6 };

export const CHART_POINTS: [number, number][] = [
  [0, 330],
  [116, 310],
  [232, 318],
  [348, 270],
  [465, 280],
  [581, 228],
  [697, 240],
  [814, 188],
  [930, 168],
  [1046, 178],
  [1163, 118],
  [1280, 88],
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Mock rates for the ticker. Not live market data.
export const FX = [
  { pair: "EUR → USD", rate: 1.0859 },
  { pair: "GBP → USD", rate: 1.2702 },
  { pair: "USD → INR", rate: 83.214 },
  { pair: "SGD → EUR", rate: 0.6871 },
];

export const CITIES = [
  { code: "NYC", x: 760, y: 380, lx: 700, ly: 386 },
  { code: "LDN", x: 900, y: 320, lx: 914, ly: 324 },
  { code: "BLR", x: 1110, y: 450, lx: 1124, ly: 440 },
  { code: "SGP", x: 1170, y: 520, lx: 1184, ly: 512 },
  { code: "SÃO", x: 830, y: 600, lx: 846, ly: 604 },
];

export const ARCS = [
  { d: "M760 380 Q820 230 900 320", w: 1.75, glow: true },
  { d: "M900 320 Q1010 220 1110 450", w: 1.75, glow: true },
  { d: "M1110 450 Q1160 420 1170 520", w: 1.5, glow: false },
  { d: "M830 600 Q800 430 900 320", w: 1.75, glow: false },
];

// Fictional company names, not customers.
export const MARQUEE = [
  { name: "Northwind", style: "solid" },
  { name: "Halcyon", style: "outline" },
  { name: "Parallel", style: "solid" },
  { name: "✳", style: "accent" },
  { name: "Fieldnote", style: "outline" },
  { name: "Orbital", style: "solid" },
] as const;

export const QUOTES = [
  { text: "We closed the books in a day instead of a week.", lime: false },
  {
    text: "Every card has its own limit and its own end date. Finance stopped chasing receipts entirely.",
    lime: false,
  },
  {
    text: "Paying a team in five countries now takes one tap, and nobody loses money to the exchange rate.",
    lime: true,
  },
  { text: "It is the first finance tool our engineers actually open on purpose.", lime: false },
];

export const QUOTE_CAPTION = "[NAME] · [ROLE], [COMPANY]";

export const CTA = {
  eyebrow: "[ 08 ] Get started",
  line1: "Your money,",
  line2: ["finally", "moving."],
  body: "Apply in a few minutes. Your virtual card works the moment you are approved; the titanium one ships within [X] days.",
};

export const FOOTER_COLUMNS = [
  { title: "Product", links: ["Card", "Ledger", "Global", "Pricing"] },
  { title: "Company", links: ["About", "Careers", "Security", "Press"] },
  { title: "Legal", links: ["Terms", "Privacy", "Licenses"] },
];
