"use client";

import { cn } from "@puzzle-ui/core";
import { Heading, Text } from "@puzzle-ui/ui";
import { useId, useState } from "react";
import { validateContentIds } from "../../content/shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { DishCard } from "../dish-card";
import type { RestaurantMenuSectionProps } from "./restaurant-menu-section.types";
import "./restaurant-menu-section.css";

const RestaurantMenuSection = ({
  menus,
  locale,
  cardVariant = "standard",
  dietaryInformationVariant = "compact",
  showDietaryDetailsPopover = false,
  featuredLabel,
  popularLabel,
  dietaryFilters = [],
  selectedDietaryTagId,
  onDietaryFilterChange,
  categoryNavigationLabel = "Menu categories",
  filterLabel = "Filter by dietary preference",
  allDishesLabel = "All dishes",
  emptyState = "No menu dishes are available.",
  filterEmptyState = "No dishes match this filter.",
  children,
  className,
  ...sectionProps
}: RestaurantMenuSectionProps) => {
  const instanceId = useId().replace(/:/g, "");
  const [internalFilterId, setInternalFilterId] = useState<string | null>(null);
  const filterId =
    selectedDietaryTagId === undefined
      ? internalFilterId
      : selectedDietaryTagId;

  validateContentIds(menus, "Restaurant menu");
  validateContentIds(dietaryFilters, "Dietary filter");
  menus.forEach((menu) => {
    validateContentIds(
      menu.categories,
      `Categories in restaurant menu "${menu.id}"`,
    );
    menu.categories.forEach((category) =>
      validateContentIds(
        category.dishes,
        `Dishes in category "${category.id}"`,
      ),
    );
  });

  if (
    selectedDietaryTagId != null &&
    !dietaryFilters.some((filter) => filter.id === selectedDietaryTagId)
  ) {
    throw new RangeError(
      "The selected dietary tag must be present in dietaryFilters.",
    );
  }

  const activeFilterId =
    filterId && dietaryFilters.some((filter) => filter.id === filterId)
      ? filterId
      : null;
  const filterSelectId = `${instanceId}-dietary-filter`;
  const visibleMenus = menus.flatMap((menu, menuIndex) => {
    const categories = menu.categories.flatMap((category, categoryIndex) => {
      const dishes = category.dishes.filter(
        (dish) =>
          activeFilterId === null ||
          dish.dietaryTags?.some((tag) => tag.id === activeFilterId),
      );

      return dishes.length
        ? [
            {
              category,
              dishes,
              anchorId: `${instanceId}-menu-${menuIndex}-category-${categoryIndex}`,
            },
          ]
        : [];
    });

    return categories.length
      ? [
          {
            menu,
            categories,
            headingId: `${instanceId}-menu-${menuIndex}`,
          },
        ]
      : [];
  });
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;

  const handleFilterChange = (nextFilterId: string | null) => {
    if (selectedDietaryTagId === undefined) {
      setInternalFilterId(nextFilterId);
    }

    onDietaryFilterChange?.(nextFilterId);
  };

  return (
    <MarketingSection
      {...nativeProps}
      className={cn("puzzle-restaurant-menu", className)}
      family="restaurant-menu"
      variant="catalog"
    >
      {dietaryFilters.length ? (
        <div className="puzzle-restaurant-menu__filter">
          <label htmlFor={filterSelectId}>{filterLabel}</label>
          <select
            id={filterSelectId}
            value={activeFilterId ?? ""}
            onChange={(event) =>
              handleFilterChange(event.currentTarget.value || null)
            }
          >
            <option value="">{allDishesLabel}</option>
            {dietaryFilters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {visibleMenus.length ? (
        <>
          <nav
            className="puzzle-restaurant-menu__navigation"
            aria-label={categoryNavigationLabel}
          >
            <ul>
              {visibleMenus.map(({ menu, categories }) => (
                <li key={menu.id}>
                  <span className="puzzle-restaurant-menu__navigation-menu">
                    {menu.title}
                  </span>
                  <ul>
                    {categories.map(({ category, anchorId }) => (
                      <li key={category.id}>
                        <a href={`#${anchorId}`}>{category.title}</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          <div className="puzzle-restaurant-menu__menus">
            {visibleMenus.map(({ menu, categories, headingId }) => (
              <section
                className="puzzle-restaurant-menu__menu"
                key={menu.id}
                aria-labelledby={headingId}
              >
                <Heading
                  className="puzzle-restaurant-menu__menu-title"
                  id={headingId}
                  level="headline3"
                  as="h3"
                >
                  {menu.title}
                </Heading>
                {menu.description ? (
                  <Text as="p" className="puzzle-restaurant-menu__description">
                    {menu.description}
                  </Text>
                ) : null}

                <div className="puzzle-restaurant-menu__categories">
                  {categories.map(({ category, dishes, anchorId }) => (
                    <section
                      className="puzzle-restaurant-menu__category"
                      id={anchorId}
                      key={category.id}
                      aria-labelledby={`${anchorId}-heading`}
                    >
                      <Heading
                        className="puzzle-restaurant-menu__category-title"
                        id={`${anchorId}-heading`}
                        level="headline4"
                        as="h4"
                      >
                        {category.title}
                      </Heading>
                      {category.description ? (
                        <Text
                          as="p"
                          className="puzzle-restaurant-menu__description"
                        >
                          {category.description}
                        </Text>
                      ) : null}
                      <ul className="puzzle-restaurant-menu__dishes">
                        {dishes.map((dish) => (
                          <li key={dish.id}>
                            <DishCard
                              dish={dish}
                              variant={dish.featured ? "featured" : cardVariant}
                              headingAs="h5"
                              locale={locale}
                              featuredLabel={featuredLabel}
                              popularLabel={popularLabel}
                              dietaryInformationVariant={
                                dietaryInformationVariant
                              }
                              showDietaryDetailsPopover={
                                showDietaryDetailsPopover
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <p className="puzzle-restaurant-menu__empty" role="status">
          {activeFilterId ? filterEmptyState : emptyState}
        </p>
      )}
      {children}
    </MarketingSection>
  );
};

export { RestaurantMenuSection };
