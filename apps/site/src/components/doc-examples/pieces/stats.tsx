import { StatsSection } from "@puzzle-ui/pieces";
import type { StatItem, StatsVariant } from "@puzzle-ui/pieces";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const statsPreviewContent: Record<
  StatsVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
    items: StatItem[];
  }
> = {
  grid: {
    eyebrow: "Launch report · Q2",
    title: "A strong start for the new collection",
    description: "The first quarter brought new customers and repeat orders.",
    items: [
      { id: "orders", label: "Orders fulfilled", value: 12840, trend: { direction: "up", label: "Up 24% this month" } },
      { id: "conversion", label: "Store conversion", value: 4.8, suffix: "%", description: "Above the 3.6% retail benchmark." },
      { id: "returning", label: "Returning customers", value: 38, suffix: "%", description: "A healthy signal of customer loyalty." },
    ],
  },
  inline: {
    eyebrow: "At a glance",
    title: "A studio that keeps good work moving",
    description: "Short lead times and thoughtful delivery, week after week.",
    items: [
      { id: "turnaround", label: "Average turnaround", value: 2.4, suffix: " days" },
      { id: "on-time", label: "Delivered on time", value: 96, suffix: "%" },
      { id: "review", label: "Client rating", value: 4.9, suffix: "/5" },
    ],
  },
  cards: {
    eyebrow: "The weekly harvest",
    title: "Local food, finding its people",
    description: "A quick look at this season's neighborhood subscription.",
    items: [
      { id: "revenue", label: "Monthly subscriptions", value: 842, prefix: "$", description: "Recurring orders this month." },
      { id: "baskets", label: "Baskets delivered", value: 320, trend: { direction: "up", label: "64 more than last week" } },
      { id: "retention", label: "Renewal rate", value: 87, suffix: "%", progress: 87 },
    ],
  },
  split: {
    eyebrow: "Community impact",
    title: "More places, connected by nature",
    description: "A regional conservation network growing through local action.",
    items: [
      { id: "habitats", label: "Habitats protected", value: 67, description: "Across three watersheds." },
      { id: "volunteers", label: "Volunteer hours", value: 12400, prefix: "+", description: "Contributed since the spring launch." },
    ],
  },
  centered: {
    eyebrow: "Field Notes Festival",
    title: "A weekend full of good ideas",
    description: "Independent voices, practical workshops, and a sold-out room.",
    items: [
      { id: "attendees", label: "Attendees", value: 2400, suffix: "+" },
      { id: "sessions", label: "Sessions", value: 36 },
      { id: "countries", label: "Countries represented", value: 18 },
    ],
  },
  featured: {
    eyebrow: "A growing community",
    title: "Built by people who make things",
    description: "A welcoming network for curious, ambitious teams.",
    items: [
      { id: "members", label: "Community members", value: 18400, prefix: "+", featured: true, trend: { direction: "up", label: "18% this quarter" } },
      { id: "projects", label: "Projects shared", value: 248 },
      { id: "countries", label: "Countries", value: 42 },
    ],
  },
  horizontal: {
    eyebrow: "Marketplace pulse",
    title: "Small makers are reaching further",
    description: "Independent shops are finding new customers across the region.",
    items: [
      { id: "makers", label: "Active makers", value: 186 },
      { id: "products", label: "Products listed", value: 3200, prefix: "+" },
      { id: "shipments", label: "Monthly shipments", value: 9700 },
      { id: "regions", label: "Regions served", value: 24 },
    ],
  },
  vertical: {
    eyebrow: "Restoration update",
    title: "A landscape on the mend",
    description: "The work is measured in healthy rivers and thriving habitats.",
    items: [
      { id: "water", label: "Water quality improvement", value: 31, suffix: "%", trend: { direction: "up", label: "Since restoration began" } },
      { id: "species", label: "Native species returned", value: 12 },
      { id: "sites", label: "Sites monitored", value: 8 },
    ],
  },
  dashboard: {
    eyebrow: "Operations · Live",
    title: "Today's delivery health",
    description: "The fulfillment team is on track across every major milestone.",
    items: [
      { id: "packed", label: "Orders packed", value: 186, progress: 82 },
      { id: "dispatch", label: "Ready to dispatch", value: 42, trend: { direction: "neutral", label: "Next pickup at 3:30 PM" } },
      { id: "accuracy", label: "Picking accuracy", value: 99.4, suffix: "%", progress: 99.4 },
    ],
  },
  comparison: {
    eyebrow: "A better booking flow",
    title: "Less waiting between idea and itinerary",
    description: "Average planning time before and after the new guided flow.",
    items: [
      { id: "before", label: "Before · days to plan", value: 21, suffix: " days" },
      { id: "after", label: "Now · days to plan", value: 9, suffix: " days", trend: { direction: "down", label: "12 days faster" } },
    ],
  },
  progress: {
    eyebrow: "Renovation tracker",
    title: "A landmark taking shape",
    description: "Three workstreams are moving steadily toward opening day.",
    items: [
      { id: "structure", label: "Structure restored", value: 76, suffix: "%", progress: 76 },
      { id: "interiors", label: "Interior fit-out", value: 54, suffix: "%", progress: 54 },
      { id: "accessibility", label: "Access improvements", value: 91, suffix: "%", progress: 91 },
    ],
  },
  animated: {
    eyebrow: "Annual impact",
    title: "Small actions add up",
    description: "A year of neighbors sharing skills, time, and useful things.",
    items: [
      { id: "neighbors", label: "Neighbors involved", value: 12600, prefix: "+" },
      { id: "repairs", label: "Items repaired", value: 3800 },
      { id: "hours", label: "Hours volunteered", value: 9400 },
    ],
  },
};

const statVariants: SectionVariantPreview<StatsVariant>[] = [
  { variant: "grid", useCase: "A general-purpose collection of key metrics." },
  {
    variant: "inline",
    useCase: "Compact metrics displayed in one flowing row.",
  },
  { variant: "cards", useCase: "Metrics separated into individual cards." },
  {
    variant: "split",
    useCase: "A small set of metrics with balanced emphasis.",
  },
  {
    variant: "centered",
    useCase: "Metrics centered below a short introduction.",
  },
  {
    variant: "featured",
    useCase: "A primary metric supported by secondary values.",
  },
  {
    variant: "horizontal",
    useCase: "A flexible horizontal row of statistics.",
  },
  {
    variant: "vertical",
    useCase: "Metrics stacked for narrow panels or sidebars.",
  },
  {
    variant: "dashboard",
    useCase: "Compact operational values for a dashboard summary.",
  },
  {
    variant: "comparison",
    useCase: "Metrics arranged for before-and-after comparisons.",
  },
  { variant: "progress", useCase: "Values that include progress indicators." },
  {
    variant: "animated",
    useCase: "Numeric values counted up when motion is allowed.",
  },
];

export const StatsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="StatsSection"
    variants={statVariants}
    buildCode={(variant) =>
      `<StatsSection variant="${variant}" items={stats} />`
    }
    renderVariant={(variant) => (
      <StatsSection variant={variant} {...statsPreviewContent[variant]} />
    )}
  />
);
