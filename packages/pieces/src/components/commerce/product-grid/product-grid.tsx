"use client";

import { Badge, Card, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import {
  CommercePrice,
  formatRating,
  validateCommerceRating,
} from "../shared";
import { CommerceImageView } from "../commerce-image";
import type {
  ProductGridItem,
  ProductGridSectionProps,
  ProductGridVariant,
} from "./product-grid.types";
import "./product-grid.css";

const ProductCard = ({
  item,
  locale,
  variant,
}: {
  item: ProductGridItem;
  locale: string;
  variant: ProductGridVariant;
}) => {
  validateCommerceRating(item.id, item.rating);
  const ratingMax = item.rating?.max ?? 5;
  const ratingValue = item.rating ? formatRating(item.rating, locale) : undefined;

  return (
    <Card
      as="article"
      className="puzzle-product-grid__card"
      variant={variant === "minimal" ? "ghost" : "outlined"}
      data-featured={item.featured || undefined}
    >
      <CommerceImageView image={item.image} label={item.name} />
      {item.labels?.length ? (
        <div className="puzzle-product-grid__labels">
          {item.labels.map((label) => (
            <Badge
              key={label.id}
              content={label.content}
              className="puzzle-product-grid__label"
            />
          ))}
        </div>
      ) : null}
      <div className="puzzle-product-grid__copy">
        <Heading level="headline3" as="h3">
          {item.href ? <a href={item.href}>{item.name}</a> : item.name}
        </Heading>
        {item.description ? <Text as="p">{item.description}</Text> : null}
        {item.rating && ratingValue ? (
          <Text as="p" className="puzzle-product-grid__rating">
            <span
              aria-label={`Rated ${ratingValue} out of ${ratingMax}${
                item.rating.count === undefined
                  ? ""
                  : ` from ${item.rating.count} reviews`
              }`}
            >
              {ratingValue} / {ratingMax}
            </span>
          </Text>
        ) : null}
        <CommercePrice
          price={item.price}
          compareAtPrice={item.compareAtPrice}
          locale={locale}
        />
        {item.action ? (
          <div className="puzzle-product-grid__action">{item.action}</div>
        ) : null}
      </div>
    </Card>
  );
};

const ProductList = ({
  items,
  locale,
  variant,
}: {
  items: readonly ProductGridItem[];
  locale: string;
  variant: ProductGridVariant;
}) => (
  <ul className="puzzle-product-grid__list">
    {items.map((item) => (
      <li key={item.id} data-featured={item.featured || undefined}>
        <ProductCard item={item} locale={locale} variant={variant} />
      </li>
    ))}
  </ul>
);

const groupItems = (
  items: readonly ProductGridItem[],
  getGroup: (item: ProductGridItem) => string | undefined,
) => {
  const groups = new Map<string, ProductGridItem[]>();

  items.forEach((item) => {
    const label = getGroup(item) ?? "Other products";
    groups.set(label, [...(groups.get(label) ?? []), item]);
  });

  return [...groups.entries()];
};

const ProductCarousel = ({
  items,
  locale,
  variant,
}: {
  items: readonly ProductGridItem[];
  locale: string;
  variant: ProductGridVariant;
}) => (
  <PiecesCarousel
    itemKeys={items.map((item) => item.id)}
    slides={items.map((item) => (
      <ProductCard
        key={item.id}
        item={item}
        locale={locale}
        variant={variant}
      />
    ))}
    ariaLabel="Products"
    itemLabel="product"
    panelsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
    gap="var(--puzzle-space-5, 1.25rem)"
  />
);

const ProductGridSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  locale = "en-US",
  children,
  className,
  ...sectionProps
}: ProductGridSectionProps<C>) => {
  const featuredItem = items.find((item) => item.featured) ?? items[0];
  const groups =
    variant === "collection"
      ? groupItems(items, (item) => item.collection)
      : groupItems(items, (item) => item.category);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-product-grid ${className ?? ""}`.trim()}
      family="product-grid"
      variant={variant}
    >
      {items.length && variant === "carousel" ? (
        <ProductCarousel items={items} locale={locale} variant={variant} />
      ) : items.length && variant === "horizontal" ? (
        <div
          className="puzzle-product-grid__horizontal"
          role="region"
          aria-label="Products"
          tabIndex={0}
        >
          <ProductList items={items} locale={locale} variant={variant} />
        </div>
      ) : items.length &&
        (variant === "collection" || variant === "category") ? (
        <div className="puzzle-product-grid__groups">
          {groups.map(([group, groupItems]) => (
            <section key={group}>
              <Heading level="headline3" as="h3">{group}</Heading>
              <ProductList
                items={groupItems}
                locale={locale}
                variant={variant}
              />
            </section>
          ))}
        </div>
      ) : items.length &&
        (variant === "featured" || variant === "editorial" || variant === "mixed") ? (
        <div className={`puzzle-product-grid__${variant}`}>
          {featuredItem ? (
            <ProductList
              items={[featuredItem]}
              locale={locale}
              variant={variant}
            />
          ) : null}
          {items.length > 1 ? (
            <ProductList
              items={items.filter((item) => item !== featuredItem)}
              locale={locale}
              variant={variant}
            />
          ) : null}
        </div>
      ) : items.length ? (
        <ProductList items={items} locale={locale} variant={variant} />
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { ProductGridSection };
