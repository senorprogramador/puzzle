import { useId } from "react";
import { validateContentIds } from "../content/shared";
import type {
  FooterLink,
  FooterSectionProps,
  FooterSectionVariant,
} from "./footer-section.types";

import "./footer-section.css";

const FooterLinks = ({
  links,
}: {
  links: readonly FooterLink[];
}) => (
  <ul>
    {links.map((link) => (
      <li key={link.id}>
        <a href={link.href}>{link.label}</a>
      </li>
    ))}
  </ul>
);

const FooterSection = ({
  variant = "multi-column",
  logo,
  description,
  navigationGroups = [],
  socialLinks = [],
  legalLinks = [],
  newsletter,
  copyright,
  children,
  navigationLabel = "Footer navigation",
  socialLabel = "Social media",
  legalLabel = "Legal",
  className,
}: FooterSectionProps) => {
  const newsletterHeadingId = useId();
  validateContentIds(navigationGroups, "Footer navigation group");
  validateContentIds(
    navigationGroups.flatMap((group) => group.links),
    "Footer navigation link",
  );
  validateContentIds(socialLinks, "Footer social link");
  validateContentIds(legalLinks, "Footer legal link");

  return (
    <footer
      className={["puzzle-footer-section", className]
        .filter(Boolean)
        .join(" ")}
      data-variant={variant satisfies FooterSectionVariant}
    >
      <div className="puzzle-footer-section__content">
        {logo || description ? (
          <div className="puzzle-footer-section__identity">
            {logo ? <div className="puzzle-footer-section__logo">{logo}</div> : null}
            {description ? (
              <p className="puzzle-footer-section__description">{description}</p>
            ) : null}
          </div>
        ) : null}

        {navigationGroups.length ? (
          <nav
            className="puzzle-footer-section__navigation"
            aria-label={navigationLabel}
          >
            {navigationGroups.map((group) => (
              <section
                className="puzzle-footer-section__group"
                key={group.id}
              >
                <h2>{group.label}</h2>
                <FooterLinks links={group.links} />
              </section>
            ))}
          </nav>
        ) : null}

        {socialLinks.length ? (
          <nav aria-label={socialLabel} className="puzzle-footer-section__social">
            <ul>
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} aria-label={typeof link.label === "string" ? link.label : undefined}>
                    {link.icon ? (
                      <span aria-hidden="true">{link.icon}</span>
                    ) : null}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {newsletter ? (
          <section
            className="puzzle-footer-section__newsletter"
            aria-labelledby={newsletterHeadingId}
          >
            <h2 id={newsletterHeadingId}>Newsletter</h2>
            {newsletter}
          </section>
        ) : null}

        {children ? (
          <div className="puzzle-footer-section__additional">{children}</div>
        ) : null}

        {copyright || legalLinks.length ? (
          <div className="puzzle-footer-section__bottom">
            {copyright ? (
              <p className="puzzle-footer-section__copyright">{copyright}</p>
            ) : null}
            {legalLinks.length ? (
              <nav aria-label={legalLabel} className="puzzle-footer-section__legal">
                <FooterLinks links={legalLinks} />
              </nav>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
};

export { FooterSection };
