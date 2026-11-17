import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { IntegrationsSection } from "./integrations";
import type {
  IntegrationItem,
  IntegrationsVariant,
} from "./integrations.types";

const variants: IntegrationsVariant[] = [
  "grid",
  "categorized",
  "featured",
  "ecosystem",
  "orbit",
  "network",
  "carousel",
  "list",
  "grouped",
  "split",
  "logo-wall",
  "connected",
];

const items: IntegrationItem[] = [
  {
    id: "slack",
    name: "Slack",
    logo: <span aria-hidden="true">S</span>,
    category: "Communication",
    description: "Send project updates to a channel.",
    href: "https://example.com/slack",
    featured: true,
  },
  {
    id: "linear",
    name: "Linear",
    logo: <span aria-hidden="true">L</span>,
    category: "Project management",
    description: "Connect issues to delivery plans.",
  },
];

afterEach(cleanup);

describe("IntegrationsSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <IntegrationsSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Slack")).toBeVisible();
  });

  it("filters integrations by query and category", async () => {
    const user = userEvent.setup();
    render(<IntegrationsSection items={items} filterable />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search integrations" }),
      "linear",
    );
    expect(screen.getByText("Linear")).toBeVisible();
    expect(screen.queryByText("Slack")).toBeNull();

    await user.clear(
      screen.getByRole("searchbox", { name: "Search integrations" }),
    );
    await user.selectOptions(screen.getByLabelText("Category"), "Communication");
    expect(screen.getByText("Slack")).toBeVisible();
    expect(screen.queryByText("Linear")).toBeNull();
  });

  it("shows a clear empty filter result and omits an empty collection", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <IntegrationsSection items={items} filterable />,
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search integrations" }),
      "unlisted",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "No integrations match your filters.",
    );

    rerender(<IntegrationsSection items={[]} filterable />);
    expect(container.querySelector(".puzzle-integrations__list")).toBeNull();
    expect(
      screen.queryByRole("searchbox", { name: "Search integrations" }),
    ).toBeNull();
  });

  it("renders large integration collections and preserves external links", () => {
    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `integration-${index}`,
      name: `Integration ${index}`,
      href: `/integrations/${index}`,
    }));
    const { container, rerender } = render(
      <IntegrationsSection items={manyItems} />,
    );

    expect(
      container.querySelectorAll(".puzzle-integrations__list > li"),
    ).toHaveLength(60);

    rerender(<IntegrationsSection items={items} />);
    expect(
      screen.getByRole("link", { name: /Slack/ }),
    ).toHaveAttribute("href", "https://example.com/slack");
  });
});
