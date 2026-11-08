"use client";

import { createElement } from "react";
import { cn } from "@puzzle-ui/core";
import { useThemeComponents } from "@puzzle-ui/theme/components-context";
import type {
  ThemeLinkComponent,
  ThemeLinkComponentConfig,
} from "@puzzle-ui/theme";
import type { LinkProps } from "./types";
import "./link.css";

const isThemeLinkComponentConfig = (
  value: ThemeLinkComponent | undefined,
): value is ThemeLinkComponentConfig => {
  return typeof value === "object" && value !== null && "component" in value;
};

/**
 * Ensures links opening a new browsing context are protected
 * from reverse-tabnabbing.
 */
const resolveRel = (target?: string, rel?: string): string | undefined => {
  if (target !== "_blank") {
    return rel;
  }

  const tokens = new Set((rel ?? "").split(/\s+/).filter(Boolean));

  tokens.add("noopener");
  tokens.add("noreferrer");

  return [...tokens].join(" ");
};

const Link = ({
  href,
  className,
  componentProps,
  children,
  target,
  rel,
  ref,
  ...rest
}: LinkProps) => {
  const components = useThemeComponents();
  const linkConfig = components?.link;

  const isConfigured = isThemeLinkComponentConfig(linkConfig);

  const Component = isConfigured ? linkConfig.component : (linkConfig ?? "a");

  const hrefProp = isConfigured ? (linkConfig.hrefProp ?? "href") : "href";

  const classes = cn("puzzle-link", className);

  const elementProps = {
    ...componentProps,
    ...rest,
    [hrefProp]: href,
    ref,
    target,
    rel: resolveRel(target, rel),
    className: classes,
  };

  return createElement(Component, elementProps as never, children);
};

export { Link, type LinkProps };
