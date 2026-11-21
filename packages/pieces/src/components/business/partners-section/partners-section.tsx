import { LogoCollection, Heading } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type { BusinessPartner } from "../shared.types";
import type {
  PartnersSectionProps,
  PartnersSectionVariant,
} from "./partners-section.types";

import "../shared.css";
import "./partners-section.css";

const renderPartners = (items: readonly BusinessPartner[]) => (
  <LogoCollection
    items={items}
    label="Partners"
    className="puzzle-partners-section__logos"
  />
);

const renderCategories = (items: readonly BusinessPartner[]) => {
  const categories = new Map<string, BusinessPartner[]>();

  for (const partner of items) {
    const category = partner.category ?? "Partners";
    categories.set(category, [...(categories.get(category) ?? []), partner]);
  }

  return categories.size ? (
    <div className="puzzle-partners-section__categories">
      {[...categories].map(([category, partners]) => (
        <section
          className="puzzle-partners-section__category"
          key={category}
        >
          <Heading level="headline3" as="h3">{category}</Heading>
          {renderPartners(partners)}
        </section>
      ))}
    </div>
  ) : null;
};

const PartnersSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  featuredPartner,
  children,
  className,
  ...sectionProps
}: PartnersSectionProps<C>) => {
  validateContentIds(items, "Partner");

  const featured =
    typeof featuredPartner === "string"
      ? items.find((partner) => partner.id === featuredPartner)
      : featuredPartner ??
        items.find((partner) => partner.featured) ??
        (variant === "featured" ? items[0] : undefined);
  const partners = featured
    ? [featured, ...items.filter((partner) => partner.id !== featured.id)]
    : items;
  const content =
    variant === "categories"
      ? renderCategories(partners)
      : variant === "carousel" ? (
        <PiecesCarousel
          itemKeys={partners.map((partner) => partner.id)}
          slides={partners.map((partner) => (
            <LogoCollection
              key={partner.id}
              items={[partner]}
              label="Partner"
              className="puzzle-partners-section__logos"
            />
          ))}
          ariaLabel="Partners"
          itemLabel="partner"
          panelsPerView={{ mobile: 2, tablet: 3, desktop: 4 }}
          gap="var(--puzzle-space-4, 1rem)"
        />
      ) : renderPartners(partners);
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-partners-section ${className ?? ""}`.trim()}
      family="partners"
      variant={variant satisfies PartnersSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { PartnersSection };
