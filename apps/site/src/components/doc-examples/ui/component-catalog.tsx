import { components } from "../../component-catalog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@puzzle-ui/ui";

import "./component-catalog.css";

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
  <ul className="puzzle-component-catalog">
    {components
      .filter((component) => component.href.startsWith(`/docs/ui/${category}/`))
      .map((component) => (
        <li key={component.href} className="puzzle-component-catalog__item">
          <Card
            as="a"
            href={component.href}
            interactive
            className="puzzle-component-catalog__card"
          >
            <CardHeader>
              <CardTitle>{component.name}</CardTitle>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
          </Card>
        </li>
      ))}
  </ul>
);
