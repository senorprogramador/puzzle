"use client";

import { Button, Carousel, CarouselController } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons/icon";
import {
  useState,
  type ElementType,
  type KeyboardEvent,
} from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type { LogoCloudItem, LogoCloudSectionProps } from "./logo-cloud.types";
import "./logo-cloud.css";

const LogoMark = ({ logo }: { logo: LogoCloudItem }) => {
  const mark = "src" in logo && logo.src ? (
    <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
  ) : (
    <span role="img" aria-label={logo.alt}>
      {"logo" in logo ? logo.logo : null}
    </span>
  );

  return logo.href ? (
    <a href={logo.href} aria-label={logo.name}>
      {mark}
    </a>
  ) : (
    mark
  );
};

const LogoCloudSection = <C extends ElementType = "section">(
  props: LogoCloudSectionProps<C>,
) => {
  const variant = props.variant ?? "grid";
  const [currentPanel, setCurrentPanel] = useState(0);
  const sectionProps = { ...props };
  delete (sectionProps as Partial<LogoCloudSectionProps<C>>).variant;
  delete (sectionProps as Partial<LogoCloudSectionProps<C>>).logos;
  const logos = props.logos;
  const isCarousel = variant === "carousel";
  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setCurrentPanel((current) =>
      Math.min(
        Math.max(0, logos.length - 1),
        current + (event.key === "ArrowRight" ? 1 : -1),
      ),
    );
  };
  const groups =
    variant === "grouped"
      ? [...new Set(logos.map((logo) => logo.group ?? "Partners"))]
      : [];

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-logo-cloud ${props.className ?? ""}`.trim()}
      family="logo-cloud"
      variant={variant}
    >
      {isCarousel && logos.length ? (
        <div
          className="puzzle-logo-cloud__keyboard"
          role="group"
          tabIndex={0}
          aria-label="Partner logos. Use the left and right arrow keys to navigate."
          onKeyDown={handleCarouselKeyDown}
        >
          <CarouselController
            items={[...logos]}
            currentPanel={currentPanel}
            onPanelChange={setCurrentPanel}
          >
            <Carousel<LogoCloudItem>
              ariaLabel="Partner logos"
              className="puzzle-logo-cloud__carousel"
              gap="var(--puzzle-space-6, 1.5rem)"
              panelsPerView={{ mobile: 2, tablet: 3, desktop: 4 }}
              renderItem={(logo) => (
                <span className="puzzle-logo-cloud__mark">
                  <LogoMark logo={logo} />
                </span>
              )}
              getItemKey={(logo) => logo.id}
              backButton={
                <Button variant="primary" size="sm" aria-label="Previous logos">
                  <Icon name="bx:caret-left" aria-hidden="true" />
                </Button>
              }
              nextButton={
                <Button variant="primary" size="sm" aria-label="Next logos">
                  <Icon name="bx:caret-right" aria-hidden="true" />
                </Button>
              }
            />
          </CarouselController>
        </div>
      ) : variant === "grouped" && logos.length ? (
        <div className="puzzle-logo-cloud__groups">
          {groups.map((group) => (
            <div className="puzzle-logo-cloud__group" key={group}>
              <h3>{group}</h3>
              <ul className="puzzle-logo-cloud__list">
                {logos
                  .filter((logo) => (logo.group ?? "Partners") === group)
                  .map((logo) => (
                    <li key={logo.id} data-featured={logo.featured || undefined}>
                      <LogoMark logo={logo} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : logos.length ? (
        <ul className="puzzle-logo-cloud__list">
          {logos.map((logo) => (
            <li
              key={logo.id}
              data-featured={logo.featured || undefined}
              data-group={logo.group}
            >
              <LogoMark logo={logo} />
            </li>
          ))}
        </ul>
      ) : null}
      {props.children}
    </MarketingSection>
  );
};

export { LogoCloudSection };
