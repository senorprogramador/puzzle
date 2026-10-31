"use client";

import { useId } from "react";
import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@puzzle/core";

import "./switch.css";

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children" | "onChange"
> & {
  size?: SwitchSize;
  label?: ReactNode;
  description?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
};

const Switch = ({
  size = "md",
  label,
  description,
  checked,
  defaultChecked,
  disabled = false,
  required = false,
  className,
  id,
  onChange,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SwitchProps) => {
  const generatedId = useId();

  const inputId = id ?? (description != null ? generatedId : undefined);
  const descriptionId =
    description != null ? `${inputId ?? generatedId}-description` : undefined;

  const describedBy =
    [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;

  const classes = cn(
    "puzzle-switch",
    `puzzle-switch--${size}`,
    disabled && "puzzle-switch--disabled",
    className,
  );

  return (
    <label className={classes}>
      <input
        {...rest}
        id={inputId}
        className="puzzle-switch__input"
        type="checkbox"
        role="switch"
        {...(checked !== undefined
          ? { checked }
          : defaultChecked !== undefined
            ? { defaultChecked }
            : {})}
        disabled={disabled}
        required={required}
        aria-describedby={describedBy}
        onChange={onChange}
      />

      <span className="puzzle-switch__control" aria-hidden="true" />

      {(label != null || description != null) && (
        <span
          className={cn(
            "puzzle-switch__content",
            label == null && "puzzle-switch__content--description-only",
          )}
        >
          {label}

          {description != null && (
            <span id={descriptionId} className="puzzle-switch__description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export { Switch };
