"use client";

import { Card, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import { useState } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { CommerceImageView } from "../commerce-image";
import type {
  CategoriesSectionProps,
  CategoriesVariant,
  CategoryItem,
} from "./categories.types";
import "./categories.css";

const CategoryCard = ({
  item,
  variant,
}: {
  item: CategoryItem;
  variant: CategoriesVariant;
}) => (
  <Card
    as="article"
    className="puzzle-categories__card"
    variant={variant === "compact" || variant === "list" ? "ghost" : "outlined"}
    data-featured={item.featured || undefined}
  >
    <CommerceImageView image={item.image} label={item.title} />
    <div className="puzzle-categories__copy">
      <Heading level="headline3" as="h3">
        {item.href ? <a href={item.href}>{item.title}</a> : item.title}
      </Heading>
      {item.description ? <Text as="p">{item.description}</Text> : null}
    </div>
  </Card>
);

const CategoryList = ({
  items,
  variant,
}: {
  items: readonly CategoryItem[];
  variant: CategoriesVariant;
}) => (
  <ul className="puzzle-categories__list">
    {items.map((item) => (
      <li key={item.id}>
        <CategoryCard item={item} variant={variant} />
      </li>
    ))}
  </ul>
);

const CategoryCarousel = ({
  items,
  variant,
}: {
  items: readonly CategoryItem[];
  variant: CategoriesVariant;
}) => {
  const [requestedIndex, setRequestedIndex] = useState(0);
  const activeIndex = Math.min(requestedIndex, items.length - 1);
  const item = items[activeIndex];

  if (!item) {
    return null;
  }

  return (
    <div
      className="puzzle-categories__carousel"
      role="region"
      aria-label="Product categories"
      aria-roledescription="carousel"
    >
      <div aria-live="polite" aria-atomic="true">
        <CategoryCard item={item} variant={variant} />
        <Text as="p" className="puzzle-categories__position">
          {activeIndex + 1} of {items.length}
        </Text>
      </div>
      <div className="puzzle-categories__controls">
        <button
          type="button"
          aria-label="Previous category"
          disabled={activeIndex === 0}
          onClick={() => setRequestedIndex(activeIndex - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          aria-label="Next category"
          disabled={activeIndex === items.length - 1}
          onClick={() => setRequestedIndex(activeIndex + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const CategoriesSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  children,
  className,
  ...sectionProps
}: CategoriesSectionProps<C>) => {
  const featuredItem = items.find((item) => item.featured) ?? items[0];

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-categories ${className ?? ""}`.trim()}
      family="categories"
      variant={variant}
    >
      {items.length && variant === "carousel" ? (
        <CategoryCarousel items={items} variant={variant} />
      ) : items.length && variant === "horizontal" ? (
        <div
          className="puzzle-categories__horizontal"
          role="region"
          aria-label="Product categories"
          tabIndex={0}
        >
          <CategoryList items={items} variant={variant} />
        </div>
      ) : items.length &&
        (variant === "featured" || variant === "split" || variant === "editorial") ? (
        <div className={`puzzle-categories__${variant}`}>
          {featuredItem ? (
            <CategoryList items={[featuredItem]} variant={variant} />
          ) : null}
          {items.length > 1 ? (
            <CategoryList
              items={items.filter((item) => item !== featuredItem)}
              variant={variant}
            />
          ) : null}
        </div>
      ) : items.length ? (
        <CategoryList items={items} variant={variant} />
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { CategoriesSection };
