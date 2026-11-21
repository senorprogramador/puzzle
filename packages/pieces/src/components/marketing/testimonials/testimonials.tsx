"use client";

import { Rating, Text } from "@puzzle-ui/ui";
import { type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type {
  TestimonialItem,
  TestimonialsSectionProps,
} from "./testimonials.types";
import "./testimonials.css";

const TestimonialContent = ({ item }: { item: TestimonialItem }) => (
  <article
    className="puzzle-testimonials__item"
    data-featured={item.featured || undefined}
  >
    {item.media ? <div className="puzzle-testimonials__media">{item.media}</div> : null}
    {item.rating !== undefined ? (
      <Rating
        value={item.rating}
        readOnly
        aria-label={`${item.rating} out of 5 stars`}
      />
    ) : null}
    <blockquote>
      <Text as="p">{item.quote}</Text>
      <footer>
        {item.avatar ? (
          <span className="puzzle-testimonials__avatar" aria-hidden="true">
            {item.avatar}
          </span>
        ) : null}
        <span>
          <strong>{item.author}</strong>
          {item.role || item.organization ? (
            <span className="puzzle-testimonials__attribution">
              {[item.role, item.organization].filter(Boolean).join(", ")}
            </span>
          ) : null}
        </span>
        {item.companyLogo ? (
          <span className="puzzle-testimonials__company">{item.companyLogo}</span>
        ) : null}
        {item.metadata ? (
          <span className="puzzle-testimonials__metadata">{item.metadata}</span>
        ) : null}
      </footer>
    </blockquote>
  </article>
);

const TestimonialsSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  carouselLabel = "Customer testimonials",
  children,
  className,
  ...sectionProps
}: TestimonialsSectionProps<C>) => {
  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-testimonials ${className ?? ""}`.trim()}
      family="testimonials"
      variant={variant}
    >
      {items.length && variant === "carousel" ? (
        <PiecesCarousel
          itemKeys={items.map((item) => item.id)}
          slides={items.map((item) => (
            <TestimonialContent key={item.id} item={item} />
          ))}
          ariaLabel={carouselLabel}
          itemLabel="testimonial"
          className="puzzle-testimonials__carousel"
          panelsPerView={{ mobile: 1, tablet: 1, desktop: 2 }}
          gap="var(--puzzle-space-6, 1.5rem)"
        />
      ) : items.length ? (
        <ul className="puzzle-testimonials__list">
          {items.map((item) => (
            <li key={item.id}>
              <TestimonialContent item={item} />
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { TestimonialsSection };
