"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";

import { cn } from "@puzzle/core";

import "./input.css";

type TextAreaInputProps = Omit<ComponentPropsWithoutRef<"textarea">, "rows"> & {
  rows?: number;
  autoSize?: boolean;
  resizable?: boolean;
};

const TextAreaInput = ({
  rows = 3,
  autoSize = true,
  resizable = false,
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: TextAreaInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const element = textareaRef.current;

    if (!element || !autoSize) {
      return;
    }

    element.style.height = "auto";

    const styles = window.getComputedStyle(element);

    const lineHeight = Number.parseFloat(styles.lineHeight) || 20;

    const padding =
      (Number.parseFloat(styles.paddingTop) || 0) +
      (Number.parseFloat(styles.paddingBottom) || 0);

    const border =
      (Number.parseFloat(styles.borderTopWidth) || 0) +
      (Number.parseFloat(styles.borderBottomWidth) || 0);

    const minHeight = lineHeight * rows + padding + border;

    element.style.height = `${Math.max(minHeight, element.scrollHeight)}px`;
  }, [autoSize, rows]);

  useLayoutEffect(() => {
    resize();
  }, [resize, value, defaultValue]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={rows}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => {
        onChange?.(event);
        resize();
      }}
      className={cn("puzzle-input", "puzzle-input--textarea", className)}
      style={{
        ...props.style,
        resize: resizable ? "vertical" : "none",
        overflowY: autoSize ? "hidden" : "auto",
      }}
    />
  );
};

export { TextAreaInput, type TextAreaInputProps };
