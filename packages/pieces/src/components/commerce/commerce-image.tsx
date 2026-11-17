"use client";

import { cn } from "@puzzle-ui/core";
import { useState } from "react";
import type { CommerceImage } from "./shared.types";
import "./shared.css";

const CommerceImageView = ({
  image,
  label,
  loading = "lazy",
  className,
}: {
  image?: CommerceImage;
  label: string;
  loading?: "eager" | "lazy";
  className?: string;
}) => {
  const src = image?.src.trim();
  const [failedSource, setFailedSource] = useState<string>();

  if (!image || !src || failedSource === src) {
    return (
      <div className={cn("puzzle-commerce__image", className)}>
        <span
          className="puzzle-commerce__image-placeholder"
          role="img"
          aria-label={`${label} image unavailable`}
        >
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={cn("puzzle-commerce__image", className)}>
      <img
        src={src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={image.loading ?? loading}
        decoding="async"
        onError={() => setFailedSource(src)}
      />
    </div>
  );
};

export { CommerceImageView };
