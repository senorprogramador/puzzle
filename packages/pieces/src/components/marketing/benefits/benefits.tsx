import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type { ElementType } from "react";
import type { BenefitItem, BenefitsSectionProps } from "./benefits.types";
import "./benefits.css";

const BenefitContent = ({
  item,
  index,
  numbered,
}: {
  item: BenefitItem;
  index: number;
  numbered: boolean;
}) => (
  <article className="puzzle-benefits__item" data-featured={item.featured || undefined}>
    {item.media ? <div className="puzzle-benefits__media">{item.media}</div> : null}
    {item.icon ? <div className="puzzle-benefits__icon">{item.icon}</div> : null}
    <div className="puzzle-benefits__copy">
      <h3>{numbered ? `${index + 1}. ` : null}{item.title}</h3>
      {item.description ? <p>{item.description}</p> : null}
      {item.action ? <div className="puzzle-benefits__action">{item.action}</div> : null}
    </div>
  </article>
);

const BenefitsSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  children,
  className,
  ...sectionProps
}: BenefitsSectionProps<C>) => (
  <MarketingSection<C>
    {...(sectionProps as MarketingSectionBaseProps<C>)}
    className={`puzzle-benefits ${className ?? ""}`.trim()}
    family="benefits"
    variant={variant}
  >
    {items.length ? (
      <ul className="puzzle-benefits__list">
        {items.map((item, index) => (
          <li key={item.id} data-featured={item.featured || undefined}>
            <BenefitContent
              item={item}
              index={index}
              numbered={variant === "numbered"}
            />
          </li>
        ))}
      </ul>
    ) : null}
    {children}
  </MarketingSection>
);

export { BenefitsSection };
