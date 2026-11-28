import {
  Badge,
  Tabs,
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
  UseCaseItem,
  UseCasesSectionProps,
  UseCasesVariant,
} from "./use-cases.types";
import "./use-cases.css";

const getUseCaseSearchText = (item: UseCaseItem) =>
  `${item.title} ${item.category ?? ""} ${item.persona ?? ""} ${item.industry ?? ""} ${typeof item.description === "string" ? item.description : ""}`;

const getUseCaseCategory = (item: UseCaseItem) => item.category;

const UseCaseContent = ({
  item,
  variant,
}: {
  item: UseCaseItem;
  variant: UseCasesVariant;
}) => (
  <>
    {item.media ? (
      <div className="puzzle-use-cases__media">{item.media}</div>
    ) : null}
    <div className="puzzle-use-cases__copy">
      {variant === "persona" && item.persona ? (
        <Badge content={item.persona} className="puzzle-use-cases__audience" />
      ) : null}
      {variant === "industry" && item.industry ? (
        <Badge content={item.industry} className="puzzle-use-cases__audience" />
      ) : null}
      <Heading level="headline3" as="h3">{item.title}</Heading>
      {item.description ? <Text as="p">{item.description}</Text> : null}
      {item.benefits?.length ? (
        <ul className="puzzle-use-cases__benefits">
          {item.benefits.map((benefit, index) => (
            <li key={`${item.id}-benefit-${index}`}>{benefit}</li>
          ))}
        </ul>
      ) : null}
      {item.action ? (
        <div className="puzzle-use-cases__action">{item.action}</div>
      ) : null}
    </div>
  </>
);

const UseCaseCard = ({
  item,
  variant,
}: {
  item: UseCaseItem;
  variant: UseCasesVariant;
}) => (
  <article
    className="puzzle-use-cases__item"
    data-featured={item.featured || undefined}
  >
    <UseCaseContent item={item} variant={variant} />
  </article>
);

const groupItems = (items: readonly UseCaseItem[]) => {
  const groups = new Map<string, UseCaseItem[]>();

  items.forEach((item) => {
    const category = item.category ?? "Other use cases";
    groups.set(category, [...(groups.get(category) ?? []), item]);
  });

  return [...groups.entries()];
};

const UseCasesSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  filterable = false,
  children,
  className,
  ...sectionProps
}: UseCasesSectionProps<C>) => {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredItems,
  } = useListFilter({
    items,
    getSearchText: getUseCaseSearchText,
    getCategory: getUseCaseCategory,
    enabled: filterable,
  });
  const featuredItem =
    filteredItems.find((item) => item.featured) ?? filteredItems[0];
  const groups = groupItems(filteredItems);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-use-cases ${className ?? ""}`.trim()}
      family="use-cases"
      variant={variant}
    >
      {filterable && items.length ? (
        <Stack
          className="puzzle-use-cases__filters"
          direction="row"
          gap="md"
          wrap="wrap"
        >
          <label>
            <span>Search use cases</span>
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
      {filteredItems.length && variant === "tabs" ? (
        <Tabs className="puzzle-use-cases__tabs">
          {filteredItems.map((item) => (
            <Tabs.Tab key={item.id} id={item.id} tab={item.title}>
              <UseCaseCard item={item} variant={variant} />
            </Tabs.Tab>
          ))}
        </Tabs>
      ) : filteredItems.length && variant === "categorized" ? (
        <div className="puzzle-use-cases__groups">
          {groups.map(([category, categoryItems]) => (
            <section key={category}>
              <Heading level="headline3" as="h3">{category}</Heading>
              <ul className="puzzle-use-cases__list">
                {categoryItems.map((item) => (
                  <li key={item.id}>
                    <UseCaseCard item={item} variant={variant} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : filteredItems.length && variant === "featured" ? (
        <div className="puzzle-use-cases__featured">
          {featuredItem ? (
            <UseCaseCard item={featuredItem} variant={variant} />
          ) : null}
          {filteredItems.length > 1 ? (
            <ul className="puzzle-use-cases__list">
              {filteredItems
                .filter((item) => item !== featuredItem)
                .map((item) => (
                  <li key={item.id}>
                    <UseCaseCard item={item} variant={variant} />
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      ) : filteredItems.length && variant === "split" ? (
        <div className="puzzle-use-cases__split">
          {featuredItem ? (
            <UseCaseCard item={featuredItem} variant={variant} />
          ) : null}
          {filteredItems.length > 1 ? (
            <ul className="puzzle-use-cases__list">
              {filteredItems
                .filter((item) => item !== featuredItem)
                .map((item) => (
                  <li key={item.id}>
                    <UseCaseCard item={item} variant={variant} />
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      ) : filteredItems.length && variant === "carousel" ? (
        <PiecesCarousel
          itemKeys={filteredItems.map((item) => item.id)}
          slides={filteredItems.map((item) => (
            <UseCaseCard key={item.id} item={item} variant={variant} />
          ))}
          ariaLabel="Use cases"
          itemLabel="use case"
          panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="var(--puzzle-space-6, 1.5rem)"
        />
      ) : filteredItems.length ? (
        <ul className="puzzle-use-cases__list">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <UseCaseCard item={item} variant={variant} />
            </li>
          ))}
        </ul>
      ) : items.length ? (
        <Text as="p" className="puzzle-use-cases__empty" role="status">
          No use cases match your filters.
        </Text>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { UseCasesSection };
