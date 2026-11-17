import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type VideoSectionVariant =
  | "featured"
  | "split"
  | "background"
  | "carousel"
  | "grid"
  | "playlist"
  | "cinematic"
  | "browser"
  | "phone"
  | "testimonials"
  | "tutorial"
  | "lightbox";

export type VideoSectionAspectRatio = "16 / 9" | "4 / 3" | "1 / 1" | "9 / 16";

export type VideoSource = {
  src: string;
  type?: string;
};

export type VideoCaption = {
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
};

export type VideoItem = {
  id: string;
  title: ReactNode;
  accessibleLabel?: string;
  sources: readonly VideoSource[];
  poster?: string;
  thumbnail?: string;
  duration?: string;
  description?: ReactNode;
  quote?: ReactNode;
  actor?: ReactNode;
  captions?: readonly VideoCaption[];
};

export type VideoSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: VideoSectionVariant;
    videos: readonly VideoItem[];
    featuredVideoId?: string;
    selectedVideoId?: string;
    onVideoSelect?: (videoId: string) => void;
    controls?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    preload?: "none" | "metadata";
    aspectRatio?: VideoSectionAspectRatio;
  };
