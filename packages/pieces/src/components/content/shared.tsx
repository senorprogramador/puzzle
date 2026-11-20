import type { ReactNode } from "react";
import { formatDate } from "@puzzle-ui/core";
import "./shared.css";

export type EditorialImage = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  caption?: ReactNode;
};

export type EditorialAuthor = {
  name: string;
  href?: string;
  image?: EditorialImage;
};

export const validateContentIds = (
  items: readonly { id: string }[],
  label: string,
) => {
  const ids = new Set<string>();

  for (const { id } of items) {
    if (!id.trim() || ids.has(id)) {
      throw new TypeError(`${label} IDs must be non-empty and unique.`);
    }

    ids.add(id);
  }
};

export const EditorialImageView = ({
  image,
  loading,
  className,
}: {
  image: EditorialImage;
  loading?: "eager" | "lazy";
  className?: string;
}) => {
  const src = image.src?.trim();

  return src ? (
    <img
      className={`puzzle-editorial-image ${className ?? ""}`.trim()}
      src={src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={image.loading ?? loading ?? "lazy"}
      decoding="async"
    />
  ) : (
    <span
      className={`puzzle-editorial-image-placeholder ${className ?? ""}`.trim()}
      role="img"
      aria-label={`${image.alt || "Editorial"} image unavailable`}
    >
      Image unavailable
    </span>
  );
};

export const EditorialFigure = ({
  image,
  className,
  loading,
}: {
  image: EditorialImage;
  className?: string;
  loading?: "eager" | "lazy";
}) => (
  <figure className={`puzzle-editorial-figure ${className ?? ""}`.trim()}>
    <EditorialImageView image={image} loading={loading} />
    {image.caption ? (
      <figcaption className="puzzle-editorial-caption">
        {image.caption}
      </figcaption>
    ) : null}
  </figure>
);

export const EditorialDate = ({ date }: { date: string }) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    throw new RangeError(`Invalid editorial date "${date}".`);
  }

  return (
    <time dateTime={value.toISOString()}>
      {formatDate(value, "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
};

export const EditorialCategory = ({ children }: { children: string }) => (
  <span className="puzzle-editorial-category">{children}</span>
);

export const EditorialAuthorView = ({
  author,
}: {
  author: EditorialAuthor;
}) => (
  <span className="puzzle-editorial-author">
    {author.image?.src?.trim() ? (
      <EditorialImageView
        image={{ ...author.image, alt: "" }}
        className="puzzle-editorial-author__image"
      />
    ) : null}
    {author.href ? <a href={author.href}>{author.name}</a> : author.name}
  </span>
);
