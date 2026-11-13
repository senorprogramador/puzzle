"use client";

import { createElement, Fragment } from "react";

import type { SeoPageMetadata, SeoSocialImage } from "../metadata/types";

import { resolveSeoMetadata, resolveSeoRobots } from "../metadata";

import type { SeoMetadataProps } from "./types";

import { useSeoReactContext } from "./context";

const meta = (name: string, content: string | undefined) => {
  if (!content) return null;

  return createElement("meta", {
    key: `${name}:${content}`,
    name,
    content,
  });
};

const property = (propertyName: string, content: string | undefined) => {
  if (!content) return null;

  return createElement("meta", {
    key: `${propertyName}:${content}`,
    property: propertyName,
    content,
  });
};

const imageMeta = (image: SeoSocialImage, index: number) =>
  [
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
  ].map((element, itemIndex) =>
    element
      ? createElement(Fragment, {
          key: `og-image:${index}:${itemIndex}`,
          children: element,
        })
      : null,
  );

const renderMetadata = (
  metadata: SeoPageMetadata,
  config: ReturnType<typeof useSeoReactContext>["config"],
) => {
  const resolved = resolveSeoMetadata(metadata, config);
  const robots = resolveSeoRobots(metadata, config);

  const elements = [
    createElement("title", {
      key: "title",
      children: resolved.title,
    }),
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
    property("twitter:card", resolved.twitter?.card),
    property("twitter:title", resolved.twitter?.title),
    property("twitter:description", resolved.twitter?.description),
    property("twitter:site", resolved.twitter?.site),
    property("twitter:creator", resolved.twitter?.creator),
    ...(resolved.twitter?.images ?? []).map((url, index) =>
      meta(`twitter:image${index ? `:${index}` : ""}`, url),
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

export const SeoMetadata = ({ metadata }: SeoMetadataProps) => {
  const { config } = useSeoReactContext();

  return createElement(Fragment, null, ...renderMetadata(metadata, config));
};

export const SeoHead = () => {
  const { config, metadata } = useSeoReactContext();

  if (!metadata) {
    return null;
  }

  return createElement(Fragment, null, ...renderMetadata(metadata, config));
};
