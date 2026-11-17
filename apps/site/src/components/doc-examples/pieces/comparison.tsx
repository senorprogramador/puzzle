import { ComparisonSection } from "@puzzle-ui/pieces";
import type { ComparisonFeature, ComparisonOption, ComparisonVariant } from "@puzzle-ui/pieces";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const comparisonPreviewContent: Record<
  ComparisonVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
    options: ComparisonOption[];
    features: ComparisonFeature[];
    highlightedOptionId?: string;
    defaultSelectedOptionId?: string;
  }
> = {
  table: {
    eyebrow: "Workspace plans",
    title: "Room to grow, without outgrowing your tools",
    description: "Compare the essentials for a small team, a studio, or a full organization.",
    options: [
      { id: "starter", title: "Starter", description: "For a small team finding its rhythm." },
      { id: "studio", title: "Studio", description: "For teams ready to scale good work.", featured: true },
      { id: "scale", title: "Scale", description: "For ambitious, multi-team organizations." },
    ],
    features: [
      { id: "price", label: "Price per person / month", values: { starter: "$0", studio: "$12", scale: "$24" } },
      { id: "seats", label: "Team members", values: { starter: 3, studio: 20, scale: "Unlimited" } },
      { id: "projects", label: "Active projects", values: { starter: 3, studio: "Unlimited", scale: "Unlimited" } },
      { id: "automation", label: "Workflow automation", values: { starter: false, studio: "5 rules", scale: "Unlimited" } },
    ],
  },
  cards: {
    eyebrow: "Creative services",
    title: "The right kind of help for your next chapter",
    description: "Choose a level of partnership that fits the way your team works.",
    options: [
      { id: "sprint", title: "Brand sprint", description: "A focused week to clarify the story." },
      { id: "studio", title: "Studio partner", description: "Ongoing design support for launches." },
      { id: "embedded", title: "Embedded team", description: "A dedicated crew for complex work." },
    ],
    features: [
      { id: "duration", label: "Starting timeline", values: { sprint: "5 days", studio: "Monthly", embedded: "Quarterly" } },
      { id: "workshops", label: "Strategy workshops", values: { sprint: 2, studio: 1, embedded: 4 } },
      { id: "deliverables", label: "Core deliverables", values: { sprint: "Brand direction", studio: "Design system", embedded: "Product + brand" } },
    ],
  },
  split: {
    eyebrow: "Team workshop formats",
    title: "Bring everyone into the same room",
    description: "Pick the format that makes it easiest for your group to do its best thinking.",
    options: [
      { id: "onsite", title: "On-site", description: "A hands-on day together." },
      { id: "remote", title: "Remote", description: "A focused session from anywhere." },
    ],
    features: [
      { id: "duration", label: "Session length", values: { onsite: "Full day", remote: "Two half-days" } },
      { id: "attendees", label: "Recommended group", values: { onsite: "8–16 people", remote: "4–10 people" } },
      { id: "materials", label: "Take-home materials", values: { onsite: "Printed workbook", remote: "Shared digital board" } },
    ],
  },
  versus: {
    eyebrow: "A calmer way to collaborate",
    title: "Scattered updates or one shared picture?",
    description: "See what changes when project context lives alongside the work.",
    options: [
      { id: "scattered", title: "Scattered tools", description: "Updates live across inboxes and chats." },
      { id: "workspace", title: "Shared workspace", description: "Decisions stay connected to projects." },
    ],
    features: [
      { id: "status", label: "Current project status", values: { scattered: "Ask around", workspace: "One clear view" } },
      { id: "decisions", label: "Decision history", values: { scattered: false, workspace: true } },
      { id: "handoffs", label: "Cross-team handoffs", values: { scattered: "Manual follow-up", workspace: "Shared milestones" } },
    ],
  },
  checklist: {
    eyebrow: "Coworking access",
    title: "A desk for the day or a place to belong",
    description: "Compare the practical details before choosing your membership.",
    options: [
      { id: "day", title: "Day pass", description: "Drop in when you need a change of scene." },
      { id: "member", title: "Monthly member", description: "Make the studio part of your routine." },
    ],
    features: [
      { id: "desk", label: "Dedicated desk", values: { day: false, member: true } },
      { id: "meeting", label: "Meeting-room credits", values: { day: "1 hour", member: "8 hours" } },
      { id: "events", label: "Community events", values: { day: false, member: true } },
      { id: "coffee", label: "Coffee and tea", values: { day: true, member: true } },
    ],
  },
  "feature-matrix": {
    eyebrow: "App availability",
    title: "The same workspace, wherever you work",
    description: "Check which tools and capabilities are available on each platform.",
    options: [
      { id: "browser", title: "Browser" },
      { id: "ios", title: "iOS app" },
      { id: "android", title: "Android app" },
    ],
    features: [
      { id: "offline", label: "Offline access", values: { browser: false, ios: true, android: true } },
      { id: "notifications", label: "Push notifications", values: { browser: "Desktop", ios: true, android: true } },
      { id: "calendar", label: "Calendar sync", values: { browser: true, ios: true, android: true } },
      { id: "attachments", label: "File attachments", values: { browser: true, ios: "Preview", android: "Preview" } },
    ],
  },
  pricing: {
    eyebrow: "Workshop pricing",
    title: "Make space for your team's next idea",
    description: "Transparent options for a single session, a series, or a full retreat.",
    options: [
      { id: "session", title: "One session", description: "A 90-minute guided workshop." },
      { id: "series", title: "Workshop series", description: "Three sessions over a month.", featured: true },
      { id: "retreat", title: "Team retreat", description: "A full day with a dedicated facilitator." },
    ],
    features: [
      { id: "price", label: "Starting price", values: { session: "$480", series: "$1,250", retreat: "$2,400" } },
      { id: "participants", label: "Participants", values: { session: "Up to 8", series: "Up to 12", retreat: "Up to 20" } },
      { id: "followup", label: "Follow-up notes", values: { session: true, series: true, retreat: "Action plan" } },
    ],
    highlightedOptionId: "series",
  },
  highlighted: {
    eyebrow: "Choose your trail",
    title: "Find the escape that fits your pace",
    description: "Each guided route has a different rhythm, view, and level of challenge.",
    options: [
      { id: "coast", title: "Coastline", description: "Easy paths and sea air." },
      { id: "countryside", title: "Countryside", description: "A balanced day of hills and villages.", featured: true },
      { id: "highlands", title: "Highlands", description: "Big views for experienced hikers." },
    ],
    features: [
      { id: "distance", label: "Distance", values: { coast: "6 km", countryside: "12 km", highlands: "19 km" } },
      { id: "elevation", label: "Elevation gain", values: { coast: "120 m", countryside: "460 m", highlands: "980 m" } },
      { id: "duration", label: "Time on trail", values: { coast: "2 hours", countryside: "4 hours", highlands: "7 hours" } },
    ],
    highlightedOptionId: "countryside",
  },
  horizontal: {
    eyebrow: "City cycling guide",
    title: "Three bikes, three ways to explore",
    description: "Compare the range and carrying capacity before your next ride.",
    options: [
      { id: "city", title: "City", description: "Nimble for everyday errands." },
      { id: "touring", title: "Touring", description: "Comfortable for longer routes." },
      { id: "cargo", title: "Cargo", description: "Room for people and parcels." },
    ],
    features: [
      { id: "range", label: "Typical range", values: { city: "45 km", touring: "80 km", cargo: "55 km" } },
      { id: "capacity", label: "Carry capacity", values: { city: "10 kg", touring: "20 kg", cargo: "80 kg" } },
      { id: "weight", label: "Bike weight", values: { city: "18 kg", touring: "22 kg", cargo: "31 kg" } },
    ],
  },
  vertical: {
    eyebrow: "Festival sessions",
    title: "Choose a day that feels like yours",
    description: "A small comparison of the three ways to spend the weekend.",
    options: [
      { id: "friday", title: "Friday", description: "An intimate opening night." },
      { id: "saturday", title: "Saturday", description: "The full program and evening show." },
      { id: "weekend", title: "Weekend", description: "Every talk, workshop, and gathering." },
    ],
    features: [
      { id: "talks", label: "Talks included", values: { friday: 3, saturday: 8, weekend: 12 } },
      { id: "workshops", label: "Workshop access", values: { friday: false, saturday: "Choose one", weekend: "All sessions" } },
      { id: "price", label: "Pass price", values: { friday: "$35", saturday: "$89", weekend: "$129" } },
    ],
  },
  compact: {
    eyebrow: "Delivery options",
    title: "Get your order on your terms",
    description: "A quick comparison of the ways we can get it to your door.",
    options: [
      { id: "pickup", title: "Store pickup" },
      { id: "standard", title: "Standard delivery" },
      { id: "express", title: "Express delivery" },
    ],
    features: [
      { id: "fee", label: "Fee", values: { pickup: "Free", standard: "$4", express: "$9" } },
      { id: "arrival", label: "Ready in", values: { pickup: "2 hours", standard: "2–3 days", express: "Tomorrow" } },
    ],
  },
  interactive: {
    eyebrow: "Pick your workspace",
    title: "Start simple, then make it yours",
    description: "Select a plan to compare how much room each one gives your team.",
    options: [
      { id: "solo", title: "Solo", description: "A clear home for personal projects." },
      { id: "maker", title: "Maker", description: "More space for a growing studio.", featured: true },
      { id: "collective", title: "Collective", description: "Shared tools for a larger team." },
    ],
    features: [
      { id: "members", label: "Members", values: { solo: 1, maker: 8, collective: 30 } },
      { id: "spaces", label: "Project spaces", values: { solo: 3, maker: 20, collective: "Unlimited" } },
      { id: "review", label: "Guest reviews", values: { solo: false, maker: true, collective: true } },
    ],
    highlightedOptionId: "maker",
    defaultSelectedOptionId: "maker",
  },
};

const comparisonVariants: SectionVariantPreview<ComparisonVariant>[] = [
  {
    variant: "table",
    useCase: "Compare structured features across a few options.",
  },
  { variant: "cards", useCase: "Compare options as self-contained cards." },
  {
    variant: "split",
    useCase: "Emphasize two choices in a side-by-side layout.",
  },
  { variant: "versus", useCase: "Present a direct two-option comparison." },
  { variant: "checklist", useCase: "Scan included and excluded features." },
  {
    variant: "feature-matrix",
    useCase: "Compare many features in a semantic table.",
  },
  {
    variant: "pricing",
    useCase: "Compare plan features and consumer-provided actions.",
  },
  {
    variant: "highlighted",
    useCase: "Draw attention to a recommended option.",
  },
  {
    variant: "horizontal",
    useCase: "Lay options out in a responsive row of cards.",
  },
  {
    variant: "vertical",
    useCase: "Stack choices for narrow or mobile layouts.",
  },
  {
    variant: "compact",
    useCase: "Use a denser presentation for short comparisons.",
  },
  {
    variant: "interactive",
    useCase: "Let visitors select an option and compare its values.",
  },
];

export const ComparisonSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ComparisonSection"
    variants={comparisonVariants}
    buildCode={(variant) =>
      variant === "interactive"
        ? `<ComparisonSection variant="interactive" options={options} features={features} defaultSelectedOptionId="maker" />`
        : `<ComparisonSection variant="${variant}" options={options} features={features} />`
    }
    renderVariant={(variant) => {
      const preview = comparisonPreviewContent[variant];
      const content = {
        eyebrow: preview.eyebrow,
        title: preview.title,
        description: preview.description,
        options: preview.options,
        features: preview.features,
        highlightedOptionId: preview.highlightedOptionId,
      };

      return variant === "interactive" ? (
        <ComparisonSection
          {...content}
          variant={variant}
          defaultSelectedOptionId={preview.defaultSelectedOptionId}
        />
      ) : (
        <ComparisonSection {...content} variant={variant} />
      );
    }}
  />
);
