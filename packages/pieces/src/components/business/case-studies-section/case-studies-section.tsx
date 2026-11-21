import { CaseStudyCard } from "@puzzle-ui/ui";
import type { ElementType, ReactNode } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import { validateContentIds } from "../../content/shared";
import { BusinessFigure } from "../shared";
import type { BusinessCaseStudy } from "../shared.types";
import type {
  CaseStudiesSectionProps,
  CaseStudiesSectionVariant,
} from "./case-studies-section.types";

import "../shared.css";
import "./case-studies-section.css";

const renderCaseMedia = (
  item: BusinessCaseStudy,
  variant: CaseStudiesSectionVariant,
): ReactNode => {
  if (variant === "before-after" && item.beforeAfter) {
    return (
      <div className="puzzle-case-studies-section__comparison">
        <div>
          <BusinessFigure image={item.beforeAfter.before} />
          <span>Before</span>
        </div>
        <div>
          <BusinessFigure image={item.beforeAfter.after} />
          <span>After</span>
        </div>
      </div>
    );
  }

  return item.image ? <BusinessFigure image={item.image} /> : undefined;
};

const CaseStudiesSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  featuredCase,
  children,
  className,
  ...sectionProps
}: CaseStudiesSectionProps<C>) => {
  validateContentIds(items, "Case study");

  const featured =
    typeof featuredCase === "string"
      ? items.find((item) => item.id === featuredCase)
      : featuredCase ??
        items.find((item) => item.featured) ??
        (variant === "featured" ? items[0] : undefined);
  const cases = featured
    ? [featured, ...items.filter((item) => item.id !== featured.id)]
    : items;
  const content = cases.length && variant === "carousel" ? (
    <PiecesCarousel
      itemKeys={cases.map((item) => item.id)}
      slides={cases.map((item) => (
        <CaseStudyCard
          key={item.id}
          {...item}
          media={renderCaseMedia(item, variant)}
          featured={item.featured || item.id === featured?.id}
        />
      ))}
      ariaLabel="Case studies"
      itemLabel="case study"
      panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap="var(--puzzle-space-5, 1.25rem)"
    />
  ) : cases.length ? (
    <ul
      className="puzzle-business-section__list puzzle-case-studies-section__items"
      aria-label="Case studies"
      tabIndex={variant === "horizontal" ? 0 : undefined}
    >
      {cases.map((item) => (
        <li key={item.id}>
          <CaseStudyCard
            {...item}
            media={renderCaseMedia(item, variant)}
            featured={item.featured || item.id === featured?.id}
          />
        </li>
      ))}
    </ul>
  ) : null;
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-case-studies-section ${className ?? ""}`.trim()}
      family="case-studies"
      variant={variant satisfies CaseStudiesSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { CaseStudiesSection };
