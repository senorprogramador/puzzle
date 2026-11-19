import { Heading, Text } from "@puzzle-ui/ui";
import { useId, type ReactNode } from "react";

import "./data-display.css";

export type MetricComparisonProps = {
  title: ReactNode;
  primaryLabel: ReactNode;
  primaryValue: ReactNode;
  comparisonLabel: ReactNode;
  comparisonValue: ReactNode;
  description?: ReactNode;
  className?: string;
};

export const MetricComparison = ({
  title,
  primaryLabel,
  primaryValue,
  comparisonLabel,
  comparisonValue,
  description,
  className,
}: MetricComparisonProps) => {
  const titleId = useId();

  return (
    <section
      className={["puzzle-metric-comparison", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
    >
      <Heading level="headline2" as="h2" id={titleId} className="puzzle-metric-comparison__title">
        {title}
      </Heading>
      {description && (
        <Text as="p" className="puzzle-metric-comparison__description">{description}</Text>
      )}
      <dl className="puzzle-metric-comparison__values">
        <div className="puzzle-metric-comparison__value" data-primary="true">
          <dt>{primaryLabel}</dt>
          <dd>{primaryValue}</dd>
        </div>
        <div className="puzzle-metric-comparison__value">
          <dt>{comparisonLabel}</dt>
          <dd>{comparisonValue}</dd>
        </div>
      </dl>
    </section>
  );
};
