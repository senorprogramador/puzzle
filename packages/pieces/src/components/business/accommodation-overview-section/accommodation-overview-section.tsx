"use client";

import {
  Badge,
  Card,
  Heading,
  Text,
} from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import { CommercePrice } from "../../commerce/shared";
import { validateContentIds } from "../../content/shared";
import { BusinessFigure } from "../shared";
import {
  AccommodationFeatureList,
  AccommodationStatsList,
  validateAccommodationFeatures,
  validateAccommodationStats,
} from "../accommodation.shared";
import type { AccommodationOverviewItem } from "../accommodation.types";
import type {
  AccommodationOverviewSectionProps,
  AccommodationOverviewVariant,
} from "./accommodation-overview-section.types";
import "./accommodation-overview-section.css";

const AccommodationCard = ({
  item,
  locale,
}: {
  item: AccommodationOverviewItem;
  locale: string;
}) => (
  <Card
    as="article"
    className="puzzle-accommodation-overview__card"
    variant="outlined"
    data-featured={item.featured || undefined}
  >
    {item.image ? (
      <BusinessFigure
        image={item.image}
        className="puzzle-accommodation-overview__image"
      />
    ) : null}
    {item.badges?.length || item.featured ? (
      <div className="puzzle-accommodation-overview__badges">
        {item.featured ? <Badge content="Featured" color="primary" /> : null}
        {item.badges?.map((badge) => (
          <Badge key={badge.id} content={badge.content} />
        ))}
      </div>
    ) : null}
    <div className="puzzle-accommodation-overview__copy">
      <Heading level="headline3" as="h3">
        {item.href ? <a href={item.href}>{item.name}</a> : item.name}
      </Heading>
      {item.description ? <Text as="p">{item.description}</Text> : null}
      <AccommodationStatsList
        stats={item}
        className="puzzle-accommodation-overview__stats"
      />
      {item.highlights?.length ? (
        <AccommodationFeatureList
          items={item.highlights}
          className="puzzle-accommodation-overview__highlights"
        />
      ) : null}
      {item.price ? (
        <div className="puzzle-accommodation-overview__price">
          <CommercePrice price={item.price} locale={locale} />
          {item.priceNote ? <Text as="span">{item.priceNote}</Text> : null}
        </div>
      ) : item.priceNote ? (
        <Text as="p">{item.priceNote}</Text>
      ) : null}
      {item.action ? (
        <div className="puzzle-accommodation-overview__action">{item.action}</div>
      ) : item.href ? (
        <a
          className="puzzle-accommodation-overview__details-link"
          href={item.href}
        >
          View details
        </a>
      ) : null}
    </div>
  </Card>
);

const AccommodationOverviewSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  locale = "en-US",
  children,
  className,
  ...sectionProps
}: AccommodationOverviewSectionProps<C>) => {
  validateContentIds(items, "Accommodation");
  items.forEach((item) => {
    validateAccommodationStats(item, `Accommodation "${item.id}"`);
    validateContentIds(item.badges ?? [], `Accommodation "${item.id}" badge`);
    validateAccommodationFeatures(
      item.highlights,
      `Accommodation "${item.id}" highlight`,
    );
  });

  const renderCard = (item: AccommodationOverviewItem) => (
    <AccommodationCard item={item} locale={locale} />
  );
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-accommodation-overview ${className ?? ""}`.trim()}
      family="accommodation-overview"
      variant={variant satisfies AccommodationOverviewVariant}
    >
      {items.length && variant === "carousel" ? (
        <PiecesCarousel
          itemKeys={items.map((item) => item.id)}
          slides={items.map((item) => (
            <div key={item.id}>{renderCard(item)}</div>
          ))}
          ariaLabel="Accommodations"
          itemLabel="accommodation"
          className="puzzle-accommodation-overview__carousel"
          panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="var(--puzzle-space-4, 1rem)"
        />
      ) : items.length ? (
        <ul className="puzzle-accommodation-overview__items">
          {items.map((item) => (
            <li key={item.id}>{renderCard(item)}</li>
          ))}
        </ul>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { AccommodationOverviewSection };
