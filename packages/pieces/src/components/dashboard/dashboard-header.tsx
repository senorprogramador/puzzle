import { Heading, Text } from "@puzzle-ui/ui";
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
        <Text as="p" className="puzzle-dashboard-header__eyebrow">{eyebrow}</Text>
      )}
      <Heading level="headline1" as="h1" className="puzzle-dashboard-header__title">{title}</Heading>
      {description && (
        <Text as="p" className="puzzle-dashboard-header__description">{description}</Text>
      )}
    </div>
    {actions && (
      <div className="puzzle-dashboard-header__actions">{actions}</div>
    )}
  </header>
);
