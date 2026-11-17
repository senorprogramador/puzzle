import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type LogoCloudVariant =
  | "grid"
  | "centered"
  | "monochrome"
  | "colored"
  | "carousel"
  | "marquee"
  | "featured"
  | "grouped"
  | "compact"
  | "split"
  | "bordered"
  | "dark";

type LogoCloudImage = { src: string; logo?: never };
type LogoCloudNode = { logo: ReactNode; src?: never };

export type LogoCloudItem = {
  id: string;
  name: string;
  alt: string;
  href?: string;
  group?: string;
  featured?: boolean;
} & (LogoCloudImage | LogoCloudNode);

type LogoCloudSectionBaseProps<C extends ElementType> =
  MarketingSectionBaseProps<C> & {
    logos: readonly LogoCloudItem[];
  };

export type LogoCloudSectionProps<C extends ElementType = "section"> =
  LogoCloudSectionBaseProps<C> & {
    variant?: LogoCloudVariant;
  };
