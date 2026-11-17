"use client";

import { Dialog, Tabs } from "@puzzle-ui/ui";
import type { ElementType, KeyboardEvent } from "react";
import { useState } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { CommerceImageView } from "../commerce-image";
import type {
  ProductGalleryImage,
  ProductGallerySectionProps,
  ProductGalleryVariant,
} from "./product-gallery.types";
import "./product-gallery.css";

const validateGallery = (
  images: readonly ProductGalleryImage[],
  initialImageId?: string,
) => {
  const ids = new Set<string>();

  images.forEach(({ id }) => {
    if (!id.trim() || ids.has(id)) {
      throw new TypeError("Product gallery image IDs must be non-empty and unique.");
    }

    ids.add(id);
  });

  if (
    initialImageId !== undefined &&
    !images.some((image) => image.id === initialImageId)
  ) {
    throw new RangeError(`Unknown initial product gallery image "${initialImageId}".`);
  }
};

const ProductGallerySection = <C extends ElementType = "section">({
  variant = "grid",
  images,
  initialImageId,
  lightbox,
  zoom = false,
  children,
  className,
  ...sectionProps
}: ProductGallerySectionProps<C>) => {
  validateGallery(images, initialImageId);

  const initialIndex = Math.max(
    0,
    images.findIndex((image) => image.id === initialImageId),
  );
  const [requestedIndex, setRequestedIndex] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const selectedIndex = Math.min(requestedIndex, images.length - 1);
  const selectedImage = images[selectedIndex];
  const lightboxEnabled = lightbox ?? variant === "fullscreen";

  const selectImage = (index: number) => {
    setRequestedIndex(Math.max(0, Math.min(index, images.length - 1)));
    setZoomed(false);
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (images.length < 2) {
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

  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (variant !== "thumbnails") {
      handleDialogKeyDown(event);
    }
  };

  const renderMainImage = (image: ProductGalleryImage, index: number) => (
    <figure
      className="puzzle-product-gallery__main"
      data-zoomed={zoomed || undefined}
    >
      <CommerceImageView
        image={image}
        label={image.alt || `Product image ${index + 1}`}
        loading="eager"
      />
      {image.caption ? (
        <figcaption className="puzzle-product-gallery__caption">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );

  const renderActions = (image: ProductGalleryImage, index: number) =>
    zoom || lightboxEnabled ? (
      <div className="puzzle-product-gallery__actions">
        {zoom ? (
          <button
            type="button"
            aria-pressed={zoomed}
            aria-label={zoomed ? "Reset image zoom" : "Zoom image"}
            onClick={() => setZoomed((value) => !value)}
          >
            {zoomed ? "Reset zoom" : "Zoom"}
          </button>
        ) : null}
        {lightboxEnabled ? (
          <button
            type="button"
            aria-label={`Open ${image.alt || `image ${index + 1}`} in lightbox`}
            onClick={() => setLightboxOpen(true)}
          >
            View larger
          </button>
        ) : null}
      </div>
    ) : null;

  const renderImageButtons = (
    buttonClassName = "puzzle-product-gallery__thumbnail",
  ) => (
    <ul className="puzzle-product-gallery__thumbnails">
      {images.map((image, index) => (
        <li key={image.id}>
          <button
            type="button"
            className={buttonClassName}
            aria-label={`View ${image.alt || `image ${index + 1}`}`}
            aria-pressed={selectedIndex === index}
            onClick={() => {
              selectImage(index);
              if (lightboxEnabled) {
                setLightboxOpen(true);
              }
            }}
          >
            <CommerceImageView
              image={image}
              label={image.alt || `Product image ${index + 1}`}
              loading="lazy"
            />
          </button>
        </li>
      ))}
    </ul>
  );

  const renderDialogControls = () => (
    <div className="puzzle-product-gallery__dialog-controls">
      <button
        type="button"
        aria-label="Previous image"
        disabled={selectedIndex === 0}
        onClick={() => selectImage(selectedIndex - 1)}
      >
        Previous
      </button>
      <span>
        {selectedIndex + 1} of {images.length}
      </span>
      <button
        type="button"
        aria-label="Next image"
        disabled={selectedIndex === images.length - 1}
        onClick={() => selectImage(selectedIndex + 1)}
      >
        Next
      </button>
    </div>
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-product-gallery ${className ?? ""}`.trim()}
      family="product-gallery"
      variant={variant}
    >
      {selectedImage ? (
        <div
          className="puzzle-product-gallery__layout"
          role="region"
          aria-label="Product gallery"
          tabIndex={variant === "thumbnails" ? undefined : 0}
          onKeyDown={handleGalleryKeyDown}
        >
          {variant === "thumbnails" ? (
            <Tabs
              className="puzzle-product-gallery__tabs"
              activeId={selectedImage.id}
              onActivate={(id) =>
                selectImage(images.findIndex((image) => image.id === id))
              }
            >
              {images.map((image, index) => (
                <Tabs.Tab
                  key={image.id}
                  id={image.id}
                  tab={
                    <span className="puzzle-product-gallery__tab">
                      <CommerceImageView
                        image={{ ...image, alt: "" }}
                        label={`Product image ${index + 1}`}
                        loading="lazy"
                      />
                      <span className="puzzle-product-gallery__visually-hidden">
                        {image.alt || `Image ${index + 1}`}
                      </span>
                    </span>
                  }
                >
                  {renderMainImage(image, index)}
                  {renderActions(image, index)}
                </Tabs.Tab>
              ))}
            </Tabs>
          ) : ["grid", "masonry", "stacked", "collage"].includes(variant) ? (
            renderImageButtons()
          ) : (
            <>
              <div className="puzzle-product-gallery__viewer">
                {renderMainImage(selectedImage, selectedIndex)}
                {renderActions(selectedImage, selectedIndex)}
              </div>
              {variant === "carousel" ? (
                <div className="puzzle-product-gallery__controls">
                  <button
                    type="button"
                    aria-label="Previous image"
                    disabled={selectedIndex === 0}
                    onClick={() => selectImage(selectedIndex - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    {selectedIndex + 1} of {images.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Next image"
                    disabled={selectedIndex === images.length - 1}
                    onClick={() => selectImage(selectedIndex + 1)}
                  >
                    Next
                  </button>
                </div>
              ) : null}
              {variant !== "fullscreen" ? renderImageButtons() : null}
            </>
          )}
        </div>
      ) : null}
      {lightboxEnabled && selectedImage ? (
        <Dialog
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          title={
            selectedImage.caption ||
            selectedImage.alt ||
            `Product image ${selectedIndex + 1}`
          }
          size="full"
          closeLabel="Close product image"
          footer={renderDialogControls()}
          onKeyDown={handleDialogKeyDown}
        >
          <CommerceImageView
            image={selectedImage}
            label={selectedImage.alt || `Product image ${selectedIndex + 1}`}
            loading="eager"
            className="puzzle-product-gallery__lightbox-image"
          />
        </Dialog>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { ProductGallerySection };
