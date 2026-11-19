import { Heading } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  EditorialCategory,
  EditorialDate,
  validateContentIds,
} from "../shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import type {
  ChangelogRelease,
  ChangelogSectionProps,
  ChangelogSectionVariant,
} from "./changelog-section.types";
import "./changelog-section.css";

const ReleaseCard = ({
  release,
  compact = false,
  heading = "h3",
}: {
  release: ChangelogRelease;
  compact?: boolean;
  heading?: "h3" | "h4";
}) => {
  const Heading = heading;

  return (
    <article
      className="puzzle-changelog-section__release"
      data-featured={release.featured || undefined}
      data-compact={compact || undefined}
    >
      <header className="puzzle-changelog-section__release-header">
        <Heading>
          {release.href ? (
            <a href={release.href}>{release.version}</a>
          ) : (
            release.version
          )}
        </Heading>
        <div className="puzzle-changelog-section__meta">
          {release.type ? (
            <EditorialCategory>{release.type}</EditorialCategory>
          ) : null}
          {release.date ? <EditorialDate date={release.date} /> : null}
        </div>
      </header>
      {release.description ? (
        <div className="puzzle-changelog-section__description">
          {release.description}
        </div>
      ) : null}
      {release.categories?.length ? (
        <ul className="puzzle-changelog-section__categories">
          {release.categories.map((category, index) => (
            <li key={`${release.id}-${category.name}-${index}`}>
              <strong>{category.name}</strong>
              {category.changes?.length ? (
                <ul>
                  {category.changes.map((change, changeIndex) => (
                    <li key={`${release.id}-${index}-${changeIndex}`}>
                      {change}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};

const getFeaturedRelease = (
  items: readonly ChangelogRelease[],
  featuredRelease?: ChangelogRelease,
) =>
  featuredRelease ?? items.find((release) => release.featured) ?? items[0];

const getReleases = (
  items: readonly ChangelogRelease[],
  featuredRelease?: ChangelogRelease,
) => {
  if (!featuredRelease) {
    return items;
  }

  return [
    featuredRelease,
    ...items.filter((release) => release.id !== featuredRelease.id),
  ];
};

const getYear = (date: string | undefined) => {
  if (!date) {
    return "Undated";
  }

  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? "Undated"
    : String(value.getUTCFullYear());
};

const groupBy = (
  items: readonly ChangelogRelease[],
  getKey: (release: ChangelogRelease) => string,
) => {
  const groups = new Map<string, ChangelogRelease[]>();

  for (const release of items) {
    const key = getKey(release);
    groups.set(key, [...(groups.get(key) ?? []), release]);
  }

  return [...groups];
};

const renderGrouped = (items: readonly ChangelogRelease[]) => (
  <div className="puzzle-changelog-section__groups">
    {groupBy(items, (release) => release.group ?? getYear(release.date)).map(
      ([group, releases]) => (
        <section key={group} className="puzzle-changelog-section__group">
          <Heading level="headline3" as="h3">{group}</Heading>
          <ol>
            {releases.map((release) => (
              <li key={release.id}>
                <ReleaseCard release={release} heading="h4" />
              </li>
            ))}
          </ol>
        </section>
      ),
    )}
  </div>
);

const renderByCategory = (items: readonly ChangelogRelease[]) => {
  const categorized = groupBy(items, (release) =>
    release.categories?.[0]?.name ?? "Other changes",
  );

  return (
    <div className="puzzle-changelog-section__groups">
      {categorized.map(([category, releases]) => (
        <section key={category} className="puzzle-changelog-section__group">
          <Heading level="headline3" as="h3">{category}</Heading>
          <ol>
            {releases.map((release) => (
              <li key={release.id}>
                <ReleaseCard release={release} heading="h4" />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};

const renderFeatured = (
  items: readonly ChangelogRelease[],
  featuredRelease?: ChangelogRelease,
) => {
  const releases = getReleases(items, featuredRelease);
  const featured = getFeaturedRelease(releases, featuredRelease);

  if (!featured) {
    return null;
  }

  return (
    <div className="puzzle-changelog-section__featured">
      <ReleaseCard release={featured} />
      {releases.length > 1 ? (
        <ol className="puzzle-changelog-section__supporting">
          {releases
            .filter((release) => release.id !== featured.id)
            .map((release) => (
              <li key={release.id}>
                <ReleaseCard release={release} compact heading="h4" />
              </li>
            ))}
        </ol>
      ) : null}
    </div>
  );
};

const ChangelogSection = <C extends ElementType = "section">({
  variant = "timeline",
  items,
  featuredRelease,
  children,
  className,
  ...sectionProps
}: ChangelogSectionProps<C>) => {
  validateContentIds(items, "Changelog release");
  if (featuredRelease) {
    validateContentIds([featuredRelease], "Featured changelog release");
  }

  const releases = getReleases(items, featuredRelease);
  let content = releases.length ? (
    <ol
      className="puzzle-changelog-section__items"
      aria-label="Product releases"
      tabIndex={variant === "horizontal" ? 0 : undefined}
    >
      {releases.map((release) => (
        <li key={release.id}>
          <ReleaseCard
            release={release}
            compact={variant === "compact"}
          />
        </li>
      ))}
    </ol>
  ) : null;

  if (variant === "grouped" && releases.length) {
    content = renderGrouped(releases);
  } else if (variant === "categories" && releases.length) {
    content = renderByCategory(releases);
  } else if (
    (variant === "featured" || variant === "split") &&
    releases.length
  ) {
    content = renderFeatured(items, featuredRelease);
  }

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-changelog-section ${className ?? ""}`.trim()}
      family="changelog"
      variant={variant satisfies ChangelogSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { ChangelogSection };
