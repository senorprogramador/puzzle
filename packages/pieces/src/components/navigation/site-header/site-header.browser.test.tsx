import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { SiteHeader } from "./index";

describe("SiteHeader (browser)", () => {
  it("opens and closes the accessible mobile menu", async () => {
    render(
      <SiteHeader
        logo={<strong>Willow & Tide</strong>}
        items={[{ id: "stay", label: "Stay", href: "#stay" }]}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Website navigation" })).toBeVisible();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Website navigation" })).toBeNull();
    });
  });
});
