import { ServiceCard } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import { BusinessFigure } from "../shared";
import type { BusinessService } from "../shared.types";
import type {
  ServicesSectionProps,
  ServicesSectionVariant,
} from "./services-section.types";

import "../shared.css";
import "./services-section.css";

const renderServices = (
  items: readonly BusinessService[],
  variant: ServicesSectionVariant,
) =>
  items.length ? (
    <ul
      className="puzzle-business-section__list puzzle-services-section__items"
      aria-label="Services"
      tabIndex={variant === "carousel" ? 0 : undefined}
    >
      {items.map((service, index) => (
        <li key={service.id}>
          <ServiceCard
            {...service}
            number={
              variant === "numbered"
                ? String(index + 1).padStart(2, "0")
                : undefined
            }
            image={
              service.image ? <BusinessFigure image={service.image} /> : undefined
            }
          />
        </li>
      ))}
    </ul>
  ) : null;

const renderCategories = (items: readonly BusinessService[]) => {
  const categories = new Map<string, BusinessService[]>();

  for (const service of items) {
    const category = service.category ?? "Services";
    categories.set(category, [...(categories.get(category) ?? []), service]);
  }

  return categories.size ? (
    <div className="puzzle-services-section__categories">
      {[...categories].map(([category, services]) => (
        <section
          className="puzzle-services-section__category"
          key={category}
          aria-label={category}
        >
          <h3>{category}</h3>
          {renderServices(services, "grid")}
        </section>
      ))}
    </div>
  ) : null;
};

const ServicesSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  featuredService,
  children,
  className,
  ...sectionProps
}: ServicesSectionProps<C>) => {
  validateContentIds(items, "Service");

  const featured =
    typeof featuredService === "string"
      ? items.find((service) => service.id === featuredService)
      : featuredService ??
        items.find((service) => service.featured) ??
        (variant === "featured" ? items[0] : undefined);
  const services = featured
    ? [featured, ...items.filter((service) => service.id !== featured.id)]
    : items;

  const content =
    variant === "categorized"
      ? renderCategories(services)
      : renderServices(services, variant);
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-services-section ${className ?? ""}`.trim()}
      family="services"
      variant={variant satisfies ServicesSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { ServicesSection };
