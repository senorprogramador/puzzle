"use client";

import { Card, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
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
}) => (
  <PiecesCarousel
    itemKeys={items.map((item) => item.id)}
    slides={items.map((item) => (
      <CategoryCard key={item.id} item={item} variant={variant} />
    ))}
    ariaLabel="Product categories"
    itemLabel="category"
    panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
    gap="var(--puzzle-space-4, 1rem)"
  />
);

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
