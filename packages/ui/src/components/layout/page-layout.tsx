import { useId } from "react";
import type {
  ReactNode,
  HTMLAttributes,
  ElementType,
  CSSProperties,
} from "react";
import "./page-layout.css";

type CSSSize = string | number;

type PageLayoutElementProps = HTMLAttributes<HTMLElement>;

type PageLayoutProps = {
  /**
   * Page regions.
   */
  header?: ReactNode;
  leftSidebar?: ReactNode;
  children: ReactNode;
  rightSidebar?: ReactNode;
  footer?: ReactNode;

  /**
   * Semantic element overrides.
   */
  leftSidebarAs?: ElementType;
  rightSidebarAs?: ElementType;
  footerAs?: ElementType;

  /**
   * Accessible names for sidebar landmarks.
   */
  leftSidebarLabel?: string;
  rightSidebarLabel?: string;

  /**
   * Attributes for individual page regions.
   */
  leftSidebarProps?: PageLayoutElementProps;
  mainProps?: PageLayoutElementProps;
  rightSidebarProps?: PageLayoutElementProps;
  footerProps?: PageLayoutElementProps;

  /**
   * Styling.
   */
  className?: string;
  contentClassName?: string;
  leftSidebarClassName?: string;
  mainClassName?: string;
  rightSidebarClassName?: string;
  footerClassName?: string;
  style?: CSSProperties;

  /**
   * Layout configuration.
   * Numeric sizes are interpreted as pixels.
   */
  maxWidth?: CSSSize;
  leftSidebarWidth?: CSSSize;
  rightSidebarWidth?: CSSSize;
  gap?: CSSSize;
  rowGap?: CSSSize;
  columnGap?: CSSSize;
  contentPaddingInline?: CSSSize;
  contentPaddingBlock?: CSSSize;
  minHeight?: CSSSize;

  /**
   * Set false to disable the skip link.
   * Supply localized text or other accessible content to customize it.
   */
  skipLink?: ReactNode | false;
  skipLinkClassName?: string;
};

function cx(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

function toCSSSize(value: CSSSize | undefined): string | undefined {
  if (value === undefined) return undefined;

  return typeof value === "number" ? `${value}px` : value;
}

function hasContent(value: ReactNode): boolean {
  return value !== undefined && value !== null && value !== false;
}

const PageLayout = ({
  header,
  leftSidebar,
  children,
  rightSidebar,
  footer,

  leftSidebarAs,
  rightSidebarAs,
  footerAs,

  leftSidebarLabel,
  rightSidebarLabel,

  leftSidebarProps,
  mainProps,
  rightSidebarProps,
  footerProps,

  className,
  contentClassName,
  leftSidebarClassName,
  mainClassName,
  rightSidebarClassName,
  footerClassName,
  style,

  maxWidth,
  leftSidebarWidth,
  rightSidebarWidth,
  gap,
  rowGap,
  columnGap,
  contentPaddingInline,
  contentPaddingBlock,
  minHeight,

  skipLink = "Skip to main content",
  skipLinkClassName,
}: PageLayoutProps) => {
  const reactId = useId();

  const mainId =
    mainProps?.id ?? `puzzle-main-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const LeftSidebar = leftSidebarAs ?? "aside";
  const RightSidebar = rightSidebarAs ?? "aside";
  const Footer = footerAs ?? "footer";

  const hasHeader = hasContent(header);
  const hasLeftSidebar = hasContent(leftSidebar);
  const hasRightSidebar = hasContent(rightSidebar);
  const hasFooter = hasContent(footer);

  const layout = hasLeftSidebar
    ? hasRightSidebar
      ? "left-main-right"
      : "left-main"
    : hasRightSidebar
      ? "main-right"
      : "main";

  const layoutStyle = {
    "--puzzle-page-max-width": toCSSSize(maxWidth),
    "--puzzle-page-left-width": toCSSSize(leftSidebarWidth),
    "--puzzle-page-right-width": toCSSSize(rightSidebarWidth),
    "--puzzle-page-gap": toCSSSize(gap),
    "--puzzle-page-row-gap": toCSSSize(rowGap),
    "--puzzle-page-column-gap": toCSSSize(columnGap),
    "--puzzle-page-padding-inline": toCSSSize(contentPaddingInline),
    "--puzzle-page-padding-block": toCSSSize(contentPaddingBlock),
    "--puzzle-page-min-height": toCSSSize(minHeight),
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cx("puzzle-page-layout", className)}
      style={layoutStyle}
      data-puzzle-page-layout=""
      data-layout={layout}
    >
      {skipLink !== false && (
        <a
          className={cx("puzzle-page-layout__skip-link", skipLinkClassName)}
          href={`#${mainId}`}
        >
          {skipLink ?? "Skip to main content"}
        </a>
      )}

      {hasHeader && header}

      <div className={cx("puzzle-page-layout__content", contentClassName)}>
        {/* Main first in the DOM for content-first reading order. */}
        <main
          {...mainProps}
          id={mainId}
          tabIndex={mainProps?.tabIndex ?? -1}
          className={cx(
            "puzzle-page-layout__main",
            mainClassName,
            mainProps?.className,
          )}
        >
          {children}
        </main>

        {hasLeftSidebar && (
          <LeftSidebar
            {...leftSidebarProps}
            aria-label={leftSidebarLabel ?? leftSidebarProps?.["aria-label"]}
            className={cx(
              "puzzle-page-layout__sidebar",
              "puzzle-page-layout__sidebar--left",
              leftSidebarClassName,
              leftSidebarProps?.className,
            )}
          >
            {leftSidebar}
          </LeftSidebar>
        )}

        {hasRightSidebar && (
          <RightSidebar
            {...rightSidebarProps}
            aria-label={rightSidebarLabel ?? rightSidebarProps?.["aria-label"]}
            className={cx(
              "puzzle-page-layout__sidebar",
              "puzzle-page-layout__sidebar--right",
              rightSidebarClassName,
              rightSidebarProps?.className,
            )}
          >
            {rightSidebar}
          </RightSidebar>
        )}
      </div>

      {hasFooter && (
        <Footer
          {...footerProps}
          className={cx(
            "puzzle-page-layout__footer",
            footerClassName,
            footerProps?.className,
          )}
        >
          {footer}
        </Footer>
      )}
    </div>
  );
};

export { PageLayout, type PageLayoutProps };
