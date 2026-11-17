import "./dashboard.css";

import type { DashboardHeaderProps } from "./dashboard.types";

export const DashboardHeader = ({
  title,
  description,
  eyebrow,
  actions,
  className,
}: DashboardHeaderProps) => (
  <header
    className={["puzzle-dashboard-header", className].filter(Boolean).join(" ")}
  >
    <div className="puzzle-dashboard-header__content">
      {eyebrow && (
        <p className="puzzle-dashboard-header__eyebrow">{eyebrow}</p>
      )}
      <h1 className="puzzle-dashboard-header__title">{title}</h1>
      {description && (
        <p className="puzzle-dashboard-header__description">{description}</p>
      )}
    </div>
    {actions && (
      <div className="puzzle-dashboard-header__actions">{actions}</div>
    )}
  </header>
);
