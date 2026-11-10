import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContextMenu } from "./index";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("puzzle-context-menu__anchor")
        ? new DOMRect(120, 90, 1, 1)
        : new DOMRect(0, 0, 180, 120);
    },
  );
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    function (this: HTMLElement): DOMRectList {
      const rects = [this.getBoundingClientRect()];
      return Object.assign(rects, {
        item: (index: number) => rects[index] ?? null,
      });
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const openContextMenu = (target: HTMLElement) => {
  fireEvent.contextMenu(target, {
    clientX: 120,
    clientY: 90,
  });
};

describe("ContextMenu", () => {
  it("opens from a context-menu event", async () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content aria-label="Area actions">
          <ContextMenu.Item>Edit</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    expect(
      await screen.findByRole("menu", { name: "Area actions" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("opens from a Ctrl-click", async () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>Ctrl-click area</ContextMenu.Trigger>
        <ContextMenu.Content aria-label="Area actions">
          <ContextMenu.Item>Edit</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    fireEvent.click(screen.getByText("Ctrl-click area"), {
      button: 0,
      ctrlKey: true,
      clientX: 140,
      clientY: 100,
    });

    expect(
      await screen.findByRole("menu", { name: "Area actions" }),
    ).toBeInTheDocument();
  });

  it("does not open when the root is disabled", () => {
    render(
      <ContextMenu disabled>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("calls onSelect and closes after selecting an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onSelect}>Edit</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(onSelect).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("supports controlled visibility", () => {
    const onOpenChange = vi.fn();

    render(
      <ContextMenu open={false} onOpenChange={onOpenChange}>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles an uncontrolled checkbox item", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem
            defaultChecked={false}
            onCheckedChange={onCheckedChange}
          >
            Show hidden files
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    await user.click(
      await screen.findByRole("menuitemcheckbox", {
        name: "Show hidden files",
      }),
    );

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("updates a radio group selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.RadioGroup
            value="comfortable"
            onValueChange={onValueChange}
          >
            <ContextMenu.RadioItem value="comfortable">
              Comfortable
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="compact">
              Compact
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    await user.click(
      await screen.findByRole("menuitemradio", { name: "Compact" }),
    );

    expect(onValueChange).toHaveBeenCalledWith("compact");
  });

  it("supports a submenu", async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>More options</ContextMenu.SubTrigger>
            <ContextMenu.SubContent aria-label="More options">
              <ContextMenu.Item>Sub action</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    openContextMenu(screen.getByText("Right-click area"));

    await user.click(
      await screen.findByRole("menuitem", { name: "More options" }),
    );

    expect(
      await screen.findByRole("menu", { name: "More options" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: "Sub action" }),
    ).toBeInTheDocument();
  });
});
