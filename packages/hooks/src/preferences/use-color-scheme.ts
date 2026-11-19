import { useEffect, useState } from "react";

export type ColorScheme = "light" | "dark";

export type UseColorSchemeOptions = {
  /**
   * Element whose computed CSS determines the color scheme.
   * Defaults to document.documentElement.
   */
  target?: () => HTMLElement | null;

  /**
   * CSS property used to detect the active color scheme.
   * Defaults to color-scheme.
   */
  property?: string;
};

const getDocumentRoot = () =>
  typeof document !== "undefined" ? document.documentElement : null;

const getColorScheme = (
  element: HTMLElement,
  property: string,
): ColorScheme => {
  const value = getComputedStyle(element)
    .getPropertyValue(property)
    .trim()
    .toLowerCase();

  return value.includes("dark") ? "dark" : "light";
};

export const useColorScheme = ({
  target = getDocumentRoot,
  property = "color-scheme",
}: UseColorSchemeOptions = {}): ColorScheme | undefined => {
  const [scheme, setScheme] = useState<ColorScheme>();

  useEffect(() => {
    const element = target();

    if (!element) return;

    const update = () => {
      const nextScheme = getColorScheme(element, property);

      setScheme((current) => (current === nextScheme ? current : nextScheme));
    };

    update();

    const observer = new MutationObserver(update);

    observer.observe(element, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    return () => observer.disconnect();
  }, [target, property]);

  return scheme;
};
