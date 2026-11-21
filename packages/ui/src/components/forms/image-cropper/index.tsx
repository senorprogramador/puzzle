"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { cn } from "@puzzle-ui/core";

import { clamp, normalizeRect } from "../image-editor.utils";

import {
  createCropAtZoom,
  getBaseCrop,
  getNormalizedZoom,
  moveCrop,
  resizeAroundCenter,
  resizeFixedCrop,
  resizeFreeCrop,
} from "./image-cropper.utils";
import type {
  ImageCrop,
  ImageCropAspectRatio,
  ImageCropAspectRatioPreset,
  ImageCropperProps,
} from "./image-cropper.types";

import "./image-cropper.css";

const DEFAULT_PRESETS: readonly ImageCropAspectRatioPreset[] = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "Free", value: "free" },
];

type ImageSize = {
  width: number;
  height: number;
};

type CropInteraction = {
  type: "move" | "resize";
  clientX: number;
  clientY: number;
  crop: ImageCrop;
  bounds: Pick<DOMRect, "width" | "height">;
};

const resolveAspectRatio = (
  value: ImageCropAspectRatio | undefined,
): ImageCropAspectRatio =>
  value === "free" || (Number.isFinite(value) && Number(value) > 0)
    ? value!
    : 1;

const ImageCropper = ({
  src,
  alt,
  label = "Image cropper",
  value,
  defaultValue,
  onChange,
  aspectRatio,
  aspectRatioPresets = DEFAULT_PRESETS,
  onAspectRatioChange,
  maxZoom = 3,
  disabled = false,
  className,
  style,
  id,
  ref,
  ...rootProps
}: ImageCropperProps) => {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const stageRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<CropInteraction | null>(null);

  const [loadedImage, setLoadedImage] = useState<
    (ImageSize & { src: string }) | undefined
  >();
  const [internalAspectRatio, setInternalAspectRatio] =
    useState<ImageCropAspectRatio>(() =>
      resolveAspectRatio(aspectRatio ?? aspectRatioPresets[0]?.value),
    );
  const [freeZoom, setFreeZoom] = useState(1);
  const [internalCrop, setInternalCrop] = useState<ImageCrop>(() =>
    normalizeRect(
      defaultValue ??
        getBaseCrop(
          undefined,
          resolveAspectRatio(aspectRatio ?? aspectRatioPresets[0]?.value),
        ),
    ),
  );

  const activeAspectRatio = resolveAspectRatio(
    aspectRatio === undefined ? internalAspectRatio : aspectRatio,
  );
  const dimensions =
    loadedImage?.src === src ? loadedImage : undefined;
  const resolvedMaxZoom =
    Number.isFinite(maxZoom) && maxZoom >= 1 ? maxZoom : 3;
  const currentCrop = normalizeRect(value ?? internalCrop);
  const baseCrop = getBaseCrop(dimensions, activeAspectRatio);
  const zoom =
    activeAspectRatio === "free"
      ? freeZoom
      : Math.min(resolvedMaxZoom, getNormalizedZoom(currentCrop, baseCrop));

  const updateCrop = (nextCrop: ImageCrop) => {
    const normalizedCrop = normalizeRect(nextCrop);

    if (value === undefined) {
      setInternalCrop(normalizedCrop);
    }

    onChange?.(normalizedCrop);
  };

  const setPreset = (nextAspectRatio: ImageCropAspectRatio) => {
    const resolvedRatio = resolveAspectRatio(nextAspectRatio);

    if (aspectRatio === undefined) {
      setInternalAspectRatio(resolvedRatio);
    }

    setFreeZoom(1);
    onAspectRatioChange?.(resolvedRatio);

    const nextBaseCrop = getBaseCrop(dimensions, resolvedRatio);
    updateCrop(
      normalizeRect({
        ...nextBaseCrop,
        x:
          currentCrop.x +
          currentCrop.width / 2 -
          nextBaseCrop.width / 2,
        y:
          currentCrop.y +
          currentCrop.height / 2 -
          nextBaseCrop.height / 2,
      }),
    );
  };

  const getStageBounds = () => stageRef.current?.getBoundingClientRect();

  const beginInteraction = (
    event: PointerEvent<HTMLElement>,
    type: CropInteraction["type"],
  ) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    if (typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // A synthetic or already-cancelled pointer may not be capturable.
      }
    }

    const bounds = getStageBounds();

    if (!bounds) return;

    interactionRef.current = {
      type,
      clientX: event.clientX,
      clientY: event.clientY,
      crop: currentCrop,
      bounds,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;

    if (!interaction || disabled) return;

    const dx = event.clientX - interaction.clientX;
    const dy = event.clientY - interaction.clientY;

    if (interaction.type === "move") {
      updateCrop(
        moveCrop(
          interaction.crop,
          dx / Math.max(1, interaction.bounds.width),
          dy / Math.max(1, interaction.bounds.height),
        ),
      );
      return;
    }

    updateCrop(
      activeAspectRatio === "free"
        ? resizeFreeCrop(
            interaction.crop,
            dx,
            dy,
            interaction.bounds as Pick<DOMRect, "width" | "height">,
          )
        : resizeFixedCrop(
            interaction.crop,
            dx,
            interaction.bounds,
            activeAspectRatio,
          ),
    );
  };

  const endInteraction = () => {
    interactionRef.current = null;
  };

  const handleCropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const directions: Record<string, [number, number]> = {
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
    };
    const direction = directions[event.key];

    if (!direction) return;
    event.preventDefault();

    const amount = event.altKey ? 0.1 : 0.01;

    if (!event.shiftKey) {
      updateCrop(
        moveCrop(
          currentCrop,
          direction[0] * amount,
          direction[1] * amount,
        ),
      );
      return;
    }

    const bounds = getStageBounds() ?? {
      width: 1,
      height: 1,
    };
    const delta = direction[0] || direction[1];

    updateCrop(
      activeAspectRatio === "free"
        ? normalizeRect({
            ...currentCrop,
            width: clamp(
              currentCrop.width + delta * amount,
              0.01,
              1 - currentCrop.x,
            ),
            height: clamp(
              currentCrop.height + delta * amount,
              0.01,
              1 - currentCrop.y,
            ),
          })
        : resizeFixedCrop(
            currentCrop,
            delta * amount * Math.max(1, bounds.width),
            bounds,
            activeAspectRatio,
          ),
    );
  };

  const handleZoomChange = (nextZoom: number) => {
    const safeZoom = clamp(nextZoom, 1, resolvedMaxZoom);

    if (activeAspectRatio === "free") {
      const zoomRatio = freeZoom / safeZoom;
      updateCrop(
        resizeAroundCenter(
          currentCrop,
          currentCrop.width * zoomRatio,
          currentCrop.height * zoomRatio,
        ),
      );
      setFreeZoom(safeZoom);
      return;
    }

    updateCrop(createCropAtZoom(currentCrop, dimensions, activeAspectRatio, safeZoom));
  };

  const reset = () => {
    setFreeZoom(1);
    updateCrop(getBaseCrop(dimensions, activeAspectRatio));
  };

  const cropStyle: CSSProperties = {
    insetInlineStart: `${currentCrop.x * 100}%`,
    insetBlockStart: `${currentCrop.y * 100}%`,
    width: `${currentCrop.width * 100}%`,
    height: `${currentCrop.height * 100}%`,
  };

  return (
    <div
      {...rootProps}
      ref={ref}
      id={rootId}
      className={cn("puzzle-image-cropper", className)}
      style={style}
      role="group"
      aria-label={label}
      data-disabled={disabled || undefined}
    >
      <div className="puzzle-image-cropper__presets" role="group" aria-label="Crop aspect ratio">
        {aspectRatioPresets.map((preset) => {
          const isSelected =
            activeAspectRatio === resolveAspectRatio(preset.value);

          return (
            <button
              key={`${preset.label}-${preset.value}`}
              type="button"
              className="puzzle-image-cropper__preset"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => setPreset(preset.value)}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div
        ref={stageRef}
        className="puzzle-image-cropper__stage"
        onPointerMove={handlePointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
      >
        <img
          className="puzzle-image-cropper__image"
          src={src}
          alt={alt}
          draggable={false}
          onLoad={(event) => {
            const image = event.currentTarget;
            const nextDimensions = {
              width: image.naturalWidth,
              height: image.naturalHeight,
            };

            if (nextDimensions.width > 0 && nextDimensions.height > 0) {
              setLoadedImage({ ...nextDimensions, src });

              if (value === undefined && defaultValue === undefined) {
                setInternalCrop(
                  getBaseCrop(nextDimensions, activeAspectRatio),
                );
              }
            }
          }}
        />
        <div className="puzzle-image-cropper__overlay" aria-hidden="true" />
        <div
          className="puzzle-image-cropper__selection"
          style={cropStyle}
          role="group"
          aria-label="Crop selection"
          aria-roledescription="crop area"
          aria-describedby={`${rootId}-help`}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          onPointerDown={(event) => beginInteraction(event, "move")}
          onPointerUp={endInteraction}
          onPointerCancel={endInteraction}
          onKeyDown={handleCropKeyDown}
        >
          <span className="puzzle-image-cropper__grid" aria-hidden="true" />
          <button
            type="button"
            className="puzzle-image-cropper__resize"
            aria-label="Resize crop"
            disabled={disabled}
            onPointerDown={(event) => beginInteraction(event, "resize")}
          />
        </div>
      </div>

      <div className="puzzle-image-cropper__controls">
        <label className="puzzle-image-cropper__zoom">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={resolvedMaxZoom}
            step={0.1}
            value={zoom}
            disabled={disabled}
            aria-label="Zoom crop"
            onChange={(event) =>
              handleZoomChange(event.currentTarget.valueAsNumber)
            }
          />
          <output>{zoom.toFixed(1)}×</output>
        </label>
        <button
          type="button"
          className="puzzle-image-cropper__reset"
          disabled={disabled}
          onClick={reset}
        >
          Reset crop
        </button>
      </div>
      <p className="puzzle-image-cropper__help" id={`${rootId}-help`}>
        Drag the crop to move it. Use arrow keys to move; Shift+arrow keys to
        resize.
      </p>
    </div>
  );
};

export {
  ImageCropper,
  type ImageCrop,
  type ImageCropAspectRatio,
  type ImageCropAspectRatioPreset,
  type ImageCropperProps,
};
