"use client";

import { cn } from "@puzzle-ui/core";
import { Link } from "../../navigation/link";
import {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Drawer } from "../../overlays/drawer";
import "./app-bar.css";
import { Stack } from "../stack";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const getStickyOffsetScope = (appBar: HTMLElement) => {
  const pageLayout = appBar.closest<HTMLElement>("[data-puzzle-page-layout]");
  const parent = appBar.parentElement;
  const isPageHeader =
    parent?.classList.contains("puzzle-page-layout__header") &&
    parent.parentElement === pageLayout;

  // AppBars inside previews must not overwrite the page offset.
  if (pageLayout && parent !== pageLayout && !isPageHeader) return;

  return pageLayout ?? appBar.ownerDocument.documentElement;
};

const initializeStickyOffset = (
  script: HTMLScriptElement,
  getScope: typeof getStickyOffsetScope,
) => {
  const appBar = script.parentElement;
  const stylesheet = script.previousElementSibling;
  if (!appBar || !(stylesheet instanceof HTMLStyleElement)) return;

  const scope = getScope(appBar);
  if (!scope || !stylesheet.sheet) return;

  const barSelector = `[data-puzzle-app-bar="${CSS.escape(
    appBar.getAttribute("data-puzzle-app-bar")!,
  )}"]`;
  const selector =
    scope === appBar.ownerDocument.documentElement
      ? ":root"
      : scope === appBar.parentElement
        ? `[data-puzzle-page-layout]:has(> ${barSelector})`
        : `[data-puzzle-page-layout]:has(> .puzzle-page-layout__header > ${barSelector})`;

  // CSSOM changes leave React's server-rendered attributes and text intact.
  stylesheet.sheet.insertRule(
    `${selector}{--puzzle-sticky-offset:${appBar.getBoundingClientRect().height}px}`,
  );
};

const stickyOffsetScript = `(${initializeStickyOffset.toString()})(document.currentScript,${getStickyOffsetScope.toString()})`;

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
  /** CSP nonce for the initial sticky-offset script and stylesheet. */
  nonce?: string;
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
  nonce,
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

    const scope = getStickyOffsetScope(appBar);
    if (!scope) return;
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

    const ObserverImpl =
      appBar.ownerDocument.defaultView?.ResizeObserver ?? ResizeObserver;
    const observer = new ObserverImpl(updateOffset);
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
          <Link
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
          </Link>
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
      data-puzzle-app-bar={sticky ? navigationId : undefined}
    >
      <div className="puzzle-app-bar__inner">
        {hasBrand && (
          <Link
            className="puzzle-app-bar__brand"
            href={logoHref}
            aria-label={title ?? "Home"}
          >
            {logo}
            {title && <span className="puzzle-app-bar__title">{title}</span>}
          </Link>
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
                <Link
                  className="puzzle-app-bar__brand"
                  href={logoHref}
                  aria-label={title ?? "Home"}
                >
                  {logo}
                  {title && (
                    <span className="puzzle-app-bar__title">{title}</span>
                  )}
                </Link>
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
      {sticky && (
        <>
          <style nonce={nonce} />
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: stickyOffsetScript }}
          />
        </>
      )}
    </header>
  );
};

export { AppBar, type AppBarNavigationItem, type AppBarProps };
