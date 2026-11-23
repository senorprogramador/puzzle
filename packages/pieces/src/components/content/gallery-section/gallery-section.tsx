"use client";

import { Dialog } from "@puzzle-ui/ui";
import type { ElementType, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  EditorialImageView,
  validateContentIds,
} from "../shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type {
  GalleryItem,
  GallerySectionProps,
  GallerySectionVariant,
} from "./gallery-section.types";
import "./gallery-section.css";

const GallerySection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  lightbox,
  children,
  className,
  title,
  ...sectionProps
}: GallerySectionProps<C>) => {
  validateContentIds(items, "Gallery item");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeTrigger = useRef<HTMLButtonElement | null>(null);
  const restoreTriggerFocus = useRef(false);
  const lightboxEnabled = lightbox ?? variant === "fullscreen";
  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const selectedItem = items[selectedIndex];

  useEffect(() => {
    if (selectedId === null && restoreTriggerFocus.current) {
      restoreTriggerFocus.current = false;
      activeTrigger.current?.focus();
    }
  }, [selectedId]);

  const selectImage = (index: number) => {
    if (index >= 0 && index < items.length) {
      setSelectedId(items[index]!.id);
    }
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (selectedIndex < 0 || items.length < 2) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectImage(selectedIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectImage(selectedIndex - 1);
    }
  };

  const renderFigure = (item: GalleryItem, index: number) => {
    const caption = item.caption ?? item.image.caption;
    const label = item.image.alt || `Gallery image ${index + 1}`;
    const image = (
      <EditorialImageView
        image={item.image}
        loading={index === 0 ? "eager" : "lazy"}
      />
    );

    return (
      <figure
        className="puzzle-gallery-section__item"
        data-featured={item.featured || undefined}
      >
        {lightboxEnabled ? (
          <button
            type="button"
            className="puzzle-gallery-section__open"
            aria-label={`Open ${label} in lightbox`}
            onClick={(event) => {
              activeTrigger.current = event.currentTarget;
              restoreTriggerFocus.current = true;
              setSelectedId(item.id);
            }}
          >
            {image}
          </button>
        ) : item.href ? (
          <a href={item.href} aria-label={label}>
            {image}
          </a>
        ) : (
          image
        )}
        {caption ? (
          <figcaption className="puzzle-editorial-caption">
            {item.href && lightboxEnabled ? (
              <a href={item.href}>{caption}</a>
            ) : (
              caption
            )}
          </figcaption>
        ) : null}
      </figure>
    );
  };
  const renderItem = (item: GalleryItem, index: number) => (
    <li
      key={item.id}
      className="puzzle-gallery-section__item"
      data-featured={item.featured || undefined}
    >
      {renderFigure(item, index)}
    </li>
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-gallery-section ${className ?? ""}`.trim()}
      family="gallery"
      variant={variant satisfies GallerySectionVariant}
      title={title}
    >
      {items.length && variant === "carousel" ? (
        <PiecesCarousel
          itemKeys={items.map((item) => item.id)}
          slides={items.map((item, index) => (
            <div key={item.id}>{renderFigure(item, index)}</div>
          ))}
          ariaLabel="Gallery images"
          itemLabel="image"
          panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="var(--puzzle-space-4, 1rem)"
        />
      ) : items.length ? (
        <ul
          className="puzzle-gallery-section__items"
          aria-label="Gallery images"
          tabIndex={variant === "horizontal" ? 0 : undefined}
        >
          {items.map(renderItem)}
        </ul>
      ) : null}
      {selectedItem ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              restoreTriggerFocus.current = true;
              setSelectedId(null);
            }
          }}
          title={selectedItem.image.alt || `Image ${selectedIndex + 1}`}
          size="full"
          closeLabel="Close gallery image"
          footer={
            <div className="puzzle-gallery-section__dialog-controls">
              <button
                type="button"
                aria-label="Previous image"
                disabled={selectedIndex === 0}
                onClick={() => selectImage(selectedIndex - 1)}
              >
                Previous
              </button>
              <span>
                {selectedIndex + 1} of {items.length}
              </span>
              <button
                type="button"
                aria-label="Next image"
                disabled={selectedIndex === items.length - 1}
                onClick={() => selectImage(selectedIndex + 1)}
              >
                Next
              </button>
            </div>
          }
          onKeyDown={handleDialogKeyDown}
        >
          <figure className="puzzle-gallery-section__lightbox">
            <EditorialImageView
              image={selectedItem.image}
              loading="eager"
            />
            {selectedItem.caption ?? selectedItem.image.caption ? (
              <figcaption className="puzzle-editorial-caption">
                {selectedItem.caption ?? selectedItem.image.caption}
              </figcaption>
            ) : null}
          </figure>
        </Dialog>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { GallerySection };
