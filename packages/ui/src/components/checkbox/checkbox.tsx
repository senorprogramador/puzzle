import {
  useCallback,
  useId,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@puzzle/core";
import "./checkbox.css";

export type CheckboxSize = "sm" | "md" | "lg";

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "children" | "className" | "size" | "style" | "type"
> & {
  /** Content displayed beside the checkbox. */
  label?: ReactNode;
  /** Alternative to `label` for JSX composition. `label` takes precedence. */
  children?: ReactNode;
  /** Optional supporting text displayed below the label. */
  description?: ReactNode;
  /** Visual size of the checkbox. Defaults to `md`. */
  size?: CheckboxSize;
  /** Shows the mixed state without changing the native checked value. */
  indeterminate?: boolean;
  /** Class applied to the root label. */
  className?: string;
  /** Inline styles applied to the root label. */
  style?: CSSProperties;
};

const Checkbox = ({
  label,
  children,
  description,
  size = "md",
  indeterminate = false,
  className,
  style,
  id,
  ref,
  disabled = false,
  required = false,
  "aria-describedby": ariaDescribedBy,
  ...inputProps
}: CheckboxProps) => {
  const checkboxLabel = label ?? children;
  const generatedId = useId();
  const descriptionId =
    description != null ? `${id ?? generatedId}-description` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate;

      if (typeof ref === "function") return ref(node);
      if (ref) ref.current = node;
    },
    [indeterminate, ref],
  );

  return (
    <label
      className={cn(
        "puzzle-checkbox",
        `puzzle-checkbox--${size}`,
        (inputProps.checked ?? inputProps.defaultChecked) &&
          "puzzle-checkbox--checked",
        indeterminate && "puzzle-checkbox--indeterminate",
        disabled && "puzzle-checkbox--disabled",
        className,
      )}
      style={style}
    >
      <span className="puzzle-checkbox__control">
        <input
          {...inputProps}
          ref={setInputRef}
          id={id}
          type="checkbox"
          disabled={disabled}
          required={required}
          aria-describedby={describedBy}
        />
        <svg
          className="puzzle-checkbox__indicator"
          viewBox="0 0 18 18"
          aria-hidden="true"
          focusable="false"
          fill="none"
        >
          <rect fill="currentColor" x="0" y="0" width="18" height="18" rx="2" />
          <path
            className="puzzle-checkbox__check"
            d="M2.75 9.25 7 13.5 15.25 4.75"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="puzzle-checkbox__mixed"
            d="M4.25 9h9.5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {(checkboxLabel != null || description != null) && (
        <span className="puzzle-checkbox__content">
          {checkboxLabel != null && (
            <span className="puzzle-checkbox__label">
              {checkboxLabel}
              {required && (
                <span className="puzzle-checkbox__required" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          )}
          {description != null && (
            <span id={descriptionId} className="puzzle-checkbox__description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export { Checkbox };
