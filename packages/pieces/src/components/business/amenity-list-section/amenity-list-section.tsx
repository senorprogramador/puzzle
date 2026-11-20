import { Heading } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import type { Amenity, AmenityCategory } from "../accommodation.types";
import type {
  AmenityListSectionProps,
  AmenityListVariant,
} from "./amenity-list-section.types";
import "./amenity-list-section.css";

const AmenityItem = ({
  amenity,
  variant,
}: {
  amenity: Amenity;
  variant: AmenityListVariant;
}) => (
  <li className="puzzle-amenity-list__item">
    {amenity.icon ? (
      <span className="puzzle-amenity-list__icon" aria-hidden="true">
        {amenity.icon}
      </span>
    ) : null}
    <div className="puzzle-amenity-list__copy">
      <span className="puzzle-amenity-list__label">{amenity.label}</span>
      {variant === "expanded" && amenity.description ? (
        <p>{amenity.description}</p>
      ) : null}
      {amenity.content ? (
        <div className="puzzle-amenity-list__content">{amenity.content}</div>
      ) : null}
    </div>
  </li>
);

const AmenityGroup = ({
  category,
  variant,
  collapsible,
  defaultExpanded,
}: {
  category: AmenityCategory;
  variant: AmenityListVariant;
  collapsible: boolean;
  defaultExpanded: boolean;
}) => {
  const amenities = (
    <ul className="puzzle-amenity-list__items">
      {category.items.map((amenity) => (
        <AmenityItem
          key={amenity.id}
          amenity={amenity}
          variant={variant}
        />
      ))}
    </ul>
  );

  return (
    <div className="puzzle-amenity-list__category">
      {collapsible ? (
        <details open={defaultExpanded}>
          <summary>
            <Heading level="headline3" as="span">
              {category.name}
            </Heading>
          </summary>
          {amenities}
        </details>
      ) : (
        <>
          <Heading level="headline3" as="h3">
            {category.name}
          </Heading>
          {amenities}
        </>
      )}
    </div>
  );
};

const AmenityListSection = <C extends ElementType = "section">({
  variant = "expanded",
  layout = "grid",
  categories,
  collapsible = false,
  defaultExpanded = false,
  children,
  className,
  ...sectionProps
}: AmenityListSectionProps<C>) => {
  validateContentIds(categories, "Amenity category");
  categories.forEach((category) =>
    validateContentIds(category.items, `Amenity in category "${category.id}"`),
  );

  const visibleCategories = categories.filter(
    (category) => category.items.length > 0,
  );
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-amenity-list puzzle-amenity-list--${layout} ${className ?? ""}`.trim()}
      family="amenity-list"
      variant={variant satisfies AmenityListVariant}
    >
      {visibleCategories.length ? (
        <div className="puzzle-amenity-list__categories">
          {visibleCategories.map((category) => (
            <AmenityGroup
              key={category.id}
              category={category}
              variant={variant}
              collapsible={collapsible}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { AmenityListSection };
