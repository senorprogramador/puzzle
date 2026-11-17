"use client";

import { useEffect, useState, type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type { StatItem, StatsSectionProps } from "./stats.types";
import "./stats.css";

const AnimatedValue = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) {
      setDisplayValue(value);
      return;
    }

    const startedAt = performance.now();
    const duration = 600;
    let frame = 0;
    const update = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      setDisplayValue(Math.round(value * progress * 100) / 100);
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        window.cancelAnimationFrame(frame);
        setDisplayValue(value);
      }
    };
    preference.addEventListener("change", handlePreferenceChange);

    return () => {
      window.cancelAnimationFrame(frame);
      preference.removeEventListener("change", handlePreferenceChange);
    };
  }, [value]);

  return <>{displayValue}</>;
};

const StatContent = ({
  item,
  animated,
}: {
  item: StatItem;
  animated: boolean;
}) => (
  <article className="puzzle-stats__item" data-featured={item.featured || undefined}>
    <div className="puzzle-stats__value" aria-live="off">
      {item.prefix}
      {animated && typeof item.value === "number" ? (
        <AnimatedValue value={item.value} />
      ) : (
        item.value
      )}
      {item.suffix}
    </div>
    <h3>{item.label}</h3>
    {item.description ? <p>{item.description}</p> : null}
    {item.trend ? (
      <p className="puzzle-stats__trend" data-direction={item.trend.direction}>
        {item.trend.label}
      </p>
    ) : null}
    {typeof item.progress === "number" ? (
      <progress
        max={100}
        value={Math.min(100, Math.max(0, item.progress))}
        aria-label={`${typeof item.label === "string" ? item.label : item.id} progress`}
      />
    ) : null}
  </article>
);

const StatsSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  children,
  className,
  ...sectionProps
}: StatsSectionProps<C>) => (
  <MarketingSection<C>
    {...(sectionProps as MarketingSectionBaseProps<C>)}
    className={`puzzle-stats ${className ?? ""}`.trim()}
    family="stats"
    variant={variant}
  >
    {items.length ? (
      <ul className="puzzle-stats__list">
        {items.map((item) => (
          <li key={item.id}>
            <StatContent item={item} animated={variant === "animated"} />
          </li>
        ))}
      </ul>
    ) : null}
    {children}
  </MarketingSection>
);

export { StatsSection };
