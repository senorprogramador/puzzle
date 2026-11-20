import { cn } from "@puzzle-ui/core";
import { Card, Heading, Text } from "@puzzle-ui/ui";
import { validateContentIds } from "../../content/shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import type {
  HouseRuleCategory,
  HouseRulesSectionProps,
  HouseRulesVariant,
} from "./house-rules-section.types";

import "./house-rules-section.css";

const RuleList = ({
  category,
  variant,
}: {
  category: HouseRuleCategory;
  variant: HouseRulesVariant;
}) => (
  <>
    {variant === "expanded" && category.description ? (
      <Text as="p" className="puzzle-house-rules__category-description">
        {category.description}
      </Text>
    ) : null}
    <dl className="puzzle-house-rules__items">
      {category.rules.map((rule) => (
        <div key={rule.id}>
          <dt>{rule.label}</dt>
          <dd>
            {rule.value}
            {variant === "expanded" && rule.description ? (
              <Text as="span" className="puzzle-house-rules__description">
                {rule.description}
              </Text>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  </>
);

const HouseRuleCard = ({
  category,
  variant,
  collapsible,
  defaultOpen,
}: {
  category: HouseRuleCategory;
  variant: HouseRulesVariant;
  collapsible: boolean;
  defaultOpen: boolean;
}) => (
  <Card
    as="article"
    variant="outlined"
    className="puzzle-house-rules__card"
  >
    {collapsible ? (
      <details open={defaultOpen}>
        <summary>
          <Heading level="headline3" as="span">
            {category.title}
          </Heading>
        </summary>
        <RuleList category={category} variant={variant} />
      </details>
    ) : (
      <>
        <Heading level="headline3" as="h3">
          {category.title}
        </Heading>
        <RuleList category={category} variant={variant} />
      </>
    )}
  </Card>
);

const HouseRulesSection = ({
  categories,
  variant = "expanded",
  collapsible = false,
  defaultOpen = false,
  emptyState = "No house rules provided.",
  children,
  className,
  ...sectionProps
}: HouseRulesSectionProps) => {
  validateContentIds(categories, "House rule categories");
  categories.forEach((category) =>
    validateContentIds(category.rules, `House rules in "${category.id}"`),
  );

  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;

  return (
    <MarketingSection
      {...nativeProps}
      className={cn("puzzle-house-rules", className)}
      family="house-rules"
      variant={variant}
    >
      {categories.length ? (
        <ul className="puzzle-house-rules__grid">
          {categories.map((category) => (
            <li key={category.id}>
              <HouseRuleCard
                category={category}
                variant={variant}
                collapsible={collapsible}
                defaultOpen={defaultOpen}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="puzzle-house-rules__empty" role="status">
          {emptyState}
        </div>
      )}
      {children}
    </MarketingSection>
  );
};

export { HouseRulesSection };
