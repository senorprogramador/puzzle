import { GuestReviewsSection } from "@puzzle-ui/pieces";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const reviews = [
  {
    id: "morgan",
    quote:
      "A quiet, welcoming stay. The hosts shared thoughtful local recommendations.",
    author: "Morgan Ellis",
    rating: 5,
    date: "2026-05-04",
    dateLabel: "4 May 2026",
    source: "Guestbook",
    featured: true,
  },
  {
    id: "jamie",
    quote: "A comfortable room, a generous breakfast, and an easy walk to town.",
    author: "Jamie Rivera",
    rating: 4.8,
    date: "2026-04-21",
    dateLabel: "21 April 2026",
    source: "Stay notes",
  },
  {
    id: "alex",
    quote: "We would happily return for another slow weekend by the coast.",
    author: "Alex Morgan",
    rating: 4.9,
    date: "2026-04-02",
    dateLabel: "2 April 2026",
    source: "Guestbook",
  },
];

const ratingSummary = {
  score: 4.8,
  totalReviews: 36,
  distribution: [
    { score: 5, count: 28 },
    { score: 4, count: 6 },
    { score: 3, count: 2 },
  ],
};

const variants = [
  { variant: "grid", useCase: "Show several guest reviews together." },
  { variant: "featured", useCase: "Emphasize a supplied featured review." },
  { variant: "carousel", useCase: "Focus on one review at a time." },
] as const satisfies readonly SectionVariantPreview<
  "grid" | "featured" | "carousel"
>[];

export const GuestReviewsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="GuestReviewsSection"
    variants={variants}
    buildCode={(variant) =>
      `<GuestReviewsSection variant="${variant}" reviews={reviews} summary={ratingSummary} />`
    }
    renderVariant={(variant) => (
      <GuestReviewsSection
        title="A few words from our guests"
        variant={variant}
        reviews={reviews}
        summary={ratingSummary}
      />
    )}
  />
);
