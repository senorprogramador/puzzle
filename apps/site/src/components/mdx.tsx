import defaultMdxComponents from "fumadocs-ui/mdx";
import type { ComponentProps, ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { cn } from "@puzzle-ui/core";
import { PackageManagerTab, PackageManagerTabs } from "./package-manager-tabs";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

// Wraps Fumadocs' heading (keeps anchors and copy-link) with Puzzle typography.
const createHeading = (tag: HeadingTag, level: string) => {
  const Base = defaultMdxComponents[tag] as ComponentType<
    ComponentProps<HeadingTag>
  >;

  const Heading = (props: ComponentProps<HeadingTag>) => (
    <Base
      {...props}
      className={cn(
        "puzzle-docs-heading",
        `puzzle-typography-${level}`,
        props.className,
      )}
    />
  );

  return Heading;
};

const headings = {
  h1: createHeading("h1", "headline1"),
  h2: createHeading("h2", "headline2"),
  h3: createHeading("h3", "headline3"),
  h4: createHeading("h4", "headline4"),
};

export const DocsHeading2 = headings.h2;

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...headings,
    PackageManagerTabs,
    PackageManagerTab,
    ...components,
  } satisfies MDXComponents;
}
export const useMDXComponents = getMDXComponents;
declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
