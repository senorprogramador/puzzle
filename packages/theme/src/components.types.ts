import type { ElementType } from "react";

/**
 * Configuration for a custom Link component.
 *
 * Use this form when the component uses a different prop name
 * for its destination, such as TanStack Router's `to`.
 */
export type ThemeLinkComponentConfig = {
  /** The component used to render links. */
  component: ElementType;

  /**
   * The prop used by the component for its destination.
   *
   * Defaults to "href".
   */
  hrefProp?: "href" | "to";
};

/**
 * Component used to render Puzzle links.
 *
 * A component can either follow the standard `href` contract
 * or use an explicit configuration object.
 *
 * When passing components through a React Server Component boundary,
 * use a component reference exported from a "use client" module.
 */
export type ThemeLinkComponent = ElementType | ThemeLinkComponentConfig | null;

/**
 * Component used to render Puzzle images.
 *
 * Defaults to the native HTML img element.
 *
 * This can be overridden with framework-specific image components,
 * such as Next.js Image or a custom image CDN component.
 *
 * When passing components through a React Server Component boundary,
 * use a component reference exported from a "use client" module.
 */
export type ThemeImageComponent = ElementType | null;

/**
 * Global component overrides provided by Theme.
 */
export type ThemeComponents = {
  link?: ThemeLinkComponent;
  image?: ThemeImageComponent;
};
