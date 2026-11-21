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

import {
  clamp,
  normalizePoint,
  normalizeRect,
  toNormalizedPoint,
} from "../image-editor.utils";
import type {
  NormalizedImagePoint,
  NormalizedImageRect,
} from "../image-editor.types";
import type {
  ImageHotspot,
  ImageHotspotEditorProps,
  ImageHotspotEditorValue,
} from "./image-hotspot-editor.types";

import "./image-hotspot-editor.css";

type EditMode = "focal" | "point" | "area";

type PointInteraction = {
  type: "focal" | "hotspot";
  hotspotId?: string;
  clientX: number;
  clientY: number;
  point: NormalizedImagePoint;
  rect?: NormalizedImageRect;
  bounds: Pick<DOMRect, "left" | "top" | "width" | "height">;
};

type AreaDrawing = {
  start: NormalizedImagePoint;
  current: NormalizedImagePoint;
  bounds: Pick<DOMRect, "left" | "top" | "width" | "height">;
};

const normalizeHotspot = (hotspot: ImageHotspot): ImageHotspot => ({
  ...normalizeRect(hotspot),
  id: hotspot.id,
  ...(hotspot.label !== undefined ? { label: hotspot.label } : {}),
  ...(hotspot.data !== undefined ? { data: hotspot.data } : {}),
});

const normalizeEditorValue = (
  value: ImageHotspotEditorValue | undefined,
): ImageHotspotEditorValue => ({
  focalPoint: value?.focalPoint ? normalizePoint(value.focalPoint) : null,
  hotspots: (value?.hotspots ?? []).map(normalizeHotspot),
});

const moveRect = (
  rect: NormalizedImageRect,
  dx: number,
  dy: number,
): NormalizedImageRect =>
  normalizeRect({
    ...rect,
    x: clamp(rect.x + dx, 0, 1 - rect.width),
    y: clamp(rect.y + dy, 0, 1 - rect.height),
  });

const formatPosition = (value: number) => value.toFixed(2);

