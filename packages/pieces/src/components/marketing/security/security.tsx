import { Badge, Card, Heading } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  SecurityItem,
  SecuritySectionProps,
  SecurityVariant,
} from "./security.types";
import "./security.css";

const SecurityItemCard = ({
  item,
  variant,
}: {
  item: SecurityItem;
  variant: SecurityVariant;
}) => {
  const content = (
    <>
      {item.icon ? (
        <span className="puzzle-security__icon">{item.icon}</span>
      ) : null}
      {variant === "metrics" && item.value != null ? (
        <span className="puzzle-security__value">{item.value}</span>
      ) : null}
      <span className="puzzle-security__copy">
        <span className="puzzle-security__title">{item.title}</span>
        {item.description ? (
          <span className="puzzle-security__description">
            {item.description}
          </span>
        ) : null}
        {item.label != null ? (
          <Badge content={item.label} className="puzzle-security__badge" />
        ) : null}
      </span>
    </>
  );
  const className = "puzzle-security__item";

  return (
    <li data-featured={item.featured || undefined}>
      {variant === "cards" ? (
        <Card
          as="article"
          className={className}
          variant="outlined"
        >
          {item.href ? (
            <a className="puzzle-security__card-link" href={item.href}>
              {content}
            </a>
          ) : (
            content
          )}
        </Card>
      ) : item.href ? (
        <a className={className} href={item.href}>
          {content}
        </a>
      ) : (
        <article className={className}>{content}</article>
      )}
    </li>
  );
};

const SecurityList = ({
  items,
  variant,
}: {
  items: readonly SecurityItem[];
  variant: SecurityVariant;
}) => (
  <ul className="puzzle-security__list">
    {items.map((item) => (
      <SecurityItemCard key={item.id} item={item} variant={variant} />
    ))}
  </ul>
);

const groupItems = (items: readonly SecurityItem[]) => {
  const groups = new Map<string, SecurityItem[]>();

  items.forEach((item) => {
    const category = item.category ?? "Other controls";
    groups.set(category, [...(groups.get(category) ?? []), item]);
  });

  return [...groups.entries()];
};

const SecuritySection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  auditInfo,
  children,
  className,
  ...sectionProps
}: SecuritySectionProps<C>) => {
  const featuredItem = items.find((item) => item.featured) ?? items[0];
  const groups = groupItems(items);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-security ${className ?? ""}`.trim()}
      family="security"
      variant={variant}
    >
      {items.length && (variant === "compliance" || variant === "certifications") ? (
        <div className="puzzle-security__groups">
          {groups.map(([category, categoryItems]) => (
            <section key={category}>
              <Heading level="headline3" as="h3">{category}</Heading>
              <SecurityList items={categoryItems} variant={variant} />
            </section>
          ))}
        </div>
      ) : items.length && variant === "featured" ? (
        <div className="puzzle-security__featured">
          {featuredItem ? (
            <SecurityList items={[featuredItem]} variant={variant} />
          ) : null}
          {items.length > 1 ? (
            <SecurityList
              items={items.filter((item) => item !== featuredItem)}
              variant={variant}
            />
          ) : null}
        </div>
      ) : items.length && variant === "split" ? (
        <div className="puzzle-security__split">
          {featuredItem ? (
            <SecurityList items={[featuredItem]} variant={variant} />
          ) : null}
          {items.length > 1 ? (
            <SecurityList
              items={items.filter((item) => item !== featuredItem)}
              variant={variant}
            />
          ) : null}
        </div>
      ) : items.length || auditInfo ? (
        <>
          {items.length ? <SecurityList items={items} variant={variant} /> : null}
          {variant === "audit" && auditInfo ? (
            <aside className="puzzle-security__audit">
              <Heading level="headline3" as="h3">Audit information</Heading>
              {auditInfo}
            </aside>
          ) : null}
        </>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { SecuritySection };
