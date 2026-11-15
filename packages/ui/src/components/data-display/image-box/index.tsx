"use client";

import { cn } from "@puzzle-ui/core";

import { Image } from "../image";
import { getImageBoxLayout } from "./image-box.utils";
import type {
  ImageBoxImage,
  ImageBoxProps,
  ImageBoxSupportingStyle,
  ImageBoxStyle,
} from "./image-box.types";

import "./image-box.css";

const toCssLength = (value: number | string, name: string) => {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be a finite non-negative number`);
    }

    return `${value}px`;
  }

  return value;
};

const ImageBox = ({
  images,
  aspectRatio = 2,
  gap,
  radius,
  className,
  onImageClick,
  onViewAll,
}: ImageBoxProps) => {
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    throw new RangeError("aspectRatio must be a positive finite number");
  }

  const layout = getImageBoxLayout(images.length);

  if (layout.type === "empty") {
    return null;
  }

  const style: ImageBoxStyle = {
    "--puzzle-image-box-aspect-ratio": String(aspectRatio),
    ...(gap !== undefined
      ? { "--puzzle-image-box-gap": toCssLength(gap, "gap") }
      : {}),
    ...(radius !== undefined
      ? { "--puzzle-image-box-radius": toCssLength(radius, "radius") }
      : {}),
  };

  const visibleImages = images.slice(0, layout.visibleCount);
  const supportingStyle: ImageBoxSupportingStyle = {
    "--puzzle-image-box-rows": layout.rows,
  };

  const renderTile = (image: ImageBoxImage, index: number, main = false) => {
    const media = (
      <Image
        src={image.src}
        alt={image.alt}
        title={image.title}
        fill
        fit="cover"
        loading={main ? "eager" : "lazy"}
        fetchPriority={main ? "high" : "auto"}
        decoding="async"
        preload={main}
        className="puzzle-image-box__media"
        fallback={<span className="puzzle-image-box__fallback" aria-hidden="true" />}
      />
    );

    return (
      <div
        key={`${index}-${image.src}`}
        className={cn(
          "puzzle-image-box__tile",
          main && "puzzle-image-box__main",
        )}
        data-image-index={index}
      >
        {onImageClick ? (
          <button
            type="button"
            className="puzzle-image-box__image-button"
            onClick={() => onImageClick(image, index)}
          >
            {media}
          </button>
        ) : (
          <div className="puzzle-image-box__image-static">{media}</div>
        )}

        {layout.overflowCount > 0 && index === 4 ? (
          onViewAll ? (
            <button
              type="button"
              className="puzzle-image-box__overflow puzzle-image-box__view-all"
              aria-label={`View all ${layout.totalCount} photos`}
              onClick={onViewAll}
            >
              <span className="puzzle-image-box__overflow-count">
                +{layout.overflowCount}
              </span>
              <span className="puzzle-image-box__view-all-label">
                View all photos
              </span>
            </button>
          ) : (
            <div className="puzzle-image-box__overflow" aria-hidden="true">
              <span className="puzzle-image-box__overflow-count">
                +{layout.overflowCount}
              </span>
            </div>
          )
        ) : null}

        {layout.type !== "single" &&
        layout.type !== "split" &&
        index === 0 ? (
          onViewAll ? (
            <button
              type="button"
              className="puzzle-image-box__view-all"
              aria-label={`View all ${layout.totalCount} photos`}
              onClick={onViewAll}
            >
              {layout.totalCount} photos
            </button>
          ) : (
            <span
              className="puzzle-image-box__view-all puzzle-image-box__view-all--static"
              aria-hidden="true"
            >
              {layout.totalCount} photos
            </span>
          )
        ) : null}
      </div>
    );
  };

  return (
    <div
      className={cn("puzzle-image-box", className)}
      style={style}
      data-layout={layout.type}
      role="group"
      aria-label={`Photo gallery with ${layout.totalCount} photos`}
    >
      {renderTile(visibleImages[0]!, 0, true)}

      {visibleImages.length > 1 ? (
        <div
          className="puzzle-image-box__supporting"
          style={supportingStyle}
        >
          {visibleImages.slice(1).map((image, index) =>
            renderTile(image, index + 1),
          )}
        </div>
      ) : null}
    </div>
  );
};

export { ImageBox, type ImageBoxProps, type ImageBoxImage };
