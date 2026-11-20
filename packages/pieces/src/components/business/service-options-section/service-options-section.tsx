import { Badge } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import { ServicesSection } from "../services-section";
import type { BusinessService } from "../shared.types";
import type { ServiceOptionsSectionProps } from "./service-options-section.types";
import "./service-options-section.css";

const ServiceOptionsSection = <C extends ElementType = "section">({
  services,
  featuredServiceId,
  includedLabel = "Included",
  optionalLabel = "Optional",
  variant = "grid",
  className,
  ...sectionProps
}: ServiceOptionsSectionProps<C>) => {
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;
  const items: BusinessService[] = services.map(
    ({ inclusion, price, ...service }) => ({
      ...service,
      pricing:
        price !== undefined || inclusion ? (
          <span className="puzzle-service-options-section__pricing">
            {price !== undefined ? (
              <span className="puzzle-service-options-section__price">
                {price}
              </span>
            ) : null}
            {inclusion ? (
              <Badge
                content={
                  inclusion === "included" ? includedLabel : optionalLabel
                }
                color={inclusion === "included" ? "primary" : "info"}
              />
            ) : null}
          </span>
        ) : undefined,
    }),
  );

  return (
    <ServicesSection<C>
      {...nativeProps}
      className={`puzzle-service-options-section ${className ?? ""}`.trim()}
      variant={variant}
      items={items}
      featuredService={featuredServiceId}
    />
  );
};

export { ServiceOptionsSection };
