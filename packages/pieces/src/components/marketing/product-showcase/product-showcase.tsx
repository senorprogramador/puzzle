import { MediaFrame, Tabs } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import { useState } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
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
                <p>{annotation.description}</p>
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
    <h3>{item.title}</h3>
    {item.description ? <p>{item.description}</p> : null}
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
}) => {
  const [requestedIndex, setRequestedIndex] = useState(0);
  const activeIndex = Math.min(requestedIndex, items.length - 1);
  const activeItem = items[activeIndex];

  if (!activeItem) {
    return null;
  }

  return (
    <div
      className="puzzle-product-showcase__carousel"
      role="region"
      aria-label="Product showcase"
      aria-roledescription="carousel"
    >
      <div
        className="puzzle-product-showcase__carousel-slide"
        aria-live="polite"
        aria-atomic="true"
      >
        <ProductCard item={activeItem} variant={variant} />
        <p className="puzzle-product-showcase__carousel-position">
          {activeIndex + 1} of {items.length}
        </p>
      </div>
      <div className="puzzle-product-showcase__carousel-controls">
        <button
          type="button"
          aria-label="Previous product"
          disabled={activeIndex === 0}
          onClick={() => setRequestedIndex(activeIndex - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          aria-label="Next product"
          disabled={activeIndex === items.length - 1}
          onClick={() => setRequestedIndex(activeIndex + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

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
