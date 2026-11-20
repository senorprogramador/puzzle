import { components } from "../../component-catalog";

type ComponentCategory =
  | "actions"
  | "data-display"
  | "editors"
  | "forms"
  | "layout"
  | "navigation"
  | "overlays"
  | "typography"
  | "utilities";

export const UIComponentCatalog = ({
  category,
}: {
  category: ComponentCategory;
}) => (
  <ul>
    {components
      .filter((component) => component.href.startsWith(`/docs/ui/${category}/`))
      .map((component) => (
        <li key={component.href}>
          <a href={component.href}>{component.name}</a>: {component.description}
        </li>
      ))}
  </ul>
);
