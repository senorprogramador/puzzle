import { cloneElement } from "react";
import type {
  ReactElement,
  ReactNode,
  HTMLAttributes,
  CSSProperties,
} from "react";
import { resolveResponsiveValue, type ResponsiveValue } from "@puzzle/core";
import "./page-layout.css";

type CSSSize = string | number;

type SidebarPlacement = "beside" | "below";

type PageLayoutElement = ReactElement<{
  className?: string;
}>;

type PageLayoutElementProps = HTMLAttributes<HTMLElement>;

type PageLayoutProps = {
  /**
   * Page regions.
   */
  header?: ReactNode;
  leftSidebar?: PageLayoutElement;
  children: ReactNode;
  rightSidebar?: PageLayoutElement;
  footer?: PageLayoutElement;

  /**
   * Accessible names for sidebar elements.
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
  mainClassName?: string;
  style?: CSSProperties;

  /**
   * Layout configuration.
   */
  maxWidth?: CSSSize;
  gap?: CSSSize;
  rowGap?: CSSSize;
  columnGap?: CSSSize;
  contentPaddingInline?: CSSSize;
  contentPaddingBlock?: CSSSize;
  minHeight?: CSSSize;

  /**
   * Sidebar positioning.
   *
   * Defaults to below on mobile/tablet
   * and beside on desktop.
   */
  sidebarPlacement?: ResponsiveValue<SidebarPlacement>;
};

const cx = (...values: Array<string | undefined | false>): string =>
  values.filter(Boolean).join(" ");

const toCSSSize = (value: CSSSize | undefined): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "number"
      ? `${value}px`
      : value;

const hasContent = (value: ReactNode): boolean =>
  value !== undefined && value !== null && value !== false;

/**
 * Adds layout classes and optional HTML attributes
 * to an existing React element.
 *
 * The original className is always preserved.
 */
const withClassName = <P extends { className?: string }>(
  element: ReactElement<P>,
  className: string,
  props?: PageLayoutElementProps,
): ReactElement<P> =>
  cloneElement(element, {
    ...props,
    className: cx(element.props.className, className, props?.className),
  } as Partial<P>);

const PageLayout = ({
  header,
  leftSidebar,
  children,
  rightSidebar,
  footer,

  leftSidebarLabel,
  rightSidebarLabel,

  leftSidebarProps,
  mainProps,
  rightSidebarProps,
  footerProps,

  className,
  contentClassName,
  mainClassName,
  style,

  maxWidth,
  gap,
  rowGap,
  columnGap,
  contentPaddingInline,
  contentPaddingBlock,
  minHeight,

  sidebarPlacement,
}: PageLayoutProps) => {
  const placement = resolveResponsiveValue<SidebarPlacement>(
    sidebarPlacement ?? {
      mobile: "below",
      tablet: "below",
      desktop: "beside",
    },
  );

  const layoutStyle = {
    "--puzzle-page-max-width": toCSSSize(maxWidth),
    "--puzzle-page-gap": toCSSSize(gap),
    "--puzzle-page-row-gap": toCSSSize(rowGap),
    "--puzzle-page-column-gap": toCSSSize(columnGap),
    "--puzzle-page-padding-inline": toCSSSize(contentPaddingInline),
    "--puzzle-page-padding-block": toCSSSize(contentPaddingBlock),
    "--puzzle-page-min-height": toCSSSize(minHeight),
    ...style,
  } as CSSProperties;

  const leftSidebarNode = leftSidebar
    ? withClassName(
        leftSidebar,
        "puzzle-page-layout__sidebar puzzle-page-layout__sidebar--left",
        {
          ...leftSidebarProps,
          ...(leftSidebarLabel !== undefined
            ? { "aria-label": leftSidebarLabel }
            : {}),
        },
      )
    : null;

  const rightSidebarNode = rightSidebar
    ? withClassName(
        rightSidebar,
        "puzzle-page-layout__sidebar puzzle-page-layout__sidebar--right",
        {
          ...rightSidebarProps,
          ...(rightSidebarLabel !== undefined
            ? { "aria-label": rightSidebarLabel }
            : {}),
        },
      )
    : null;

  const footerNode = footer
    ? withClassName(footer, "puzzle-page-layout__footer", footerProps)
    : null;

  return (
    <div
      className={cx("puzzle-page-layout", className)}
      style={layoutStyle}
      data-puzzle-page-layout=""
      data-sidebar-placement-mobile={placement.mobile}
      data-sidebar-placement-tablet={placement.tablet}
      data-sidebar-placement-desktop={placement.desktop}
    >
      {hasContent(header) && header}

      <div className={cx("puzzle-page-layout__content", contentClassName)}>
        <main
          {...mainProps}
          className={cx(
            "puzzle-page-layout__main",
            mainClassName,
            mainProps?.className,
          )}
        >
          {children}
        </main>

        {leftSidebarNode}

        {rightSidebarNode}
      </div>

      {footerNode}
    </div>
  );
};

export { PageLayout, type PageLayoutProps };
