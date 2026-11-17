import { useState } from "react";
import { FooterSection, type FooterSectionVariant } from "@puzzle-ui/pieces";
import { Button, TextInput } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const navigationGroups = [
  {
    id: "company",
    label: "Company",
    links: [
      { id: "about", label: "About", href: "/docs/pieces/components/about-section" },
      { id: "careers", label: "Careers", href: "/docs/pieces/components/careers-section" },
      { id: "contact", label: "Contact", href: "/docs/pieces/components/contact-section" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    links: [
      { id: "guides", label: "Guides", href: "/docs/pieces/components/resource-section" },
      { id: "events", label: "Events", href: "/docs/pieces/components/event-section" },
      { id: "journal", label: "Journal", href: "/docs/pieces/components/blog-section" },
    ],
  },
  {
    id: "products",
    label: "Products",
    links: [
      { id: "platform", label: "Platform", href: "/docs/pieces/components/product-showcase" },
      { id: "pricing", label: "Pricing", href: "/docs/pieces/components/pricing" },
      { id: "status", label: "Status", href: "/docs/pieces/components/feedback" },
    ],
  },
];

const variants: SectionVariantPreview<FooterSectionVariant>[] = [
  { variant: "multi-column", useCase: "Group key site destinations." },
  { variant: "minimal", useCase: "End a small site with a short legal line." },
  { variant: "centered", useCase: "Center a simple brand sign-off." },
  { variant: "large", useCase: "Give the brand statement more space." },
  { variant: "newsletter", useCase: "Pair navigation with a newsletter slot." },
  { variant: "social", useCase: "Make social destinations easy to find." },
  { variant: "mega", useCase: "Show a broad set of multi-level destinations." },
  { variant: "editorial", useCase: "Use a restrained magazine-style ending." },
  { variant: "dark", useCase: "Create a contrasting visual footer." },
  { variant: "split", useCase: "Separate brand information from navigation." },
  { variant: "cta", useCase: "Give a final call to action a clear place." },
  { variant: "portfolio", useCase: "Support a studio or agency portfolio." },
  { variant: "ecommerce", useCase: "Organize shop, support, and policy links." },
  { variant: "legal", useCase: "Emphasize copyright and legal destinations." },
];

export const FooterSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="FooterSection"
    variants={variants}
    buildCode={(variant) =>
      `<FooterSection variant="${variant}" navigationGroups={navigationGroups} legalLinks={legalLinks} />`
    }
    renderVariant={(variant) => (
      <FooterSection
        variant={variant}
        logo={<strong>Northstar Studio</strong>}
        description="Tools for teams building better work."
        navigationGroups={navigationGroups}
        socialLinks={[
          {
            id: "linkedin",
            label: "LinkedIn",
            href: "https://www.linkedin.com/",
          },
          {
            id: "instagram",
            label: "Instagram",
            href: "https://www.instagram.com/",
          },
        ]}
        legalLinks={[
          { id: "privacy", label: "Privacy", href: "/privacy" },
          { id: "terms", label: "Terms", href: "/terms" },
        ]}
        copyright="© 2026 Northstar Studio"
        newsletter={
          variant === "newsletter" ? <NewsletterSignup /> : undefined
        }
        children={
          variant === "cta" ? (
            <Button href="/docs/pieces/components/contact-section">
              Plan a project with us
            </Button>
          ) : undefined
        }
      />
    )}
  />
);

const NewsletterSignup = () => {
  const [submitted, setSubmitted] = useState(false);

  return submitted ? (
    <p role="status">Thanks — the studio notes are on their way.</p>
  ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="footer-newsletter-email">Email address</label>
      <TextInput id="footer-newsletter-email" type="email" required />
      <Button type="submit">Subscribe</Button>
    </form>
  );
};

export const FooterNewsletterExample = () => (
  <FooterSection
    variant="newsletter"
    logo={<strong>Morrow Journal</strong>}
    description="Thoughtful ideas for people making useful things."
    navigationGroups={navigationGroups.slice(0, 2)}
    newsletter={<NewsletterSignup />}
    legalLinks={[
      { id: "privacy", label: "Privacy", href: "/privacy" },
      { id: "terms", label: "Terms", href: "/terms" },
    ]}
    copyright="© 2026 Morrow Journal"
  />
);
