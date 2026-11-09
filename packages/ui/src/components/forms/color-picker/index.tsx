"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { clamp, cn, isColorDark } from "@puzzle-ui/core";

import { Popout } from "../../overlays/popout";

import {
  DEFAULT_HSV,
  hsvToFormat,
  parseColorToHsvInBrowser,
  resolveCssColor,
  type HSVColor,
} from "./color-picker.utils";

import type {
  ColorPickerFormat,
  ColorPickerProps,
  ColorPickerSwatch,
} from "./color-picker.types";

import "./color-picker.css";

const getSwatchValue = (swatch: ColorPickerSwatch): string =>
  typeof swatch === "string" ? swatch : swatch.value;

const getSwatchLabel = (swatch: ColorPickerSwatch): string =>
  typeof swatch === "string" ? swatch : (swatch.label ?? swatch.value);

const ColorPicker = (props: ColorPickerProps) => {
  const {
    value,
    defaultValue,
    onChange,
    label,
    description,
    placeholder = "Select color",
    colors = [],
    format = "hexa",
    clearable = true,
    clearLabel = "Clear color",
    open,
    defaultOpen = false,
    onOpenChange,
    position = "bottom",
    align = "start",
    disabled = false,
    className,
    style,
    rootClassName,
    popoverClassName,
    id,
    ref,
    ...triggerProps
  } = props;

  const generatedId = useId();

  const triggerId = id ?? generatedId;
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const panelId = `${generatedId}-panel`;
  const areaId = `${generatedId}-area`;

  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );

  const isControlled = Object.prototype.hasOwnProperty.call(props, "value");

  const selectedColor = isControlled ? value : internalValue;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const [hsv, setHsv] = useState<HSVColor>(
    () =>
      (selectedColor ? parseColorToHsvInBrowser(selectedColor) : null) ??
      DEFAULT_HSV,
  );

  const [inputValue, setInputValue] = useState(selectedColor ?? "");
  const [inputError, setInputError] = useState(false);

  const areaRef = useRef<HTMLDivElement>(null);

  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) setInternalOpen(nextOpen);

      onOpenChange?.(nextOpen);
    },
    [open, onOpenChange],
  );

  const commitColor = useCallback(
    (nextColor: string | undefined) => {
      if (!isControlled) {
        setInternalValue(nextColor);
      }

      onChange?.(nextColor);

      setInputValue(nextColor ?? "");
      setInputError(false);
    },
    [isControlled, onChange],
  );

  const updateHsv = useCallback(
    (next: HSVColor) => {
      const normalized: HSVColor = {
        h: ((next.h % 360) + 360) % 360,
        s: clamp(next.s, 0, 100),
        v: clamp(next.v, 0, 100),
        a: clamp(next.a, 0, 1),
      };

      setHsv(normalized);
      commitColor(hsvToFormat(normalized, format));
    },
    [commitColor, format],
  );

  useEffect(() => {
    if (!selectedColor) {
      setHsv(DEFAULT_HSV);
      return;
    }

    const parsed = parseColorToHsvInBrowser(selectedColor);

    if (parsed) setHsv(parsed);
  }, [selectedColor]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue(selectedColor ?? "");
      setInputError(false);
    }
  }, [isOpen, selectedColor]);

  const updateArea = (event: PointerEvent<HTMLDivElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;

    const rect = event.currentTarget.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    const saturation = clamp(
      ((event.clientX - rect.left) / rect.width) * 100,
      0,
      100,
    );

    const brightness = clamp(
      (1 - (event.clientY - rect.top) / rect.height) * 100,
      0,
      100,
    );

    updateHsv({
      ...hsv,
      s: saturation,
      v: brightness,
    });
  };

  const handleAreaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;

    let saturation = hsv.s;
    let brightness = hsv.v;

    switch (event.key) {
      case "ArrowLeft":
        saturation -= step;
        break;
      case "ArrowRight":
        saturation += step;
        break;
      case "ArrowUp":
        brightness += step;
        break;
      case "ArrowDown":
        brightness -= step;
        break;
      case "Home":
        saturation = 0;
        break;
      case "End":
        saturation = 100;
        break;
      default:
        return;
    }

    event.preventDefault();

    updateHsv({
      ...hsv,
      s: saturation,
      v: brightness,
    });
  };

  const selectSwatch = (color: string) => {
    commitColor(color);

    const parsed = parseColorToHsvInBrowser(color);

    if (parsed) setHsv(parsed);
  };

  const applyInput = () => {
    const color = inputValue.trim();

    const parsed = parseColorToHsvInBrowser(color);

    if (!parsed) {
      setInputError(true);
      return;
    }

    commitColor(color);
    setHsv(parsed);
  };

  const hueColor = `hsl(${hsv.h}, 100%, 50%)`;

  const colorAreaStyle = {
    "--puzzle-color-picker-hue": hueColor,
  } as CSSProperties;

  const currentColor = selectedColor
    ? (resolveCssColor(selectedColor) ?? selectedColor)
    : undefined;

  const triggerSwatchStyle = {
    background: currentColor,
  } as CSSProperties;

  const clearColor = () => {
    commitColor(undefined);
    setHsv(DEFAULT_HSV);
  };

  return (
    <div
      className={cn("puzzle-color-picker", rootClassName)}
      data-disabled={disabled || undefined}
    >
      {label && (
        <label
          id={labelId}
          className="puzzle-color-picker__label"
          htmlFor={triggerId}
        >
          {label}
        </label>
      )}

      <Popout
        position={position}
        align={align}
        action="click"
        open={isOpen}
        onOpenChange={changeOpen}
        closeOnOutsideClick
        closeOnEscape
        contentClassName={cn("puzzle-color-picker__popover", popoverClassName)}
        trigger={
          <button
            {...triggerProps}
            ref={ref}
            id={triggerId}
            type="button"
            className={cn("puzzle-color-picker__trigger", className)}
            style={style}
            disabled={disabled}
            aria-label={label ? undefined : "Choose color"}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
          >
            <span
              className="puzzle-color-picker__trigger-swatch"
              style={triggerSwatchStyle}
              aria-hidden="true"
            />

            <span className="puzzle-color-picker__trigger-value">
              {selectedColor ?? placeholder}
            </span>

            <span
              className="puzzle-color-picker__trigger-chevron"
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
        }
      >
        <div
          id={panelId}
          className="puzzle-color-picker__panel"
          role="dialog"
          aria-label={label ? `Choose ${label}` : "Choose color"}
        >
          <div
            ref={areaRef}
            id={areaId}
            className="puzzle-color-picker__area"
            style={colorAreaStyle}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateArea(event);
            }}
            onPointerMove={updateArea}
            onKeyDown={handleAreaKeyDown}
            role="group"
            aria-label="Color saturation and brightness"
            tabIndex={0}
          >
            <span
              className="puzzle-color-picker__area-saturation"
              aria-hidden="true"
            />

            <span
              className="puzzle-color-picker__area-brightness"
              aria-hidden="true"
            />

            <span
              className="puzzle-color-picker__area-indicator"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
              }}
              aria-hidden="true"
            />
          </div>

          <div className="puzzle-color-picker__sliders">
            <label className="puzzle-color-picker__slider-row">
              <span>Hue</span>

              <input
                type="range"
                min={0}
                max={359}
                value={Math.round(hsv.h)}
                aria-label="Hue"
                onChange={(event) =>
                  updateHsv({
                    ...hsv,
                    h: Number(event.currentTarget.value),
                  })
                }
                className="puzzle-color-picker__hue-slider"
              />
            </label>

            <label className="puzzle-color-picker__slider-row">
              <span>Opacity</span>

              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(hsv.a * 100)}
                aria-label="Opacity"
                onChange={(event) =>
                  updateHsv({
                    ...hsv,
                    a: Number(event.currentTarget.value) / 100,
                  })
                }
                className="puzzle-color-picker__opacity-slider"
                style={
                  {
                    "--puzzle-color-picker-hue": hueColor,
                  } as CSSProperties
                }
              />
            </label>
          </div>

          <div className="puzzle-color-picker__input-section">
            <label
              htmlFor={`${generatedId}-input`}
              className="puzzle-color-picker__input-label"
            >
              Color value
            </label>

            <div className="puzzle-color-picker__input-row">
              <input
                id={`${generatedId}-input`}
                type="text"
                value={inputValue}
                spellCheck={false}
                autoComplete="off"
                aria-label="Color value"
                aria-invalid={inputError || undefined}
                placeholder="#RRGGBB"
                onChange={(event) => {
                  setInputValue(event.currentTarget.value);
                  setInputError(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyInput();
                  }
                }}
              />

              <button
                type="button"
                className="puzzle-color-picker__apply"
                onClick={applyInput}
              >
                Apply
              </button>
            </div>

            {inputError && (
              <p className="puzzle-color-picker__error" role="alert">
                Enter a valid CSS color.
              </p>
            )}
          </div>

          {(clearable || colors.length > 0) && (
            <div className="puzzle-color-picker__swatches-section">
              <span className="puzzle-color-picker__section-label">
                Presets
              </span>

              <div
                className="puzzle-color-picker__swatches"
                role="group"
                aria-label="Preset colors"
              >
                {clearable && (
                  <button
                    type="button"
                    className="puzzle-color-picker__swatch puzzle-color-picker__clear"
                    aria-label={clearLabel}
                    aria-pressed={selectedColor === undefined}
                    title={clearLabel}
                    onClick={clearColor}
                  >
                    <span aria-hidden="true" />
                  </button>
                )}

                {colors.map((swatch, index) => {
                  const color = getSwatchValue(swatch);
                  const swatchLabel = getSwatchLabel(swatch);

                  return (
                    <button
                      key={`${color}-${index}`}
                      type="button"
                      className="puzzle-color-picker__swatch"
                      style={{
                        background: resolveCssColor(color) ?? color,
                      }}
                      aria-label={swatchLabel}
                      aria-pressed={selectedColor === color}
                      title={swatchLabel}
                      data-selected={selectedColor === color || undefined}
                      data-dark={isColorDark(color) || undefined}
                      onClick={() => selectSwatch(color)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Popout>

      {description && (
        <span id={descriptionId} className="puzzle-color-picker__description">
          {description}
        </span>
      )}
    </div>
  );
};

export {
  ColorPicker,
  type ColorPickerProps,
  type ColorPickerFormat,
  type ColorPickerSwatch,
};
