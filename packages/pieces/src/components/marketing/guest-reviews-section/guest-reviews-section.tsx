import { Heading, Rating } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../shared";
import { TestimonialsSection } from "../testimonials";
import type { GuestReviewsSectionProps, GuestReviewsLabels } from "./guest-reviews-section.types";
import "./guest-reviews-section.css";

const defaultLabels: GuestReviewsLabels = {
  overallRating: "Guest rating",
  score: (score, maxScore) => `${score} out of ${maxScore}`,
  reviewCount: (count) => `${count} ${count === 1 ? "review" : "reviews"}`,
  scoreDistribution: "Score distribution",
  distributionEntry: (score, maxScore, count) =>
    `${score} out of ${maxScore} stars: ${count} reviews`,
};

const GuestReviewsSection = <C extends ElementType = "section">({
  variant = "grid",
  reviews,
  summary,
  labels,
  carouselLabel = "Guest reviews",
  className,
  children,
  ...sectionProps
}: GuestReviewsSectionProps<C>) => {
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;
  const messages = { ...defaultLabels, ...labels };
  const maxScore = summary?.maxScore ?? 5;
  const distribution = summary?.distribution ?? [];
  const maxCount = Math.max(1, ...distribution.map((entry) => entry.count));
  const testimonialItems = reviews.map((review) => {
    const metadata =
      review.date || review.source ? (
        <span className="puzzle-guest-reviews__metadata">
          {review.date ? (
            <time dateTime={review.date}>{review.dateLabel ?? review.date}</time>
          ) : null}
          {review.date && review.source ? (
            <span aria-hidden="true">·</span>
          ) : null}
          {review.source ? <span>{review.source}</span> : null}
        </span>
      ) : undefined;

    return { ...review, metadata };
  });

  return (
    <TestimonialsSection<C>
      {...nativeProps}
      className={`puzzle-guest-reviews ${className ?? ""}`.trim()}
      variant={variant}
      carouselLabel={carouselLabel}
      items={testimonialItems}
    >
      {summary ? (
        <div className="puzzle-guest-reviews__summary">
          <Heading level="headline3" as="h3">
            {messages.overallRating}
          </Heading>
          <div className="puzzle-guest-reviews__score">
            <Rating
              value={summary.score}
              max={maxScore}
              readOnly
              aria-label={messages.score(summary.score, maxScore)}
            />
            <span>{messages.score(summary.score, maxScore)}</span>
            {summary.totalReviews !== undefined ? (
              <span>{messages.reviewCount(summary.totalReviews)}</span>
            ) : null}
          </div>
          {distribution.length ? (
            <div className="puzzle-guest-reviews__distribution">
              <Heading level="headline4" as="h4">
                {messages.scoreDistribution}
              </Heading>
              <ul>
                {distribution.map((entry) => (
                  <li key={entry.score}>
                    <span>{entry.score}</span>
                    <meter
                      min={0}
                      max={maxCount}
                      value={entry.count}
                      aria-label={messages.distributionEntry(
                        entry.score,
                        maxScore,
                        entry.count,
                      )}
                    />
                    <span>{entry.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </TestimonialsSection>
  );
};

export { GuestReviewsSection };
