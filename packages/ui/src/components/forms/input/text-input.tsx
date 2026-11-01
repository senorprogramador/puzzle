"use client";

import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@puzzle/core";
import { Icon } from "@puzzle/icons";

import "./input.css";

type TextInputType = "text" | "email" | "password" | "phone";

type TextInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "prefix"
> & {
  type?: TextInputType;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

const TextInput = ({
  type = "text",
  prefix,
  suffix,
  className,
  disabled,
  ...props
}: TextInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = type === "password";

  const resolvedType = isPassword
    ? passwordVisible
      ? "text"
      : "password"
    : type === "phone"
      ? "tel"
      : type;

  const resolvedPrefix =
    prefix !== undefined ? (
      prefix
    ) : type === "email" ? (
      <Icon name="lucide:mail" />
    ) : type === "phone" ? (
      <Icon name="lucide:phone" />
    ) : null;

  const resolvedSuffix =
    suffix !== undefined ? (
      suffix
    ) : isPassword ? (
      <button
        type="button"
        className="puzzle-input__icon-button"
        aria-label={passwordVisible ? "Hide password" : "Show password"}
        aria-pressed={passwordVisible}
        disabled={disabled}
        onClick={() => setPasswordVisible((visible) => !visible)}
      >
        <Icon name={passwordVisible ? "lucide:eye-off" : "lucide:eye"} />
      </button>
    ) : null;

  return (
    <span
      className={cn("puzzle-input", "puzzle-input--text", className)}
      data-disabled={disabled || undefined}
    >
      {resolvedPrefix != null && (
        <span
          className="puzzle-input__affix puzzle-input__prefix"
          aria-hidden="true"
        >
          {resolvedPrefix}
        </span>
      )}

      <input
        {...props}
        type={resolvedType}
        disabled={disabled}
        className="puzzle-input__control"
      />

      {resolvedSuffix != null && (
        <span className="puzzle-input__affix puzzle-input__suffix">
          {resolvedSuffix}
        </span>
      )}
    </span>
  );
};

export { TextInput, type TextInputProps, type TextInputType };
