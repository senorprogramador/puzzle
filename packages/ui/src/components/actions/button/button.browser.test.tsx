import { cleanup, render, screen } from "@testing-library/react";
import { Theme } from "@puzzle-ui/theme";
import { afterEach, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "./index";

afterEach(cleanup);

it("preserves native keyboard activation and form submission semantics", async () => {
  const onPreview = vi.fn();
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  render(
    <><button>Before</button><form onSubmit={onSubmit}>
      <Button onClick={onPreview}>Preview</Button>
      <Button type="submit">Publish</Button>
    </form></>,
  );
  screen.getByRole("button", { name: "Before" }).focus();
  await userEvent.keyboard("{Tab}");
  expect(screen.getByRole("button", { name: "Preview" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onPreview).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();

  await userEvent.keyboard("{Tab}");
  expect(screen.getByRole("button", { name: "Publish" })).toHaveFocus();
  await userEvent.keyboard(" ");
  expect(onSubmit).toHaveBeenCalledOnce();
});

it("skips disabled/loading controls in the tab order and blocks a focused loading link", async () => {
  const onClick = vi.fn();
  render(
    <><button>Before</button><Button disabled>Disabled</Button>
      <Button href="#blocked" loading onClick={onClick}>Loading</Button><button>After</button></>,
  );
  screen.getByRole("button", { name: "Before" }).focus();
  await userEvent.keyboard("{Tab}");
  expect(screen.getByRole("button", { name: "After" })).toHaveFocus();

  const hash = window.location.hash;
  screen.getByRole("link", { name: "Loading" }).focus();
  await userEvent.keyboard("{Enter}");
  await userEvent.keyboard(" ");
  expect(onClick).not.toHaveBeenCalled();
  expect(window.location.hash).toBe(hash);
});

it("shows a visible themed keyboard focus indicator", async () => {
  render(<Theme scope="local"><button>Before</button><Button>Action</Button></Theme>);
  screen.getByRole("button", { name: "Before" }).focus();
  await userEvent.keyboard("{Tab}");
  const button = screen.getByRole("button", { name: "Action" });

  expect(button).toHaveFocus();
  expect(button.matches(":focus-visible")).toBe(true);
  expect(getComputedStyle(button).outlineStyle).toBe("solid");
  expect(parseFloat(getComputedStyle(button).outlineWidth)).toBeGreaterThan(0);
});

for (const theme of ["light", "dark"] as const) {
  for (const variant of ["primary", "secondary"] as const) {
    it(`changes only the ${variant} background on hover in ${theme} mode`, async () => {
      render(
        <Theme theme={theme} scope="local">
          <Button variant={variant} style={{ transition: "none" }}>Action</Button>
        </Theme>,
      );

      const button = screen.getByRole("button", { name: "Action" });
      const background = getComputedStyle(button).backgroundColor;
      const foreground = getComputedStyle(button).color;

      await userEvent.hover(button);

      expect(getComputedStyle(button).backgroundColor).not.toBe(background);
      expect(getComputedStyle(button).color).toBe(foreground);
      expect(getComputedStyle(button).filter).toBe("none");
    });

    for (const state of ["disabled", "loading", "disabled-link"] as const) {
      it(`keeps the ${state} ${variant} background unchanged in ${theme} mode`, async () => {
        render(
          <Theme theme={theme} scope="local">
            <Button
              variant={variant}
              disabled={state !== "loading"}
              loading={state === "loading"}
              href={state === "disabled-link" ? "/example" : undefined}
              style={{ transition: "none" }}
            >
              Action
            </Button>
          </Theme>,
        );

        const button = screen.getByRole(
          state === "disabled-link" ? "link" : "button",
          { name: "Action" },
        );
        const background = getComputedStyle(button).backgroundColor;

        await userEvent.hover(button);

        expect(getComputedStyle(button).backgroundColor).toBe(background);
        expect(getComputedStyle(button).filter).toBe("none");
      });
    }
  }
}
