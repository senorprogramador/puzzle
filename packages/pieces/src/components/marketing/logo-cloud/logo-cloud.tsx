"use client";

import { Heading } from "@puzzle-ui/ui";
import { type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type { LogoCloudItem, LogoCloudSectionProps } from "./logo-cloud.types";
import "./logo-cloud.css";

const groupLogos = (logos: readonly LogoCloudItem[]) => {
  const groups = new Map<string, LogoCloudItem[]>();

  logos.forEach((logo) => {
    const group = logo.group ?? "Partners";
    const groupLogos = groups.get(group);

    if (groupLogos) {
      groupLogos.push(logo);
    } else {
      groups.set(group, [logo]);
    }
  });

  return [...groups.entries()];
};

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
  const sectionProps = { ...props };
  delete (sectionProps as Partial<LogoCloudSectionProps<C>>).variant;
  delete (sectionProps as Partial<LogoCloudSectionProps<C>>).logos;
  const logos = props.logos;
  const isCarousel = variant === "carousel";
  const groups =
    variant === "grouped"
      ? groupLogos(logos)
      : [];

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-logo-cloud ${props.className ?? ""}`.trim()}
      family="logo-cloud"
      variant={variant}
    >
      {isCarousel && logos.length ? (
        <PiecesCarousel
          itemKeys={logos.map((logo) => logo.id)}
          slides={logos.map((logo) => (
            <span className="puzzle-logo-cloud__mark" key={logo.id}>
              <LogoMark logo={logo} />
            </span>
          ))}
          ariaLabel="Partner logos"
          itemLabel="logos"
          className="puzzle-logo-cloud__carousel"
          gap="var(--puzzle-space-6, 1.5rem)"
          panelsPerView={{ mobile: 2, tablet: 4, desktop: 6 }}
        />
      ) : variant === "grouped" && logos.length ? (
        <div className="puzzle-logo-cloud__groups">
          {groups.map(([group, groupLogos]) => (
            <div className="puzzle-logo-cloud__group" key={group}>
              <Heading level="headline3" as="h3">{group}</Heading>
              <ul className="puzzle-logo-cloud__list">
                {groupLogos.map((logo) => (
                  <li key={logo.id} data-featured={logo.featured || undefined}>
                    <LogoMark logo={logo} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : logos.length ? (
        <ul
          className="puzzle-logo-cloud__list"
          aria-label={variant === "marquee" ? "Partner logos" : undefined}
          tabIndex={variant === "marquee" ? 0 : undefined}
        >
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
