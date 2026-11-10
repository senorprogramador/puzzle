"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";

import { cn } from "@puzzle-ui/core";
import { Icon } from "@puzzle-ui/icons";

import type { RatingProps, RatingSize } from "./rating.types";

import {
  getNextRating,
  getRatingStarState,
  normalizeRating,
} from "./rating.utils";

import "./rating.css";

const ICONS = {
  full: "ph:star-fill",
  half: "ph:star-half-fill",
  empty: "ph:star",
} as const;

const SIZE_MAP = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

const Rating = ({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  precision = 0.5,
  size = "md",
  readOnly = false,
  disabled = false,
  color = "var(--puzzle-color-warning, #FABC0A)",
  emptyColor = "var(--puzzle-color-border)",
  className,
  style,
  "aria-label": ariaLabel = "Rating",
  onKeyDown,
  ...props
}: RatingProps) => {
  if (!Number.isInteger(max) || max < 1 || max > 10) {
    throw new Error("Rating max must be an integer between 1 and 10.");
  }

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(() =>
    normalizeRating(defaultValue, max, precision),
  );

  const currentValue = normalizeRating(
    isControlled ? value : internalValue,
    max,
    precision,
  );

  const commitValue = (nextValue: number) => {
    if (disabled || readOnly) {
      return;
    }

    const next = normalizeRating(nextValue, max, precision);

    if (next === currentValue) {
      return;
    }

    if (!isControlled) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const nextValue = getNextRating(currentValue, event.key, max, precision);

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    commitValue(nextValue);
  };

  const classes = cn(
    "puzzle-rating",
    disabled && "puzzle-rating-disabled",
    readOnly && "puzzle-rating-readonly",
    className,
  );

  return (
    <div
      {...props}
      className={classes}
      style={
        {
          ...style,
          "--puzzle-rating-color": color,
          "--puzzle-rating-empty-color": emptyColor,
        } as CSSProperties
      }
      role={readOnly ? "img" : "slider"}
      tabIndex={disabled || readOnly ? undefined : 0}
      aria-label={
        readOnly
          ? `${ariaLabel}: ${currentValue} out of ${max} stars`
          : ariaLabel
      }
      aria-valuemin={readOnly ? undefined : 0}
      aria-valuemax={readOnly ? undefined : max}
      aria-valuenow={readOnly ? undefined : currentValue}
      aria-valuetext={
        readOnly ? undefined : `${currentValue} out of ${max} stars`
      }
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onKeyDown={handleKeyDown}
      data-size={size}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {Array.from({ length: max }, (_, index) => {
        const state = getRatingStarState(currentValue, index);

        return (
          <span
            key={index}
            className="puzzle-rating__star"
            data-state={state}
            aria-hidden="true"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();

              const isHalf =
                precision === 0.5 && event.clientX < rect.left + rect.width / 2;

              commitValue(index + (isHalf ? 0.5 : 1));
            }}
          >
            <Icon
              name={ICONS[state]}
              size={SIZE_MAP[size]}
              aria-hidden="true"
              focusable="false"
            />
          </span>
        );
      })}
    </div>
  );
};

export { Rating, type RatingProps, type RatingSize };
