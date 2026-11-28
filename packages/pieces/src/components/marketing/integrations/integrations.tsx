import {
  Badge,
  Heading,
  Text,
  TextInput,
  Select,
  Stack,
} from "@puzzle-ui/ui";
import { useListFilter } from "@puzzle-ui/hooks";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type {
  IntegrationItem,
  IntegrationsSectionProps,
  IntegrationsVariant,
} from "./integrations.types";
import "./integrations.css";

const getIntegrationSearchText = (item: IntegrationItem) =>
  `${item.name} ${item.category ?? ""} ${typeof item.description === "string" ? item.description : ""}`;

const getIntegrationCategory = (item: IntegrationItem) => item.category;

const IntegrationTile = ({
  item,
  variant,
}: {
  item: IntegrationItem;
  variant: IntegrationsVariant;
}) => {
  const content = (
    <>
      {item.logo ? (
        <span className="puzzle-integrations__logo">{item.logo}</span>
      ) : null}
      <span className="puzzle-integrations__copy">
        <span className="puzzle-integrations__name">{item.name}</span>
        {item.description ? (
          <span className="puzzle-integrations__description">
            {item.description}
          </span>
        ) : null}
        {item.category ? (
          <Badge
            content={item.category}
            className="puzzle-integrations__category"
          />
        ) : null}
      </span>
    </>
  );
  const className = "puzzle-integrations__tile";

  return item.href ? (
    <a
      className={className}
      href={item.href}
      data-layout={variant}
      data-featured={item.featured || undefined}
    >
      {content}
    </a>
  ) : (
    <div
      className={className}
      data-layout={variant}
      data-featured={item.featured || undefined}
    >
      {content}
    </div>
  );
};

const groupItems = (items: readonly IntegrationItem[]) => {
  const groups = new Map<string, IntegrationItem[]>();

  items.forEach((item) => {
    const category = item.category ?? "Other integrations";
    groups.set(category, [...(groups.get(category) ?? []), item]);
  });

  return [...groups.entries()];
};

const IntegrationList = ({
  items,
  variant,
}: {
  items: readonly IntegrationItem[];
  variant: IntegrationsVariant;
}) => (
  <ul className="puzzle-integrations__list">
    {items.map((item) => (
      <li key={item.id}>
        <IntegrationTile item={item} variant={variant} />
      </li>
    ))}
  </ul>
);

const IntegrationsSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  filterable = false,
  centerLabel = "Platform",
  children,
  className,
  ...sectionProps
}: IntegrationsSectionProps<C>) => {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredItems,
  } = useListFilter({
    items,
    getSearchText: getIntegrationSearchText,
    getCategory: getIntegrationCategory,
    enabled: filterable,
  });
  const featuredItem =
    filteredItems.find((item) => item.featured) ?? filteredItems[0];
  const groups = groupItems(filteredItems);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-integrations ${className ?? ""}`.trim()}
      family="integrations"
      variant={variant}
    >
      {filterable && items.length ? (
        <Stack
          className="puzzle-integrations__filters"
          direction="row"
          gap="md"
          wrap="wrap"
        >
          <label>
            <span>Search integrations</span>
            <TextInput
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </label>
          {categories.length ? (
            <Select
              label="Category"
              value={selectedCategory}
              options={[
                { value: "", label: "All categories" },
                ...categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
              onChange={(category) => setSelectedCategory(category ?? "")}
            />
          ) : null}
        </Stack>
      ) : null}
      {filteredItems.length && variant === "categorized" ? (
        <div className="puzzle-integrations__groups">
          {groups.map(([category, categoryItems]) => (
            <section key={category}>
              <Heading level="headline3" as="h3">{category}</Heading>
              <IntegrationList items={categoryItems} variant={variant} />
            </section>
          ))}
        </div>
      ) : filteredItems.length && variant === "grouped" ? (
        <div className="puzzle-integrations__grouped">
          {groups.map(([category, categoryItems]) => (
            <section key={category}>
              <Heading level="headline3" as="h3">{category}</Heading>
              <IntegrationList items={categoryItems} variant={variant} />
            </section>
          ))}
        </div>
      ) : filteredItems.length && variant === "featured" ? (
        <div className="puzzle-integrations__featured">
          {featuredItem ? (
            <div className="puzzle-integrations__featured-item">
              <IntegrationList items={[featuredItem]} variant={variant} />
            </div>
          ) : null}
          {filteredItems.length > 1 ? (
            <IntegrationList
              items={filteredItems.filter((item) => item !== featuredItem)}
              variant={variant}
            />
          ) : null}
        </div>
      ) : filteredItems.length && variant === "split" ? (
        <div className="puzzle-integrations__split">
          {filteredItems.length > 1 ? (
            <IntegrationList
              items={filteredItems.filter((item) => item !== featuredItem)}
              variant={variant}
            />
          ) : null}
          {featuredItem ? (
            <aside>
              <Heading level="headline3" as="h3">{featuredItem.name}</Heading>
              {featuredItem.description ? <Text as="p">{featuredItem.description}</Text> : null}
              {featuredItem.category ? (
                <Badge content={featuredItem.category} />
              ) : null}
            </aside>
          ) : null}
        </div>
      ) : filteredItems.length &&
        ["ecosystem", "orbit", "network", "connected"].includes(variant) ? (
        <div
          className="puzzle-integrations__relationship"
          data-orbit-layout={
            variant === "orbit" && filteredItems.length === 4
              ? "quadrants"
              : undefined
          }
        >
          <div className="puzzle-integrations__center">{centerLabel}</div>
          <IntegrationList items={filteredItems} variant={variant} />
        </div>
      ) : filteredItems.length && variant === "carousel" ? (
        <PiecesCarousel
          itemKeys={filteredItems.map((item) => item.id)}
          slides={filteredItems.map((item) => (
            <IntegrationTile key={item.id} item={item} variant={variant} />
          ))}
          ariaLabel="Integrations"
          itemLabel="integration"
          panelsPerView={{ mobile: 2, tablet: 3, desktop: 4 }}
          gap="var(--puzzle-space-4, 1rem)"
        />
      ) : filteredItems.length ? (
        <div>
          <IntegrationList items={filteredItems} variant={variant} />
        </div>
      ) : items.length ? (
        <Text as="p" className="puzzle-integrations__empty" role="status">
          No integrations match your filters.
        </Text>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { IntegrationsSection };
