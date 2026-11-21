import { Card, CardDescription, CardHeader, CardTitle } from "@puzzle-ui/ui";
import { source } from "../../../lib/source";
import { getPiecesCatalogEntries } from "./catalog-data";

import "../ui/component-catalog.css";

export const PiecesComponentCatalog = () => {
  const components = getPiecesCatalogEntries().map((component) => {
    const slug = component.href.slice("/docs/".length).split("/");
    const description = source.getPage(slug)?.data.description;

    if (!description) {
      throw new Error(`Missing Pieces documentation description for ${component.href}.`);
    }

    return { ...component, description };
  });

  return (
    <ul className="puzzle-component-catalog">
      {components.map((component) => (
        <li key={component.href} className="puzzle-component-catalog__item">
          <Card
            as="a"
            href={component.href}
            interactive
            className="puzzle-component-catalog__card"
          >
            <CardHeader>
              <CardTitle>{component.label}</CardTitle>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
};
