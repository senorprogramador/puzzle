import { validateContentIds } from "../content/shared";
import type {
  AccommodationFeature,
  AccommodationStats,
} from "./accommodation.types";
import "./accommodation.shared.css";

export const validateAccommodationStats = (
  stats: AccommodationStats,
  label: string,
) => {
  const values: readonly [string, number | undefined][] = [
    ["capacity", stats.capacity],
    ["bedrooms", stats.bedrooms],
    ["beds", stats.beds],
    ["bathrooms", stats.bathrooms],
  ];

  for (const [name, value] of values) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value < 0)) {
      throw new RangeError(
        `${label} ${name} must be a non-negative safe integer.`,
      );
    }
  }
};

export const validateAccommodationFeatures = (
  features: readonly AccommodationFeature[] | undefined,
  label: string,
) => {
  if (features) {
    validateContentIds(features, label);
  }
};

export const AccommodationStatsList = ({
  stats,
  className,
}: {
  stats: AccommodationStats;
  className?: string;
}) => {
  const entries: readonly [keyof AccommodationStats, string][] = [
    ["capacity", "Guests"],
    ["bedrooms", "Bedrooms"],
    ["beds", "Beds"],
    ["bathrooms", "Bathrooms"],
  ];
  const values = entries.filter(([key]) => stats[key] !== undefined);

  return values.length ? (
    <dl className={`puzzle-accommodation-stats ${className ?? ""}`.trim()}>
      {values.map(([key, label]) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>{stats[key]}</dd>
        </div>
      ))}
    </dl>
  ) : null;
};

export const AccommodationFeatureList = ({
  items,
  className,
}: {
  items: readonly AccommodationFeature[];
  className?: string;
}) =>
  items.length ? (
    <ul className={`puzzle-accommodation-features ${className ?? ""}`.trim()}>
      {items.map((item) => (
        <li key={item.id}>
          {item.icon ? (
            <span className="puzzle-accommodation-features__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <div className="puzzle-accommodation-features__copy">
            <span>{item.label}</span>
            {item.description ? <p>{item.description}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  ) : null;
