import type { ReactNode } from "react";

export type FooterSectionVariant =
  | "multi-column"
  | "minimal"
  | "centered"
  | "large"
  | "newsletter"
  | "social"
  | "mega"
  | "editorial"
  | "dark"
  | "split"
  | "cta"
  | "portfolio"
  | "ecommerce"
  | "legal";

export type FooterLink = {
  id: string;
  label: ReactNode;
  href: string;
};

export type FooterNavigationGroup = {
  id: string;
  label: ReactNode;
  links: readonly FooterLink[];
};

export type FooterSocialLink = FooterLink & {
  icon?: ReactNode;
};

export type FooterSectionProps = {
  variant?: FooterSectionVariant;
  logo?: ReactNode;
  description?: ReactNode;
  navigationGroups?: readonly FooterNavigationGroup[];
  socialLinks?: readonly FooterSocialLink[];
  legalLinks?: readonly FooterLink[];
  newsletter?: ReactNode;
  copyright?: ReactNode;
  children?: ReactNode;
  navigationLabel?: string;
  socialLabel?: string;
  legalLabel?: string;
  className?: string;
};
