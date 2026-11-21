import { MediaFrame, Tabs, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type {
  ProductShowcaseItem,
  ProductShowcaseSectionProps,
  ProductShowcaseVariant,
} from "./product-showcase.types";
import "./product-showcase.css";

const ProductMedia = ({
  item,
  variant,
}: {
  item: ProductShowcaseItem;
  variant: ProductShowcaseVariant;
}) => {
  const defaultFrame =
    variant === "browser"
      ? "browser"
      : variant === "desktop"
        ? "desktop"
        : variant === "mobile" || variant === "device-stack"
          ? "mobile"
          : "none";

  return (
    <div className="puzzle-product-showcase__media">
      <MediaFrame
        frame={item.frame ?? defaultFrame}
        title={item.title}
        caption={item.caption}
      >
        {item.media}
      </MediaFrame>
      {item.annotations?.length ? (
        <ul className="puzzle-product-showcase__annotations">
          {item.annotations.map((annotation) => (
            <li key={annotation.id}>
              <details>
                <summary>{annotation.label}</summary>
                <Text as="p">{annotation.description}</Text>
              </details>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const ProductCopy = ({ item }: { item: ProductShowcaseItem }) => (
  <div className="puzzle-product-showcase__copy">
    <Heading level="headline3" as="h3">{item.title}</Heading>
    {item.description ? <Text as="p">{item.description}</Text> : null}
    {item.action ? (
      <div className="puzzle-product-showcase__action">{item.action}</div>
    ) : null}
  </div>
);

const ProductCard = ({
  item,
  variant,
}: {
  item: ProductShowcaseItem;
  variant: ProductShowcaseVariant;
}) => (
  <article
    className="puzzle-product-showcase__item"
    data-featured={item.featured || undefined}
  >
    <ProductMedia item={item} variant={variant} />
    <ProductCopy item={item} />
  </article>
);

const ProductCarousel = ({
  items,
  variant,
}: {
  items: readonly ProductShowcaseItem[];
  variant: ProductShowcaseVariant;
}) => (
  <PiecesCarousel
    itemKeys={items.map((item) => item.id)}
    slides={items.map((item) => (
      <ProductCard key={item.id} item={item} variant={variant} />
    ))}
    ariaLabel="Product showcase"
    itemLabel="product"
    panelsPerView={{ mobile: 1, tablet: 1, desktop: 2 }}
    gap="var(--puzzle-space-6, 1.5rem)"
  />
);

const ProductShowcaseSection = <C extends ElementType = "section">({
  variant = "split",
  items,
  children,
  className,
  ...sectionProps
}: ProductShowcaseSectionProps<C>) => {
  const stickyItem =
    items.find((item) => item.featured) ?? items[0];

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      fullWidth={sectionProps.fullWidth ?? variant === "full-width"}
      className={`puzzle-product-showcase ${className ?? ""}`.trim()}
      family="product-showcase"
      variant={variant}
    >
      {items.length && variant === "tabs" ? (
        <Tabs className="puzzle-product-showcase__tabs">
          {items.map((item) => (
            <Tabs.Tab key={item.id} id={item.id} tab={item.title}>
              <ProductCard item={item} variant={variant} />
            </Tabs.Tab>
          ))}
        </Tabs>
      ) : items.length && variant === "carousel" ? (
        <ProductCarousel items={items} variant={variant} />
      ) : items.length && variant === "sticky" ? (
        <div className="puzzle-product-showcase__sticky-layout">
          {stickyItem ? (
            <div className="puzzle-product-showcase__sticky-media">
              <ProductMedia item={stickyItem} variant={variant} />
            </div>
          ) : null}
          <ol className="puzzle-product-showcase__list">
            {items.map((item) => (
              <li key={item.id}>
                <ProductCopy item={item} />
              </li>
            ))}
          </ol>
        </div>
      ) : items.length && variant === "device-stack" ? (
        <div className="puzzle-product-showcase__device-stack">
          <div className="puzzle-product-showcase__device-stack-media">
            {items.slice(0, 3).map((item) => (
              <ProductMedia key={item.id} item={item} variant={variant} />
            ))}
          </div>
          <ul className="puzzle-product-showcase__list">
            {items.map((item) => (
              <li key={item.id}>
                <ProductCopy item={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : items.length && variant === "layered" ? (
        <div className="puzzle-product-showcase__layered">
          <div className="puzzle-product-showcase__layers">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="puzzle-product-showcase__layer">
                <ProductMedia item={item} variant={variant} />
              </div>
            ))}
          </div>
          <ul className="puzzle-product-showcase__list">
            {items.map((item) => (
              <li key={item.id}>
                <ProductCopy item={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : items.length ? (
        <ul className="puzzle-product-showcase__list">
          {items.map((item) => (
            <li key={item.id}>
              <ProductCard item={item} variant={variant} />
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { ProductShowcaseSection };
