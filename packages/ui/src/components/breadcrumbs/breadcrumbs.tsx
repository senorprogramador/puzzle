"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@puzzle/core";
import "./breadcrumbs.css";

type BreadcrumbLinkItem = {
  label: ReactNode;
  href: string;
  leadingIcon?: ReactNode;
};

type BreadcrumbCurrentItem = {
  label: ReactNode;
  leadingIcon?: ReactNode;
  href?: never;
};

type BreadcrumbItem = BreadcrumbLinkItem | BreadcrumbCurrentItem;

type BreadcrumbsOwnProps = {
  items: [...BreadcrumbLinkItem[], BreadcrumbCurrentItem];
};

type BreadcrumbsProps = BreadcrumbsOwnProps &
  Omit<ComponentPropsWithRef<"nav">, keyof BreadcrumbsOwnProps>;

const Breadcrumbs = ({
  items,
  className,
  style,
  "aria-label": ariaLabel = "Breadcrumbs",
  ...navProps
}: BreadcrumbsProps) => {
  return (
    <nav
      {...navProps}
      aria-label={ariaLabel}
      className={cn("puzzle-breadcrumbs", className)}
      style={style}
    >
      <ol className="puzzle-breadcrumbs__list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              key={index}
              className={cn(
                "puzzle-breadcrumbs__item",
                isCurrent && "puzzle-breadcrumbs__item--current",
              )}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.leadingIcon != null && (
                <span className="puzzle-breadcrumbs__icon" aria-hidden="true">
                  {item.leadingIcon}
                </span>
              )}

              {isCurrent ? (
                <span className="puzzle-breadcrumbs__label">{item.label}</span>
              ) : (
                <a className="puzzle-breadcrumbs__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumbs, type BreadcrumbItem, type BreadcrumbsProps };
