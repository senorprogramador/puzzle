import { Accordion, Tabs, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type { FeatureItem, FeaturesSectionProps } from "./features.types";
import "./features.css";

const FeatureContent = ({
  item,
  index,
  numbered,
  hideMedia = false,
}: {
  item: FeatureItem;
  index: number;
  numbered: boolean;
  hideMedia?: boolean;
}) => (
  <article className="puzzle-features__item" data-featured={item.featured || undefined}>
    {item.media && !hideMedia ? <div className="puzzle-features__media">{item.media}</div> : null}
    {item.icon ? <div className="puzzle-features__icon">{item.icon}</div> : null}
    <div className="puzzle-features__copy">
      <Heading level="headline3" as="h3">
        {numbered ? `${index + 1}. ` : null}
        {item.title}
      </Heading>
      {item.description ? <Text as="p">{item.description}</Text> : null}
      {item.content}
      {item.action ? <div className="puzzle-features__action">{item.action}</div> : null}
    </div>
  </article>
);

const FeaturesSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  children,
  className,
  ...sectionProps
}: FeaturesSectionProps<C>) => {
  const numbered = variant === "numbered";
  const stickyMedia =
    variant === "sticky"
      ? items.find((item) => item.featured && item.media) ??
        items.find((item) => item.media)
      : undefined;

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      fullWidth={
        sectionProps.fullWidth ?? variant === "full-width"
      }
      className={`puzzle-features ${className ?? ""}`.trim()}
      family="features"
      variant={variant}
    >
      {items.length && variant === "tabs" ? (
        <Tabs className="puzzle-features__tabs">
          {items.map((item, index) => (
            <Tabs.Tab key={item.id} id={item.id} tab={item.title}>
              <FeatureContent item={item} index={index} numbered={numbered} />
            </Tabs.Tab>
          ))}
        </Tabs>
      ) : items.length && variant === "accordion" ? (
        <Accordion
          className="puzzle-features__accordion"
          headingLevel={3}
          items={items.map((item) => ({
            id: item.id,
            title: item.title,
            content: (
              <>
                {item.media}
                {item.description}
                {item.content}
                {item.action}
              </>
            ),
          }))}
        />
      ) : items.length && variant === "sticky" ? (
        <div
          className="puzzle-features__sticky-layout"
          data-has-media={stickyMedia?.media != null}
        >
          {stickyMedia?.media ? (
            <div className="puzzle-features__sticky-media">
              {stickyMedia.media}
            </div>
          ) : null}
          <ul className="puzzle-features__list">
            {items.map((item, index) => (
              <li key={item.id} data-featured={item.featured || undefined}>
                <FeatureContent
                  item={item}
                  index={index}
                  numbered={numbered}
                  hideMedia={item === stickyMedia}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : items.length ? (
        <ul className="puzzle-features__list">
          {items.map((item, index) => (
            <li key={item.id} data-featured={item.featured || undefined}>
              <FeatureContent item={item} index={index} numbered={numbered} />
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { FeaturesSection };
