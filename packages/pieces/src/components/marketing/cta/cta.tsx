import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type { ElementType } from "react";
import type { CTASectionProps } from "./cta.types";
import "./cta.css";

const CTASection = <C extends ElementType = "section">({
  variant = "centered",
  media,
  primaryAction,
  secondaryAction,
  children,
  className,
  ...sectionProps
}: CTASectionProps<C>) => {
  const hasBody = Boolean(media || primaryAction || secondaryAction || children);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      fullWidth={
        sectionProps.fullWidth ?? variant === "full-width"
      }
      className={`puzzle-cta ${className ?? ""}`.trim()}
      family="cta"
      variant={variant}
    >
      {hasBody ? (
        <div className="puzzle-cta__body">
          {media ? <div className="puzzle-cta__media">{media}</div> : null}
          {primaryAction || secondaryAction ? (
            <div className="puzzle-cta__actions">
              {primaryAction}
              {secondaryAction}
            </div>
          ) : null}
          {children}
        </div>
      ) : null}
    </MarketingSection>
  );
};

export { CTASection };
