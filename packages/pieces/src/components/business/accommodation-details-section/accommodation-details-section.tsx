import { Heading } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import {
  AccommodationFeatureList,
  AccommodationStatsList,
  validateAccommodationFeatures,
  validateAccommodationStats,
} from "../accommodation.shared";
import type {
  AccommodationDetailsSectionProps,
  AccommodationDetailsVariant,
} from "./accommodation-details-section.types";
import "./accommodation-details-section.css";

const AccommodationDetailsSection = <C extends ElementType = "section">({
  variant = "split",
  accommodation,
  media,
  facilities,
  children,
  className,
  title,
  description,
  ...sectionProps
}: AccommodationDetailsSectionProps<C>) => {
  validateAccommodationStats(accommodation, "Accommodation");
  validateContentIds(
    accommodation.sleepingArrangements ?? [],
    "Accommodation sleeping arrangement",
  );
  validateAccommodationFeatures(
    accommodation.highlights,
    "Accommodation highlight",
  );

  const hasContent =
    media ||
    accommodation.capacity !== undefined ||
    accommodation.bedrooms !== undefined ||
    accommodation.beds !== undefined ||
    accommodation.bathrooms !== undefined ||
    accommodation.sleepingArrangements?.length ||
    accommodation.highlights?.length ||
    facilities;
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-accommodation-details ${className ?? ""}`.trim()}
      family="accommodation-details"
      variant={variant satisfies AccommodationDetailsVariant}
      title={title ?? accommodation.name}
      description={description ?? accommodation.description}
    >
      {hasContent ? (
        <div className="puzzle-accommodation-details__layout">
          {media ? (
            <div className="puzzle-accommodation-details__media">{media}</div>
          ) : null}
          <div className="puzzle-accommodation-details__content">
            <AccommodationStatsList
              stats={accommodation}
              className="puzzle-accommodation-details__stats"
            />
            {accommodation.sleepingArrangements?.length ? (
              <div className="puzzle-accommodation-details__sleeping">
                <Heading level="headline3" as="h3">
                  Sleeping arrangements
                </Heading>
                <ul>
                  {accommodation.sleepingArrangements.map((arrangement) => (
                    <li key={arrangement.id}>
                      <strong>{arrangement.name}</strong>
                      <span>{arrangement.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {accommodation.highlights?.length ? (
              <div className="puzzle-accommodation-details__highlights">
                <Heading level="headline3" as="h3">
                  Highlights
                </Heading>
                <AccommodationFeatureList
                  items={accommodation.highlights}
                  className="puzzle-accommodation-details__features"
                />
              </div>
            ) : null}
            {facilities ? (
              <div className="puzzle-accommodation-details__facilities">
                {facilities}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { AccommodationDetailsSection };
