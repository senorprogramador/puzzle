"use client";

import { Breadcrumbs } from "@puzzle-ui/ui";
import { DashboardShell } from "../dashboard";
import type { CmsNavigationItem, CmsShellProps } from "./cms.types";

const CmsNavigation = ({
  items,
  activeId,
}: {
  items: readonly CmsNavigationItem[];
  activeId?: string;
}) => (
  <nav className="puzzle-cms-shell__navigation" aria-label="CMS navigation">
    {items.map((item) => (
      <a
        key={item.id}
        href={item.href}
        aria-current={item.id === activeId ? "page" : undefined}
      >
        {item.label}
      </a>
    ))}
  </nav>
);

export const CmsShell = ({
  children,
  title,
  description,
  navigation,
  activeNavigationId,
  breadcrumbs,
  topbar,
  actions,
  className,
}: CmsShellProps) => (
  <DashboardShell
    className={["puzzle-cms-shell", className].filter(Boolean).join(" ")}
    sidebar={
      <CmsNavigation items={navigation} activeId={activeNavigationId} />
    }
    sidebarLabel="CMS navigation"
    topbar={topbar}
  >
    <header className="puzzle-cms-shell__header">
      <div>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="puzzle-cms-shell__actions">{actions}</div> : null}
    </header>
    {children}
  </DashboardShell>
);
