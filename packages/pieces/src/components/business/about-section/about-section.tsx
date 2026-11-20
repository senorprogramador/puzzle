import { CompanyInfo, MetricList, ProfileCard, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { BusinessFigure } from "../shared";
import type {
  AboutSectionProps,
  AboutSectionVariant,
} from "./about-section.types";

import "../shared.css";
import "./about-section.css";

const AboutSection = <C extends ElementType = "section">({
  variant = "split",
  company,
  story,
  mission,
  vision,
  images = [],
  stats = [],
  values = [],
  timeline = [],
  team = [],
  children,
  className,
  ...sectionProps
}: AboutSectionProps<C>) => {
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-about-section ${className ?? ""}`.trim()}
      family="about"
      variant={variant satisfies AboutSectionVariant}
    >
      <div className="puzzle-about-section__content">
        {company ? (
          <CompanyInfo
            {...company}
            className="puzzle-about-section__company"
          />
        ) : null}

        {story ? (
          <article className="puzzle-about-section__story">
            {story.title ? <Heading level="headline3" as="h3">{story.title}</Heading> : null}
            <Text as="p">{story.description}</Text>
            {story.image ? (
              <BusinessFigure
                image={story.image}
                className="puzzle-about-section__story-image"
              />
            ) : null}
          </article>
        ) : null}

        {mission || vision ? (
          <div className="puzzle-about-section__purpose">
            {mission ? (
              <article>
                <Heading level="headline3" as="h3">Our mission</Heading>
                <Text as="p">{mission}</Text>
              </article>
            ) : null}
            {vision ? (
              <article>
                <Heading level="headline3" as="h3">Our vision</Heading>
                <Text as="p">{vision}</Text>
              </article>
            ) : null}
          </div>
        ) : null}

        {images.length ? (
          <ul
            className="puzzle-business-section__list puzzle-about-section__images"
            aria-label="About the company"
          >
            {images.map((image, index) => (
              <li key={`${image.src ?? "image"}-${index}`}>
                <BusinessFigure image={image} />
              </li>
            ))}
          </ul>
        ) : null}

        <MetricList
          items={stats}
          className="puzzle-about-section__stats"
        />

        {values.length ? (
          <ul className="puzzle-business-section__list puzzle-about-section__values">
            {values.map((value) => (
              <li key={value.id}>
                <article>
                  {value.icon ? (
                    <span aria-hidden="true">{value.icon}</span>
                  ) : null}
                  <Heading level="headline3" as="h3">{value.title}</Heading>
                  {value.description ? <Text as="p">{value.description}</Text> : null}
                </article>
              </li>
            ))}
          </ul>
        ) : null}

        {timeline.length ? (
          <ol className="puzzle-about-section__timeline">
            {timeline.map((item) => (
              <li key={item.id}>
                <span className="puzzle-about-section__year">{item.year}</span>
                <div>
                  <Heading level="headline3" as="h3">{item.title}</Heading>
                  {item.description ? <Text as="p">{item.description}</Text> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {team.length ? (
          <ul className="puzzle-business-section__list puzzle-about-section__team">
            {team.map((member) => (
              <li key={member.id}>
                <ProfileCard {...member} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {children}
    </MarketingSection>
  );
};

export { AboutSection };
