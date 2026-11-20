"use client";

import { useCallback, type ElementType } from "react";
import { useListFilter } from "@puzzle-ui/hooks";
import {
  Badge,
  Card,
  CardContent,
  TextInput,
  Heading,
  Text,
  Select,
} from "@puzzle-ui/ui";

import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../shared";
import { EmptyStatePanel } from "../../data-display/empty-state-panel";
import type {
  ResourceItem,
  ResourceSectionProps,
  ResourceSectionVariant,
} from "./resource-section.types";

import "./resource-section.css";

const ResourceCard = ({
  resource,
  featured = false,
}: {
  resource: ResourceItem;
  featured?: boolean;
}) => (
  <Card
    as="article"
    className="puzzle-resource-section__card"
    data-featured={featured || undefined}
  >
    {resource.thumbnail ? (
      <div className="puzzle-resource-section__thumbnail">
        {resource.thumbnail}
      </div>
    ) : null}
    <CardContent className="puzzle-resource-section__card-content">
      {resource.type ? (
        <Badge content={resource.type} color="info" />
      ) : null}
      <Heading level="headline3" as="h3">
        {resource.href ? (
          <a
            href={resource.href}
            download={resource.download}
            className="puzzle-resource-section__link"
          >
            {resource.title}
          </a>
        ) : (
          <span className="puzzle-resource-section__link">
            {resource.title}
          </span>
        )}
      </Heading>
      {resource.description ? <Text as="p">{resource.description}</Text> : null}
      {resource.metadata}
      {resource.updatedAt ? (
        <time dateTime={resource.updatedAt}>{resource.updatedAt}</time>
      ) : null}
    </CardContent>
  </Card>
);

const ResourceSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  featuredResourceId,
  searchable = true,
  filterable = true,
  emptyState,
  children,
  className,
  ...sectionProps
}: ResourceSectionProps<C>) => {
  validateContentIds(items, "Resource");
  const getSearchText = useCallback(
    (item: ResourceItem) =>
      `${item.title} ${typeof item.description === "string" ? item.description : ""} ${item.category ?? ""} ${item.type ?? ""}`,
    [],
  );
  const getCategory = useCallback(
    (item: ResourceItem) => item.category,
    [],
  );
  const filter = useListFilter({
    items,
    getSearchText,
    getCategory: filterable ? getCategory : undefined,
    enabled: searchable || filterable,
  });
  const featuredResource =
    filter.filteredItems.find((item) => item.id === featuredResourceId) ??
    filter.filteredItems.find((item) => item.featured) ??
    filter.filteredItems[0];
  const displayedItems =
    variant === "featured" && featuredResource
      ? filter.filteredItems.filter((item) => item.id !== featuredResource.id)
      : filter.filteredItems;
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-resource-section ${className ?? ""}`.trim()}
      family="resource"
      variant={variant satisfies ResourceSectionVariant}
    >
      {searchable || (filterable && filter.categories.length) ? (
        <div className="puzzle-resource-section__filters">
          {searchable ? (
            <label>
              Search resources
              <TextInput
                value={filter.query}
                onChange={(event) => filter.setQuery(event.currentTarget.value)}
              />
            </label>
          ) : null}
          {filterable && filter.categories.length ? (
            <Select
              label="Category"
              value={filter.selectedCategory}
              options={[
                { value: "", label: "All categories" },
                ...filter.categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
              onChange={(category) =>
                filter.setSelectedCategory(category ?? "")
              }
            />
          ) : null}
        </div>
      ) : null}
      {featuredResource && variant === "featured" ? (
        <div className="puzzle-resource-section__featured">
          <ResourceCard resource={featuredResource} featured />
        </div>
      ) : null}
      {displayedItems.length ||
      (variant === "featured" && featuredResource) ? (
        <div className="puzzle-resource-section__items">
          {displayedItems.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <EmptyStatePanel
          title="No resources found"
          description="Try a different search or category."
          variant="minimal"
          className="puzzle-resource-section__empty"
        >
          {emptyState}
        </EmptyStatePanel>
      )}
      {children}
    </MarketingSection>
  );
};

export { ResourceSection };
