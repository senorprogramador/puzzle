import { CompanyInfo, LogoCollection, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import type { BusinessAward } from "../shared.types";
import type {
  AwardsSectionProps,
  AwardsSectionVariant,
} from "./awards-section.types";

import "../shared.css";
import "./awards-section.css";

const AwardCard = ({
  award,
  featured,
}: {
  award: BusinessAward;
  featured?: boolean;
}) => (
  <article
    className="puzzle-awards-section__award"
    data-featured={featured || undefined}
  >
    <CompanyInfo
      name={award.organization}
      logo={award.logo}
      className="puzzle-awards-section__organization"
    />
    <div className="puzzle-awards-section__award-content">
      <Text as="p" className="puzzle-awards-section__year">{award.year}</Text>
      <Heading level="headline3" as="h3">{award.title}</Heading>
      {award.description ? <Text as="p">{award.description}</Text> : null}
      {award.href ? (
        <a
          href={award.href}
          target={award.external ? "_blank" : undefined}
          rel={award.external ? "noopener noreferrer" : undefined}
        >
          Learn about the award
        </a>
      ) : null}
    </div>
  </article>
);

const AwardsSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  featuredAward,
  children,
  className,
  ...sectionProps
}: AwardsSectionProps<C>) => {
  validateContentIds(items, "Award");

  const featured =
    typeof featuredAward === "string"
      ? items.find((award) => award.id === featuredAward)
      : featuredAward ??
        items.find((award) => award.featured) ??
        (variant === "featured" ? items[0] : undefined);
  const awards = featured
    ? [featured, ...items.filter((award) => award.id !== featured.id)]
    : items;

  const content =
    variant === "logo-wall" ? (
      <LogoCollection
        items={awards.map((award) => ({
          id: award.id,
          name: `${award.organization} — ${award.title}`,
          image: award.logo,
          description: String(award.year),
          href: award.href,
          external: award.external,
        }))}
        label="Awards and recognition"
        className="puzzle-awards-section__logo-wall"
      />
    ) : awards.length ? (
      <ul className="puzzle-business-section__list puzzle-awards-section__items">
        {awards.map((award) => (
          <li key={award.id}>
            <AwardCard
              award={award}
              featured={award.featured || award.id === featured?.id}
            />
          </li>
        ))}
      </ul>
    ) : null;

  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-awards-section ${className ?? ""}`.trim()}
      family="awards"
      variant={variant satisfies AwardsSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { AwardsSection };
