import {
  Children,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { resolveResponsiveValue, type ResponsiveValue } from "@puzzle/core";

import "./page-layout.css";

type CSSSize = string | number;
type SidebarPlacement = "beside" | "below";

type RegionProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

type PageLayoutProps = {
  children: ReactNode;

  className?: string;
  contentClassName?: string;
  style?: CSSProperties;

  maxWidth?: CSSSize;
  gap?: CSSSize;
  rowGap?: CSSSize;
  columnGap?: CSSSize;
  contentPaddingInline?: CSSSize;
  contentPaddingBlock?: CSSSize;
  minHeight?: CSSSize;

  sidebarPlacement?: ResponsiveValue<SidebarPlacement>;
};

type RegionType = "header" | "main" | "leftSidebar" | "rightSidebar" | "footer";

type PageLayoutRegion = ReactElement<RegionProps> & {
  type: RegionType;
};

const cx = (...values: Array<string | undefined | false>): string =>
  values.filter(Boolean).join(" ");

const toCSSSize = (value: CSSSize | undefined): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "number"
      ? `${value}px`
      : value;

const createRegion = (type: RegionType) => {
  const Region = (_props: RegionProps) => null;

  Region.displayName = `PageLayout.${type}`;

  return Object.assign(Region, { regionType: type });
};

const Header = createRegion("header");
const Main = createRegion("main");
const LeftSidebar = createRegion("leftSidebar");
const RightSidebar = createRegion("rightSidebar");
const Footer = createRegion("footer");

const PageLayoutBase = ({
  children,
  className,
  contentClassName,
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

  const regions: Partial<Record<RegionType, ReactElement<RegionProps>>> = {};

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const type = child.type as typeof Header;

    if (type.regionType) {
      regions[type.regionType] = child as ReactElement<RegionProps>;
    }
  });

  const renderRegion = (
    region: ReactElement<RegionProps> | undefined,
    className: string,
    tag: "header" | "main" | "aside" | "footer",
    ariaLabel?: string,
  ) => {
    if (!region) {
      return null;
    }

    const {
      children: content,
      className: regionClassName,
      ...props
    } = region.props;

    const Component = tag;

    return (
      <Component
        {...props}
        className={cx(className, regionClassName)}
        aria-label={ariaLabel ?? props["aria-label"]}
      >
        {content}
      </Component>
    );
  };

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

  return (
    <div
      className={cx("puzzle-page-layout", className)}
      style={layoutStyle}
      data-puzzle-page-layout=""
      data-sidebar-placement-mobile={placement.mobile}
      data-sidebar-placement-tablet={placement.tablet}
      data-sidebar-placement-desktop={placement.desktop}
    >
      {renderRegion(regions.header, "puzzle-page-layout__header", "header")}

      <div className={cx("puzzle-page-layout__content", contentClassName)}>
        {renderRegion(regions.main, "puzzle-page-layout__main", "main")}

        {renderRegion(
          regions.leftSidebar,
          "puzzle-page-layout__sidebar puzzle-page-layout__sidebar--left",
          "aside",
        )}

        {renderRegion(
          regions.rightSidebar,
          "puzzle-page-layout__sidebar puzzle-page-layout__sidebar--right",
          "aside",
        )}
      </div>

      {renderRegion(regions.footer, "puzzle-page-layout__footer", "footer")}
    </div>
  );
};

type PageLayoutComponent = ((props: PageLayoutProps) => ReactElement) & {
  Header: typeof Header;
  Main: typeof Main;
  LeftSidebar: typeof LeftSidebar;
  RightSidebar: typeof RightSidebar;
  Footer: typeof Footer;
};

const PageLayout = Object.assign(PageLayoutBase, {
  Header,
  Main,
  LeftSidebar,
  RightSidebar,
  Footer,
}) as PageLayoutComponent;

export { PageLayout, type PageLayoutProps, type SidebarPlacement };