const ImageHotspotEditor = ({
  src,
  alt,
  label = "Image hotspot editor",
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  style,
  id,
  ref,
  ...rootProps
}: ImageHotspotEditorProps) => {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const stageRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<PointInteraction | null>(null);
  const areaRef = useRef<AreaDrawing | null>(null);
  const hotspotNumberRef = useRef(0);

  const [internalValue, setInternalValue] = useState(() =>
    normalizeEditorValue(defaultValue),
  );
  const [mode, setMode] = useState<EditMode>("focal");
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>();
  const [drawing, setDrawing] = useState<AreaDrawing>();
  const currentValue = normalizeEditorValue(value ?? internalValue);
  const activeHotspotId =
    selectedHotspotId ?? currentValue.hotspots[0]?.id;
  const selectedHotspot = currentValue.hotspots.find(
    (hotspot) => hotspot.id === activeHotspotId,
  );

  const commitValue = (nextValue: ImageHotspotEditorValue) => {
    const normalizedValue = normalizeEditorValue(nextValue);

    if (value === undefined) {
      setInternalValue(normalizedValue);
    }

    onChange?.(normalizedValue);
  };

  const updateHotspot = (
    hotspotId: string,
    update: Partial<ImageHotspot>,
  ) => {
    commitValue({
      ...currentValue,
      hotspots: currentValue.hotspots.map((hotspot) =>
        hotspot.id === hotspotId
          ? normalizeHotspot({ ...hotspot, ...update })
          : hotspot,
      ),
    });
  };

  const createHotspot = (
    rect: NormalizedImageRect,
    labelText?: string,
  ) => {
    const nextNumber = ++hotspotNumberRef.current;
    const hotspot: ImageHotspot = {
      ...normalizeRect(rect),
      id: `${rootId}-hotspot-${nextNumber}`,
      label: labelText ?? `Hotspot ${currentValue.hotspots.length + 1}`,
    };

    commitValue({
      ...currentValue,
      hotspots: [...currentValue.hotspots, hotspot],
    });
    setSelectedHotspotId(hotspot.id);
  };

  const getStageBounds = () => stageRef.current?.getBoundingClientRect();

  const beginPointInteraction = (
    event: PointerEvent<HTMLButtonElement>,
    interaction: Omit<PointInteraction, "clientX" | "clientY" | "bounds">,
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
      ...interaction,
      clientX: event.clientX,
      clientY: event.clientY,
      bounds,
    };
  };

  const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      disabled ||
      (mode !== "focal" && mode !== "point" && mode !== "area")
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const point = toNormalizedPoint(event.clientX, event.clientY, bounds);

    if (mode === "focal") {
      commitValue({ ...currentValue, focalPoint: point });
      return;
    }

    if (mode === "point") {
      createHotspot({ ...point, width: 0, height: 0 });
      return;
    }

    event.preventDefault();
    if (typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // A synthetic or already-cancelled pointer may not be capturable.
      }
    }

    const nextDrawing = { start: point, current: point, bounds };
    areaRef.current = nextDrawing;
    setDrawing(nextDrawing);
  };

  const handleStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || (event.key !== "Enter" && event.key !== " ")) return;

    event.preventDefault();

    if (mode === "focal") {
      commitValue({
        ...currentValue,
        focalPoint: { x: 0.5, y: 0.5 },
      });
    } else if (mode === "point") {
      createHotspot({ x: 0.5, y: 0.5, width: 0, height: 0 });
    } else {
      createHotspot({ x: 0.45, y: 0.45, width: 0.1, height: 0.1 });
    }
  };

  const handleStagePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;

    if (interaction) {
      const dx =
        (event.clientX - interaction.clientX) /
        Math.max(1, interaction.bounds.width);
      const dy =
        (event.clientY - interaction.clientY) /
        Math.max(1, interaction.bounds.height);

      if (interaction.type === "focal") {
        commitValue({
          ...currentValue,
          focalPoint: normalizePoint({
            x: interaction.point.x + dx,
            y: interaction.point.y + dy,
          }),
        });
      } else if (interaction.hotspotId && interaction.rect) {
        updateHotspot(
          interaction.hotspotId,
          moveRect(interaction.rect, dx, dy),
        );
      }

      return;
    }

    const activeDrawing = areaRef.current;
    if (!activeDrawing) return;

    const currentPoint = toNormalizedPoint(
      event.clientX,
      event.clientY,
      activeDrawing.bounds,
    );
    const nextDrawing = { ...activeDrawing, current: currentPoint };

    areaRef.current = nextDrawing;
    setDrawing(nextDrawing);
  };

  const finishInteraction = () => {
    interactionRef.current = null;

    const completedDrawing = areaRef.current;
    areaRef.current = null;
    setDrawing(undefined);

    if (!completedDrawing) return;

    const { start, current } = completedDrawing;
    const rect = normalizeRect({
      x: Math.min(start.x, current.x),
      y: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y),
    });

    if (rect.width >= 0.01 && rect.height >= 0.01) {
      createHotspot(rect);
    }
  };

  const setExactPosition = (
    field: "x" | "y" | "width" | "height",
    rawValue: string,
  ) => {
    if (!selectedHotspot || rawValue === "") return;

    updateHotspot(selectedHotspot.id, {
      [field]: Number(rawValue),
    });
  };

  const setExactFocalPoint = (
    field: keyof NormalizedImagePoint,
    rawValue: string,
  ) => {
    if (!currentValue.focalPoint || rawValue === "") return;

    commitValue({
      ...currentValue,
      focalPoint: normalizePoint({
        ...currentValue.focalPoint,
        [field]: Number(rawValue),
      }),
    });
  };

  const handleMarkerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    hotspot: ImageHotspot,
  ) => {
    const direction: Record<string, [number, number]> = {
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
    };
    const delta = direction[event.key];

    if (!delta || disabled) return;
    event.preventDefault();

    const amount = event.altKey ? 0.1 : 0.01;
    updateHotspot(
      hotspot.id,
      moveRect(hotspot, delta[0] * amount, delta[1] * amount),
    );
  };

  const handleFocalKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const direction: Record<string, [number, number]> = {
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
    };
    const delta = direction[event.key];

    if (!delta || disabled || !currentValue.focalPoint) return;
    event.preventDefault();

    const amount = event.altKey ? 0.1 : 0.01;
    commitValue({
      ...currentValue,
      focalPoint: normalizePoint({
        x: currentValue.focalPoint.x + delta[0] * amount,
        y: currentValue.focalPoint.y + delta[1] * amount,
      }),
    });
  };

  const renderPointMarker = (
    point: NormalizedImagePoint,
    classNameForMarker: string,
    markerLabel: string,
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void,
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void,
    pressed?: boolean,
  ) => {
    const markerStyle: CSSProperties = {
      insetInlineStart: `${point.x * 100}%`,
      insetBlockStart: `${point.y * 100}%`,
    };

    return (
      <button
        type="button"
        className={classNameForMarker}
        style={markerStyle}
        aria-label={markerLabel}
        aria-pressed={pressed}
        disabled={disabled}
        onPointerDown={onPointerDown}
        onPointerUp={finishInteraction}
        onPointerCancel={finishInteraction}
        onKeyDown={onKeyDown}
      />
    );
  };

  const drawingRect = drawing
    ? normalizeRect({
        x: Math.min(drawing.start.x, drawing.current.x),
        y: Math.min(drawing.start.y, drawing.current.y),
        width: Math.abs(drawing.current.x - drawing.start.x),
        height: Math.abs(drawing.current.y - drawing.start.y),
      })
    : undefined;

  const drawingStyle: CSSProperties | undefined = drawingRect
    ? {
        insetInlineStart: `${drawingRect.x * 100}%`,
        insetBlockStart: `${drawingRect.y * 100}%`,
        width: `${drawingRect.width * 100}%`,
        height: `${drawingRect.height * 100}%`,
      }
    : undefined;

  return (
    <div
      {...rootProps}
      ref={ref}
      id={rootId}
      className={cn("puzzle-image-hotspot-editor", className)}
      style={style}
      role="group"
      aria-label={label}
      data-disabled={disabled || undefined}
    >
      <div className="puzzle-image-hotspot-editor__tools" role="group" aria-label="Editing mode">
        <button
          type="button"
          className="puzzle-image-hotspot-editor__tool"
          aria-pressed={mode === "focal"}
          disabled={disabled}
          onClick={() => setMode("focal")}
        >
          Set focal point
        </button>
        <button
          type="button"
          className="puzzle-image-hotspot-editor__tool"
          aria-pressed={mode === "point"}
          disabled={disabled}
          onClick={() => setMode("point")}
        >
          Add hotspot point
        </button>
        <button
          type="button"
          className="puzzle-image-hotspot-editor__tool"
          aria-pressed={mode === "area"}
          disabled={disabled}
          onClick={() => setMode("area")}
        >
          Draw hotspot area
        </button>
      </div>

      <div
        ref={stageRef}
        className="puzzle-image-hotspot-editor__stage"
        role="group"
        aria-label={`${label} image canvas`}
        aria-describedby={`${rootId}-help`}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={finishInteraction}
        onPointerCancel={finishInteraction}
        onKeyDown={handleStageKeyDown}
      >
        <img
          className="puzzle-image-hotspot-editor__image"
          src={src}
          alt={alt}
          draggable={false}
        />
        {currentValue.hotspots.map((hotspot, index) => {
          const isPoint = hotspot.width === 0 && hotspot.height === 0;
          const markerStyle: CSSProperties = {
            insetInlineStart: `${hotspot.x * 100}%`,
            insetBlockStart: `${hotspot.y * 100}%`,
            width: isPoint ? undefined : `${hotspot.width * 100}%`,
            height: isPoint ? undefined : `${hotspot.height * 100}%`,
          };

          return (
            <button
              key={hotspot.id}
              type="button"
              className="puzzle-image-hotspot-editor__hotspot"
              style={markerStyle}
              data-kind={isPoint ? "point" : "area"}
              aria-label={
                hotspot.label || `Hotspot ${index + 1} at ${formatPosition(hotspot.x)}, ${formatPosition(hotspot.y)}`
              }
              aria-pressed={activeHotspotId === hotspot.id}
              disabled={disabled}
              onPointerDown={(event) => {
                beginPointInteraction(event, {
                  type: "hotspot",
                  hotspotId: hotspot.id,
                  point: { x: hotspot.x, y: hotspot.y },
                  rect: hotspot,
                });
                setSelectedHotspotId(hotspot.id);
              }}
              onPointerUp={finishInteraction}
              onPointerCancel={finishInteraction}
              onKeyDown={(event) => handleMarkerKeyDown(event, hotspot)}
              onClick={() => setSelectedHotspotId(hotspot.id)}
            >
              {hotspot.label ? (
                <span className="puzzle-image-hotspot-editor__label">
                  {hotspot.label}
                </span>
              ) : null}
            </button>
          );
        })}
        {currentValue.focalPoint
          ? renderPointMarker(
              currentValue.focalPoint,
              "puzzle-image-hotspot-editor__focal",
              `Focal point at ${formatPosition(currentValue.focalPoint.x)}, ${formatPosition(currentValue.focalPoint.y)}`,
              (event) =>
                beginPointInteraction(event, {
                  type: "focal",
                  point: currentValue.focalPoint!,
                }),
              handleFocalKeyDown,
            )
          : null}
        {drawingStyle ? (
          <div
            className="puzzle-image-hotspot-editor__drawing"
            style={drawingStyle}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <p className="puzzle-image-hotspot-editor__help" id={`${rootId}-help`}>
        {mode === "focal"
          ? "Select the image to place the focal point. Drag it or use arrow keys to adjust its position."
          : mode === "point"
            ? "Select the image to add a hotspot point."
            : "Drag on the image to draw a hotspot area."}
      </p>

      {currentValue.hotspots.length > 0 ? (
        <div className="puzzle-image-hotspot-editor__list">
          <span className="puzzle-image-hotspot-editor__list-label">
            Hotspots
          </span>
          <ul
            className="puzzle-image-hotspot-editor__hotspot-list"
            aria-label="Hotspots"
          >
            {currentValue.hotspots.map((hotspot, index) => (
              <li key={hotspot.id}>
                <button
                  type="button"
                  className="puzzle-image-hotspot-editor__hotspot-select"
                  aria-label={`Select ${hotspot.label || `Hotspot ${index + 1}`}`}
                  aria-pressed={activeHotspotId === hotspot.id}
                  disabled={disabled}
                  onClick={() => setSelectedHotspotId(hotspot.id)}
                >
                  {hotspot.label || `Hotspot ${index + 1}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {selectedHotspot ? (
        <fieldset className="puzzle-image-hotspot-editor__details">
          <legend>{selectedHotspot.label || "Selected hotspot"}</legend>
          <label>
            <span>Label</span>
            <input
              type="text"
              value={selectedHotspot.label ?? ""}
              disabled={disabled}
              aria-label="Hotspot label"
              onChange={(event) =>
                updateHotspot(selectedHotspot.id, {
                  label: event.currentTarget.value,
                })
              }
            />
          </label>
          {(["x", "y", "width", "height"] as const).map((field) => (
            <label key={field}>
              <span>{field === "x" ? "X" : field === "y" ? "Y" : field}</span>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={selectedHotspot[field]}
                disabled={disabled}
                aria-label={`Hotspot ${field}`}
                onChange={(event) =>
                  setExactPosition(field, event.currentTarget.value)
                }
              />
            </label>
          ))}
          <button
            type="button"
            className="puzzle-image-hotspot-editor__delete"
            disabled={disabled}
            onClick={() => {
              commitValue({
                ...currentValue,
                hotspots: currentValue.hotspots.filter(
                  (hotspot) => hotspot.id !== selectedHotspot.id,
                ),
              });
              setSelectedHotspotId(undefined);
            }}
          >
            Delete selected hotspot
          </button>
        </fieldset>
      ) : null}

      {currentValue.focalPoint && mode === "focal" ? (
        <fieldset className="puzzle-image-hotspot-editor__details">
          <legend>Focal point position</legend>
          {(["x", "y"] as const).map((field) => (
            <label key={field}>
              <span>{field.toUpperCase()}</span>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={currentValue.focalPoint![field]}
                disabled={disabled}
                aria-label={`Focal point ${field}`}
                onChange={(event) =>
                  setExactFocalPoint(field, event.currentTarget.value)
                }
              />
            </label>
          ))}
          <button
            type="button"
            className="puzzle-image-hotspot-editor__delete"
            disabled={disabled}
            onClick={() =>
              commitValue({ ...currentValue, focalPoint: null })
            }
          >
            Clear focal point
          </button>
        </fieldset>
      ) : null}
    </div>
  );
};

export {
  ImageHotspotEditor,
  type ImageHotspot,
  type ImageHotspotEditorProps,
  type ImageHotspotEditorValue,
};
export type {
  ImageHotspotData,
  NormalizedImagePoint,
  NormalizedImageRect,
} from "../image-editor.types";
