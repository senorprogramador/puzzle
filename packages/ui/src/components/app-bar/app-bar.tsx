import { cn } from "@puzzle/core";
import {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Drawer } from "../drawer/drawer";
import "./app-bar.css";
import { Stack } from "../stack/stack";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type AppBarNavigationItem = {
  label: string;
  href: string;
  current?: boolean;
  external?: boolean;
};

type AppBarProps<T = never> = {
  logo?: ReactNode;
  title?: string;
  logoHref?: string;
  navigationItems?: AppBarNavigationItem[];
  customNavigationItems?: T[];
  renderCustomNavigationItems?: (item: T, index: number) => ReactNode;
  trailingComponents?: ReactNode;
  sticky?: boolean;
  ariaLabel?: string;
  className?: string;
};

const AppBar = <T,>({
  logo,
  title,
  logoHref = "/",
  navigationItems = [],
  customNavigationItems = [],
  renderCustomNavigationItems,
  trailingComponents,
  sticky = false,
  ariaLabel = "Main navigation",
  className,
}: AppBarProps<T>) => {
  const [open, setOpen] = useState(false);
  const appBarRef = useRef<HTMLElement | null>(null);

  const navigationId = `puzzle-app-bar-nav-${useId()}`;

  const hasBrand = logo != null || title != null;
  const hasCustomNavigation =
    customNavigationItems.length > 0 && renderCustomNavigationItems != null;
  const hasNavigation = navigationItems.length > 0 || hasCustomNavigation;

  const style = {
    "--puzzle-app-bar-sticky": sticky ? "sticky" : "relative",
  } as CSSProperties;

  useIsomorphicLayoutEffect(() => {
    if (!sticky) return;

    const appBar = appBarRef.current;
    if (!appBar) return;

    const pageLayout = appBar.closest<HTMLElement>("[data-puzzle-page-layout]");

    // AppBars inside previews must not overwrite the page offset.
    if (pageLayout && appBar.parentElement !== pageLayout) return;

    const scope = pageLayout ?? document.documentElement;
    const property = "--puzzle-sticky-offset";

    const previousValue = scope.style.getPropertyValue(property);
    const previousPriority = scope.style.getPropertyPriority(property);

    const updateOffset = () => {
      scope.style.setProperty(
        property,
        `${appBar.getBoundingClientRect().height}px`,
      );
    };

    updateOffset();

    const observer = new ResizeObserver(updateOffset);
    observer.observe(appBar);

    return () => {
      observer.disconnect();

      if (previousValue) {
        scope.style.setProperty(property, previousValue, previousPriority);
      } else {
        scope.style.removeProperty(property);
      }
    };
  }, [sticky]);

  const renderNavigationItems = () => (
    <ul className="puzzle-app-bar__list">
      {navigationItems.map(({ label, href, current, external }) => (
        <li key={href}>
          <a
            className="puzzle-app-bar__link"
            href={href}
            aria-current={current ? "page" : undefined}
            {...(external
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {})}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        </li>
      ))}

      {hasCustomNavigation &&
        customNavigationItems.map((item, index) => (
          <li key={index}>{renderCustomNavigationItems(item, index)}</li>
        ))}
    </ul>
  );

  return (
    <header
      ref={appBarRef}
      className={cn("puzzle-app-bar", className)}
      style={style}
    >
      <div className="puzzle-app-bar__inner">
        {hasBrand && (
          <a
            className="puzzle-app-bar__brand"
            href={logoHref}
            aria-label={title ?? "Home"}
          >
            {logo}
            {title && <span className="puzzle-app-bar__title">{title}</span>}
          </a>
        )}

        {hasNavigation && (
          <nav className="puzzle-app-bar__navigation" aria-label={ariaLabel}>
            {renderNavigationItems()}
          </nav>
        )}

        <div className="puzzle-app-bar__actions">
          {trailingComponents != null && (
            <div className="puzzle-app-bar__trailing">{trailingComponents}</div>
          )}

          {hasNavigation && (
            <button
              className="puzzle-app-bar__menu-button"
              type="button"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls={navigationId}
              onClick={() => setOpen(true)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {hasNavigation && (
        <div id={navigationId} className="puzzle-app-bar__mobile">
          <Drawer
            position="right"
            open={open}
            onOpenChange={setOpen}
            className="puzzle-app-bar__drawer"
            aria-label={ariaLabel}
          >
            <Stack direction="row" alignH="between" alignV="center">
              {hasBrand && (
                <a
                  className="puzzle-app-bar__brand"
                  href={logoHref}
                  aria-label={title ?? "Home"}
                >
                  {logo}
                  {title && (
                    <span className="puzzle-app-bar__title">{title}</span>
                  )}
                </a>
              )}
              <button
                className="puzzle-app-bar__menu-button"
                type="button"
                aria-label="Close navigation"
                aria-expanded={open}
                aria-controls={navigationId}
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </Stack>
            <hr />
            <nav
              className="puzzle-app-bar__drawer-navigation"
              aria-label={ariaLabel}
            >
              {renderNavigationItems()}
            </nav>
          </Drawer>
        </div>
      )}
    </header>
  );
};

export type { AppBarNavigationItem, AppBarProps };
export { AppBar };
