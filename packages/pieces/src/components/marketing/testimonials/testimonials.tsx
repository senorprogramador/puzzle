"use client";

import { Button, Carousel, CarouselController, Rating, Text } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons";
import {
  useState,
  type ElementType,
  type KeyboardEvent,
} from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
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
  const [currentPanel, setCurrentPanel] = useState(0);
  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setCurrentPanel((current) =>
      Math.min(
        Math.max(0, items.length - 1),
        current + (event.key === "ArrowRight" ? 1 : -1),
      ),
    );
  };

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-testimonials ${className ?? ""}`.trim()}
      family="testimonials"
      variant={variant}
    >
      {items.length && variant === "carousel" ? (
        <div
          className="puzzle-testimonials__keyboard"
          role="group"
          tabIndex={0}
          aria-label={`${carouselLabel}. Use the left and right arrow keys to navigate.`}
          onKeyDown={handleCarouselKeyDown}
        >
          <CarouselController
            items={[...items]}
            currentPanel={currentPanel}
            onPanelChange={setCurrentPanel}
          >
            <Carousel<TestimonialItem>
              ariaLabel={carouselLabel}
              className="puzzle-testimonials__carousel"
              panelsPerView={1}
              renderItem={(item) => <TestimonialContent item={item} />}
              getItemKey={(item) => item.id}
              backButton={
                <Button variant="primary" size="sm" aria-label="Previous testimonial">
                  <Icon name="bx:caret-left" aria-hidden="true" />
                </Button>
              }
              nextButton={
                <Button variant="primary" size="sm" aria-label="Next testimonial">
                  <Icon name="bx:caret-right" aria-hidden="true" />
                </Button>
              }
            />
          </CarouselController>
        </div>
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
