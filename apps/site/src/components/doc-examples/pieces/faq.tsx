import { FAQSection } from "@puzzle-ui/pieces";
import type { FAQItem, FAQVariant } from "@puzzle-ui/pieces";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const faqItems: FAQItem[] = [
  {
    id: "start",
    question: "How quickly can our team get started?",
    answer:
      "Create a workspace in a few minutes, bring in one real project, and invite the people who need the context. You can add more structure as your team grows.",
    category: "Getting started",
    searchText: "setup onboarding invite account",
    featured: true,
  },
  {
    id: "migration",
    question: "Can we bring our existing work with us?",
    answer:
      "Yes. Import your project details and connect the tools your team already uses. Keep the current process running while you move work across at your own pace.",
    category: "Getting started",
    searchText: "migration import existing tools",
  },
  {
    id: "plan",
    question: "Can we change plans as the team grows?",
    answer:
      "You can update your plan from workspace settings. Changes apply to the next billing period, and your project history stays with you.",
    category: "Plans and billing",
    searchText: "pricing billing subscription upgrade downgrade",
  },
  {
    id: "security",
    question: "How do you keep our workspace secure?",
    answer:
      "Workspace access is protected with role-based permissions, encrypted connections, and controls that help administrators manage membership.",
    category: "Plans and billing",
    searchText: "security privacy access permissions",
  },
  {
    id: "support",
    question: "What if our team needs a hand?",
    answer:
      "Our support team can help you find a starting point, answer product questions, and share practical ways to improve your workflow.",
    category: "Support",
    searchText: "help support contact assistance",
  },
  {
    id: "cancel",
    question: "Can we cancel whenever we need to?",
    answer:
      "Yes. You can cancel at any time from billing settings. You will keep access through the end of the current billing period.",
    category: "Plans and billing",
    searchText: "cancel close account billing",
  },
];

const faqVariants: SectionVariantPreview<FAQVariant>[] = [
  {
    variant: "accordion",
    useCase: "A conventional expandable list of questions.",
  },
  {
    variant: "two-column",
    useCase: "A longer FAQ set arranged into two columns on wider screens.",
  },
  {
    variant: "grid",
    useCase: "A set of questions grouped for quick scanning.",
  },
  { variant: "cards", useCase: "Questions in visually separated groups." },
  {
    variant: "split",
    useCase: "Questions beside an introduction or support action.",
  },
  {
    variant: "grouped",
    useCase: "Questions organized under category headings.",
  },
  {
    variant: "categorized",
    useCase: "Questions with in-page links to their categories.",
  },
  {
    variant: "searchable",
    useCase: "A question list filtered by a local search field.",
  },
  {
    variant: "minimal",
    useCase: "A simple disclosure list with minimal framing.",
  },
  {
    variant: "bordered",
    useCase: "A unified disclosure group with an outer border.",
  },
  {
    variant: "numbered",
    useCase: "Questions that should be referenced by order.",
  },
  {
    variant: "featured",
    useCase: "A set where selected common questions stand out.",
  },
];

export const FAQSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="FAQSection"
    variants={faqVariants}
    buildCode={(variant) => `<FAQSection variant="${variant}" items={faqs} />`}
    renderVariant={(variant) => {
      const titles: Partial<Record<FAQVariant, string>> = {
        split: "Good questions deserve clear answers",
        grouped: "Everything you need to know",
        categorized: "Find the answer you need",
        searchable: "Looking for something specific?",
        numbered: "Before you get started",
        featured: "A few things people often ask",
      };

      return (
        <FAQSection
          variant={variant}
          eyebrow="Helpful answers"
          title={titles[variant] ?? "The details, made simple"}
          description="A quick guide to setting up, growing, and getting support for your workspace."
          items={faqItems}
          expandMode={
            variant === "grid" || variant === "cards" ? "multiple" : "single"
          }
          emptyState="No answers match that search. Try another word."
        />
      );
    }}
  />
);
