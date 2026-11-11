import type { AriaRole, CSSProperties, ElementType, ReactNode } from "react";

export type HeroLayout = "centered" | "split" | "full-width" | "asymmetric";

export type HeroMediaPosition = "left" | "right" | "background";

export type HeroAlignment = "start" | "center" | "end";

export type HeroHeight = "auto" | "large" | "viewport";

export type HeroTheme = "light" | "dark" | "contrast" | "brand";

export type HeroOverlay = "none" | "subtle" | "strong" | "gradient";

export type HeroContentWidth = "narrow" | "normal" | "wide" | "full";

export type HeroVideoSource = {
  src: string;
  type?: string;
  poster?: string;
};

export type HeroProps = {
  as?: ElementType;
  titleAs?: ElementType;

  id?: string;
  testId?: string;
  className?: string;
  contentClassName?: string;
  mediaClassName?: string;
  style?: CSSProperties;

  layout?: HeroLayout;
  mediaPosition?: HeroMediaPosition;
  alignment?: HeroAlignment;
  height?: HeroHeight;
  theme?: HeroTheme;
  overlay?: HeroOverlay;
  contentWidth?: HeroContentWidth;

  reverseOnMobile?: boolean;

  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;

  media?: ReactNode;
  backgroundImage?: string;
  backgroundVideo?: HeroVideoSource;

  actions?: ReactNode;
  search?: ReactNode;
  meta?: ReactNode;

  children?: ReactNode;

  role?: AriaRole;
  ariaLabel?: string;
  ariaLabelledBy?: string;
};
