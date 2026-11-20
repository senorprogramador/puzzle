import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import { ResourceSection } from "../resource-section";
import type { ResourceItem } from "../resource-section";
import type { LocalGuideSectionProps } from "./local-guide-section.types";
import "./local-guide-section.css";

const LocalGuideSection = <C extends ElementType = "section">({
  places,
  featuredPlaceId,
  mapSlot,
  mapLabel = "Local guide map",
  distanceLabel = "Distance",
  travelTimeLabel = "Travel time",
  variant = "grid",
  filterable,
  emptyState,
  children,
  className,
  ...sectionProps
}: LocalGuideSectionProps<C>) => {
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;
  const resources: ResourceItem[] = places.map(
    ({ kind, distance, travelTime, ...place }) => ({
      ...place,
      type: kind,
      metadata:
        distance !== undefined || travelTime !== undefined ? (
          <dl className="puzzle-local-guide-section__metadata">
            {distance !== undefined ? (
              <div>
                <dt>{distanceLabel}</dt>
                <dd>{distance}</dd>
              </div>
            ) : null}
            {travelTime !== undefined ? (
              <div>
                <dt>{travelTimeLabel}</dt>
                <dd>{travelTime}</dd>
              </div>
            ) : null}
          </dl>
        ) : undefined,
    }),
  );

  return (
    <ResourceSection<C>
      {...nativeProps}
      className={`puzzle-local-guide-section ${className ?? ""}`.trim()}
      variant={variant}
      items={resources}
      featuredResourceId={featuredPlaceId}
      searchable={false}
      filterable={filterable}
      emptyState={emptyState}
    >
      {mapSlot ? (
        <div
          className="puzzle-local-guide-section__map"
          role="group"
          aria-label={mapLabel}
        >
          {mapSlot}
        </div>
      ) : null}
      {children}
    </ResourceSection>
  );
};

export { LocalGuideSection };
