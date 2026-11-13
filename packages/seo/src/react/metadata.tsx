"use client";

import { createElement, Fragment } from "react";

import type { ReactNode } from "react";

import type { ResolvedSeoMetadata, SeoSocialImage } from "../metadata/types";

import { resolveSeoMetadata, resolveSeoRobots } from "../metadata";

import type { SeoMetadataProps } from "./types";

import { SeoReactContext, useSeoReactContext } from "./context";

const meta = (name: string, content: string | undefined) => {
  if (!content) {
    return null;
  }

  return createElement("meta", {
    key: `${name}:${content}`,
    name,
    content,
  });
};

const property = (propertyName: string, content: string | undefined) => {
  if (!content) {
    return null;
  }

  return createElement("meta", {
    key: `${propertyName}:${content}`,
    property: propertyName,
    content,
  });
};

const imageMeta = (image: SeoSocialImage, index: number) => {
  const entries = [
    property("og:image", image.url),
    property("og:image:alt", image.alt),
    property(
      "og:image:width",
      image.width !== undefined ? String(image.width) : undefined,
    ),
    property(
      "og:image:height",
      image.height !== undefined ? String(image.height) : undefined,
    ),
    property("og:image:type", image.type),
  ];

  return entries.map((element, itemIndex) =>
    element
      ? createElement(Fragment, {
          key: `og-image:${index}:${itemIndex}`,
          children: element,
        })
      : null,
  );
};

// Expects already resolved metadata; resolving twice would reapply the title template.
const renderMetadata = (
  resolved: ResolvedSeoMetadata,
  config: ReturnType<typeof useSeoReactContext>["config"],
) => {
  const robots = resolveSeoRobots(resolved, config);

  const elements = [
    resolved.title
      ? createElement("title", {
          key: "title",
          children: resolved.title,
        })
      : null,

    meta("description", resolved.description),
    meta("robots", robots),
    meta("author", resolved.author),
    meta("keywords", resolved.keywords?.join(", ")),

    createElement("link", {
      key: "canonical",
      rel: "canonical",
      href: resolved.canonical,
    }),

    property("og:title", resolved.openGraph?.title),
    property("og:description", resolved.openGraph?.description),
    property("og:type", resolved.openGraph?.type),
    property("og:url", resolved.openGraph?.url),
    property("og:site_name", resolved.openGraph?.siteName),
    property("og:locale", resolved.openGraph?.locale),

    meta("twitter:card", resolved.twitter?.card),
    meta("twitter:title", resolved.twitter?.title),
    meta("twitter:description", resolved.twitter?.description),
    meta("twitter:site", resolved.twitter?.site),
    meta("twitter:creator", resolved.twitter?.creator),

    ...(resolved.twitter?.images ?? []).map((url, index) =>
      meta(index === 0 ? "twitter:image" : `twitter:image${index + 1}`, url),
    ),

    ...(resolved.openGraph?.images ?? []).flatMap(imageMeta),

    ...(resolved.alternates?.alternates ?? []).map((alternate) =>
      createElement("link", {
        key: `alternate:${alternate.locale}`,
        rel: "alternate",
        hrefLang: alternate.locale,
        href: alternate.url,
      }),
    ),

    resolved.publishedTime
      ? property("article:published_time", resolved.publishedTime)
      : null,

    resolved.modifiedTime
      ? property("article:modified_time", resolved.modifiedTime)
      : null,
  ];

  return elements.filter(Boolean);
};

export interface SeoMetadataComponentProps extends SeoMetadataProps {
  children?: ReactNode;
}

export const SeoMetadata = ({
  metadata,
  children,
}: SeoMetadataComponentProps) => {
  const parent = useSeoReactContext();

  const resolvedMetadata = resolveSeoMetadata(metadata, parent.config);

  return createElement(
    SeoReactContext.Provider,
    {
      value: {
        config: parent.config,
        metadata: resolvedMetadata,
      },
    },
    createElement(
      Fragment,
      null,
      ...renderMetadata(resolvedMetadata, parent.config),
      children,
    ),
  );
};

export const SeoHead = () => {
  const { config, metadata } = useSeoReactContext();

  if (!metadata) {
    return null;
  }

  return createElement(Fragment, null, ...renderMetadata(metadata, config));
};
