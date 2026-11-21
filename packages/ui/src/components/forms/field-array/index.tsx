"use client";

import { useId, type Key } from "react";

import { cn } from "@puzzle-ui/core";

import { Button } from "../../actions/button";
import type {
  FieldArrayItemContext,
  FieldArrayProps,
} from "./field-array.types";

import "./field-array.css";

const FieldArray = <T,>({
  items,
  onChange,
  createItem,
  renderItem,
  label,
  description,
  error,
  invalid,
  validate,
  itemLabel = (_item, index) => `Item ${index + 1}`,
  getItemKey,
  addLabel = "Add item",
  removeLabel = (index) => `Remove item ${index + 1}`,
  moveUpLabel = (index) => `Move item ${index + 1} up`,
  moveDownLabel = (index) => `Move item ${index + 1} down`,
  emptyMessage = "No items yet.",
  minItems = 0,
  maxItems,
  reorderable = false,
  disabled = false,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...fieldsetProps
}: FieldArrayProps<T>) => {
  const generatedId = useId();
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;

  const validationError = validate?.(items) ?? null;
  const hasValidationError = Boolean(validationError);
  const hasExternalError =
    error !== undefined && error !== null && error !== false;
  const hasError = hasExternalError || hasValidationError || invalid === true;
  const isInvalid = invalid ?? hasError;
  const errorContent = hasExternalError
    ? error === true
      ? "Invalid field array."
      : error
    : validationError || (invalid ? "Invalid field array." : null);

  const describedBy = [
    ariaDescribedBy,
    description != null ? descriptionId : null,
    errorContent != null ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  const addItem = () => onChange([...items, createItem()]);

  const removeItem = (index: number) =>
    onChange(items.filter((_, itemIndex) => itemIndex !== index));

  const moveItem = (index: number, offset: -1 | 1) => {
    const targetIndex = index + offset;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[targetIndex]] = [
      nextItems[targetIndex] as T,
      nextItems[index] as T,
    ];
    onChange(nextItems);
  };

  const resolveKey = (item: T, index: number): Key =>
    getItemKey ? getItemKey(item, index) : index;

  return (
    <fieldset
      {...fieldsetProps}
      disabled={disabled}
      className={cn("puzzle-field-array", className)}
      aria-describedby={describedBy || undefined}
      aria-invalid={isInvalid ? true : ariaInvalid}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
    >
      <legend className="puzzle-field-array__legend">{label}</legend>

      {description != null && (
        <p id={descriptionId} className="puzzle-field-array__description">
          {description}
        </p>
      )}

      {items.length === 0 ? (
        <p className="puzzle-field-array__empty" role="status">
          {emptyMessage}
        </p>
      ) : (
        <div className="puzzle-field-array__items">
          {items.map((item, index) => {
            const context: FieldArrayItemContext<T> = {
              item,
              index,
              count: items.length,
            };

            return (
              <fieldset
                key={resolveKey(item, index)}
                className="puzzle-field-array__item"
              >
                <legend className="puzzle-field-array__item-legend">
                  {itemLabel(item, index)}
                </legend>

                <div className="puzzle-field-array__item-content">
                  {renderItem(context)}
                </div>

                <div
                  className="puzzle-field-array__item-actions"
                  role="group"
                  aria-label={`Actions for item ${index + 1}`}
                >
                  {reorderable && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={moveUpLabel(index)}
                        disabled={index === 0}
                        onClick={() => moveItem(index, -1)}
                      >
                        Move up
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={moveDownLabel(index)}
                        disabled={index === items.length - 1}
                        onClick={() => moveItem(index, 1)}
                      >
                        Move down
                      </Button>
                    </>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={removeLabel(index)}
                    disabled={items.length <= minItems}
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              </fieldset>
            );
          })}
        </div>
      )}

      {errorContent != null && (
        <p
          id={errorId}
          className="puzzle-field-array__error"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorContent}
        </p>
      )}

      <div className="puzzle-field-array__actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={maxItems !== undefined && items.length >= maxItems}
          onClick={addItem}
        >
          {addLabel}
        </Button>
      </div>
    </fieldset>
  );
};

export {
  FieldArray,
  FieldArray as RepeaterField,
  type FieldArrayItemContext,
  type FieldArrayProps,
};
