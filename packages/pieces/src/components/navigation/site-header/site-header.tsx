"use client";

import { Dialog } from "@puzzle-ui/ui";
import { useState, type ReactNode } from "react";
import type {
  SiteHeaderProps,
  SiteHeaderVariant,
  SiteNavigationItem,
} from "./site-header.types";

import "./site-header.css";

const isExternal = (item: SiteNavigationItem) =>
  item.external || (item.href ? /^(?:[a-z]+:|\/\/)/i.test(item.href) : false);

const SiteLink = ({
  item,
  onNavigate,
}: {
  item: SiteNavigationItem;
  onNavigate?: () => void;
}) => {
  if (!item.href || item.disabled) {
    return (
      <span
        className="puzzle-site-header__link"
        aria-disabled={item.disabled || undefined}
        data-active={item.active || undefined}
      >
        {item.label}
      </span>
    );
  }

  return (
    <a
      className="puzzle-site-header__link"
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      target={isExternal(item) ? "_blank" : undefined}
      rel={isExternal(item) ? "noreferrer" : undefined}
      data-active={item.active || undefined}
      onClick={onNavigate}
    >
      <span>
        {item.label}
        {item.description ? (
          <span className="puzzle-site-header__description">{item.description}</span>
        ) : null}
      </span>
      {isExternal(item) ? <span aria-label="External link">↗</span> : null}
    </a>
  );
};

const DesktopItem = ({ item }: { item: SiteNavigationItem }) => (
  <li className="puzzle-site-header__item">
    {item.children?.length ? (
      <details>
        <summary className="puzzle-site-header__summary">
          {item.label}
          <span aria-hidden="true">⌄</span>
        </summary>
        <div className="puzzle-site-header__submenu">
          {item.href ? <SiteLink item={item} /> : null}
          {item.children.map((child) => (
            <SiteLink item={child} key={child.id} />
          ))}
        </div>
      </details>
    ) : (
      <SiteLink item={item} />
    )}
  </li>
);

const MobileItems = ({
  items,
  onNavigate,
}: {
  items: readonly SiteNavigationItem[];
  onNavigate: () => void;
}) => (
  <ul className="puzzle-site-header__mobile-list">
    {items.map((item) => (
      <li key={item.id}>
        <SiteLink item={item} onNavigate={onNavigate} />
        {item.children?.length ? (
          <div className="puzzle-site-header__mobile-submenu">
            {item.children.map((child) => (
              <SiteLink item={child} key={child.id} onNavigate={onNavigate} />
            ))}
          </div>
        ) : null}
      </li>
    ))}
  </ul>
);

const SiteHeader = ({
  logo,
  items = [],
  primaryAction,
  secondaryActions,
  localeSwitcher,
  utilityNavigation,
  variant = "default",
  sticky = false,
  scrolled = false,
  mobileMenuTrigger,
  mobileMenuLabel = "Open menu",
  mobileMenuTitle = "Website navigation",
  closeLabel = "Close menu",
  navigationLabel = "Primary navigation",
  className,
}: SiteHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerContent: ReactNode = mobileMenuTrigger ?? (
    <>
      <span aria-hidden="true">☰</span>
      <span className="puzzle-visually-hidden">{mobileMenuLabel}</span>
    </>
  );

  return (
    <header
      className={["puzzle-site-header", className].filter(Boolean).join(" ")}
      data-variant={variant satisfies SiteHeaderVariant}
      data-sticky={sticky || undefined}
      data-scrolled={scrolled || undefined}
    >
      <div className="puzzle-site-header__inner">
        <div className="puzzle-site-header__logo">{logo}</div>
        <div className="puzzle-site-header__desktop">
          {items.length ? (
            <nav className="puzzle-site-header__navigation" aria-label={navigationLabel}>
              <ul className="puzzle-site-header__list">
                {items.map((item) => <DesktopItem item={item} key={item.id} />)}
              </ul>
            </nav>
          ) : null}
          <div className="puzzle-site-header__actions">
            {utilityNavigation}
            {localeSwitcher}
            {secondaryActions}
            {primaryAction}
          </div>
        </div>
        <button
          type="button"
          className="puzzle-site-header__menu-trigger"
          aria-label={mobileMenuLabel}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          {triggerContent}
        </button>
      </div>
      <Dialog
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title={mobileMenuTitle}
        closeLabel={closeLabel}
        className="puzzle-site-header__mobile-dialog"
      >
        <nav aria-label={navigationLabel}>
          <MobileItems items={items} onNavigate={() => setMobileOpen(false)} />
        </nav>
        <div className="puzzle-site-header__actions">
          {utilityNavigation}
          {localeSwitcher}
          {secondaryActions}
          {primaryAction}
        </div>
      </Dialog>
    </header>
  );
};

export { SiteHeader };
