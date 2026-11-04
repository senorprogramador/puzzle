import type { ReactNode } from "react";

type ButtonContentProps = {
  children?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  loading: boolean;
};

const ButtonContent = ({
  children,
  leading,
  trailing,
  loading,
}: ButtonContentProps) => {
  return (
    <>
      {loading ? (
        <span className="puzzle-button__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              opacity=".25"
            />

            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : leading != null ? (
        <span className="puzzle-button__leading">{leading}</span>
      ) : null}

      {children != null && (
        <span className="puzzle-button__content">{children}</span>
      )}

      {trailing != null && (
        <span className="puzzle-button__trailing">{trailing}</span>
      )}
    </>
  );
};

export { ButtonContent };
