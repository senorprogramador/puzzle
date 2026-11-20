import { pieces } from "../../layout/sidebar/pieces";

type NavigationItem = {
  label: unknown;
  href?: string;
  children?: readonly NavigationItem[];
};

const categoryOverviews = new Set([
  "marketing",
  "saas-product",
  "commerce",
  "content",
  "business",
  "application-dashboard",
  "specialized-interactive",
]);
const nonSectionPages = new Set([
  "accommodation-discovery",
  "boutique-bnb",
  "data-display",
  "feedback",
  "hero",
  "hospitality-overview",
  "hospitality-booking-flow",
  "navigation",
  "project",
  "restaurant-experience",
]);

const flattenNavigation = (item: NavigationItem): NavigationItem[] => [
  item,
  ...(item.children ?? []).flatMap(flattenNavigation),
];

const isComponentEntry = (
  item: NavigationItem,
): item is NavigationItem & { href: string; label: string } => {
  if (typeof item.label !== "string") return false;
  if (!item.href?.startsWith("/docs/pieces/components/")) return false;
  const slug = item.href.slice("/docs/pieces/components/".length);
  return !categoryOverviews.has(slug) && !nonSectionPages.has(slug);
};

export const getPiecesCatalogEntries = () =>
  flattenNavigation(pieces)
    .filter(isComponentEntry)
    .sort((left, right) => left.label.localeCompare(right.label))
    .map(({ label, href }) => ({ label, href }));

export const PiecesComponentCatalog = () => (
  <ul>
    {getPiecesCatalogEntries().map((component) => (
      <li key={component.href}>
        <a href={component.href}>{component.label}</a>
      </li>
    ))}
  </ul>
);
