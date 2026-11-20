"use client";

import { cn } from "@puzzle-ui/core";
import { Popover } from "@puzzle-ui/ui";
import type { ReactNode } from "react";
import { useId } from "react";
import { validateContentIds } from "../../content/shared";
import type { DietaryInformationItem } from "../restaurant-menu.types";
import type {
  DietaryInformationProps,
  DietaryInformationVariant,
} from "./dietary-information.types";
import "./dietary-information.css";

const DietaryGroup = ({
  items,
  heading,
  headingId,
  variant,
}: {
  items: readonly DietaryInformationItem[];
  heading: ReactNode;
  headingId: string;
  variant: DietaryInformationVariant;
}) =>
  items.length ? (
    <div className="puzzle-dietary-information__group">
      <p className="puzzle-dietary-information__heading" id={headingId}>
        {heading}
      </p>
      <ul
        className="puzzle-dietary-information__items"
        aria-labelledby={headingId}
      >
        {items.map((item) => (
          <li className="puzzle-dietary-information__item" key={item.id}>
            {item.icon !== undefined && item.icon !== null ? (
              <span
                className="puzzle-dietary-information__icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            ) : null}
            <span className="puzzle-dietary-information__copy">
              <span className="puzzle-dietary-information__label">
                {item.label}
              </span>
              {variant === "expanded" && item.description ? (
                <span className="puzzle-dietary-information__description">
                  {item.description}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

const DietaryInformation = ({
  tags = [],
  allergens = [],
  variant = "compact",
  dietaryHeading = "Dietary",
  allergenHeading = "Allergens",
  showDetailsPopover = false,
  detailsLabel = "Details",
  popoverTitle = "Dietary and allergen information",
  closeLabel = "Close",
  className,
}: DietaryInformationProps) => {
  validateContentIds(tags, "Dietary tag");
  validateContentIds(allergens, "Allergen");

  if (tags.length === 0 && allergens.length === 0) {
    return null;
  }

  const headingId = useId();
  const expandedGroups = (
    <>
      <DietaryGroup
        items={tags}
        heading={dietaryHeading}
        headingId={`${headingId}-details-dietary`}
        variant="expanded"
      />
      <DietaryGroup
        items={allergens}
        heading={allergenHeading}
        headingId={`${headingId}-details-allergens`}
        variant="expanded"
      />
    </>
  );

  return (
    <div
      className={cn("puzzle-dietary-information", className)}
      data-variant={variant}
    >
      <div className="puzzle-dietary-information__groups">
        <DietaryGroup
          items={tags}
          heading={dietaryHeading}
          headingId={`${headingId}-dietary`}
          variant={variant}
        />
        <DietaryGroup
          items={allergens}
          heading={allergenHeading}
          headingId={`${headingId}-allergens`}
          variant={variant}
        />
      </div>
      {showDetailsPopover ? (
        <Popover
          title={popoverTitle}
          closable
          closeLabel={closeLabel}
          trigger={
            <button
              className="puzzle-dietary-information__details-trigger"
              type="button"
            >
              {detailsLabel}
            </button>
          }
        >
          <div className="puzzle-dietary-information__popover">
            {expandedGroups}
          </div>
        </Popover>
      ) : null}
    </div>
  );
};

export { DietaryInformation };
