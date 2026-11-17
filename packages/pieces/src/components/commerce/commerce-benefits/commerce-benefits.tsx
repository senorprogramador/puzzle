import { Badge, Card } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import type {
  CommerceBenefitItem,
  CommerceBenefitsSectionProps,
  CommerceBenefitsVariant,
} from "./commerce-benefits.types";
import "./commerce-benefits.css";

const BenefitCard = ({
  item,
  variant,
}: {
  item: CommerceBenefitItem;
  variant: CommerceBenefitsVariant;
}) => {
  const content = (
    <>
      {item.icon ? (
        <span className="puzzle-commerce-benefits__icon">{item.icon}</span>
      ) : null}
      <span className="puzzle-commerce-benefits__copy">
        <span className="puzzle-commerce-benefits__title">{item.title}</span>
        {item.description ? (
          <span className="puzzle-commerce-benefits__description">
            {item.description}
          </span>
        ) : null}
        {item.label != null ? (
          <Badge content={item.label} className="puzzle-commerce-benefits__label" />
        ) : null}
      </span>
    </>
  );
  const className = "puzzle-commerce-benefits__item";
  const body = item.href ? (
    <a className="puzzle-commerce-benefits__link" href={item.href}>
      {content}
    </a>
  ) : (
    <div className="puzzle-commerce-benefits__link">{content}</div>
  );
  const action = item.action ? (
    <div className="puzzle-commerce-benefits__action">{item.action}</div>
  ) : null;

  return (
    <li data-kind={item.kind}>
      {variant === "cards" ? (
        <Card as="article" className={className} variant="outlined">
          {body}
          {action}
        </Card>
      ) : (
        <article className={className}>
          {body}
          {action}
        </article>
      )}
    </li>
  );
};

const BenefitList = ({
  items,
  variant,
}: {
  items: readonly CommerceBenefitItem[];
  variant: CommerceBenefitsVariant;
}) => (
  <ul className="puzzle-commerce-benefits__list">
    {items.map((item) => (
      <BenefitCard key={item.id} item={item} variant={variant} />
    ))}
  </ul>
);

const CommerceBenefitsSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  children,
  className,
  ...sectionProps
}: CommerceBenefitsSectionProps<C>) => (
  <MarketingSection<C>
    {...(sectionProps as MarketingSectionBaseProps<C>)}
    className={`puzzle-commerce-benefits ${className ?? ""}`.trim()}
    family="commerce-benefits"
    variant={variant}
  >
    {items.length && variant === "split" ? (
      <div className="puzzle-commerce-benefits__split">
        <BenefitList items={items.slice(0, 1)} variant={variant} />
        {items.length > 1 ? (
          <BenefitList items={items.slice(1)} variant={variant} />
        ) : null}
      </div>
    ) : items.length ? (
      <BenefitList items={items} variant={variant} />
    ) : null}
    {children}
  </MarketingSection>
);

export { CommerceBenefitsSection };
