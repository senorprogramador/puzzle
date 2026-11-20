import type { ElementType, ReactNode } from "react";
import type { TestimonialItem, TestimonialsSectionProps } from "../testimonials";

export type GuestReview = Omit<TestimonialItem, "metadata"> & {
  date?: string;
  dateLabel?: ReactNode;
  source?: ReactNode;
};

export type GuestRatingDistributionEntry = {
  score: number;
  count: number;
};

export type GuestRatingSummary = {
  score: number;
  maxScore?: number;
  totalReviews?: number;
  distribution?: readonly GuestRatingDistributionEntry[];
};

export type GuestReviewsLabels = {
  overallRating: ReactNode;
  score: (score: number, maxScore: number) => string;
  reviewCount: (count: number) => ReactNode;
  scoreDistribution: ReactNode;
  distributionEntry: (
    score: number,
    maxScore: number,
    count: number,
  ) => string;
};

export type GuestReviewsSectionProps<C extends ElementType = "section"> =
  Omit<TestimonialsSectionProps<C>, "items"> & {
    reviews: readonly GuestReview[];
    summary?: GuestRatingSummary;
    labels?: Partial<GuestReviewsLabels>;
  };
