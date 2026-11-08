import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps, FormEvent, MouseEvent, ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Button } from "../../actions/button";

import { DropdownMenu } from "./index";

const renderMenu = (
  children?: ReactNode,
  props: Partial<ComponentProps<typeof DropdownMenu>> = {},
) =>
  render(
    <DropdownMenu {...props}>
      <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {children ?? (
          <>
            <DropdownMenu.Item onSelect={vi.fn()}>Edit</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Archive</DropdownMenu.Item>
            <DropdownMenu.Item>Delete</DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>,
  );

beforeEach(() => {
  const rect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 120,
    bottom: 40,
    width: 120,
    height: 40,
    toJSON: () => ({}),
  } as DOMRect;

  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([
    rect,
  ] as unknown as DOMRectList);
});

describe("DropdownMenu", () => {
  it("renders a correctly labelled menu trigger", () => {
    renderMenu();

    const trigger = screen.getByRole("button", { name: "More actions" });

    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
  });

  it("supports fragments around its compound children", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <>
          <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>First action</DropdownMenu.Item>
          </DropdownMenu.Content>
        </>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));

    expect(await screen.findByRole("menuitem", { name: "First action" }))
      .toBeInTheDocument();
  });

  it("opens on click and moves focus to the first enabled item", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "More actions" });
    await user.click(trigger);

    const menu = await screen.findByRole("menu");
    const edit = screen.getByRole("menuitem", { name: "Edit" });

    expect(menu).toHaveAttribute("aria-labelledby", trigger.id);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(edit).toHaveFocus());
  });

  it("opens from the trigger with Enter and Space", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "More actions" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    trigger.focus();
    await user.keyboard(" ");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("opens an asChild Puzzle Button once with Space", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">More actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: "More actions" });
    trigger.focus();
    await user.keyboard(" ");

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not submit a surrounding form when native asChild buttons are used", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );

    render(
      <form id="menu-test-form" onSubmit={onSubmit}>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>More actions</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild>
              <button form="menu-test-form">Run action</button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Run action" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not open by default when an asChild trigger is disabled", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger asChild>
          <Button disabled>More actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("preserves a disabled asChild trigger", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button disabled>More actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports Enter on a non-native asChild trigger", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <div>More actions</div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: "More actions" });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("does not open when the root is disabled", async () => {
    const user = userEvent.setup();
    renderMenu(undefined, { disabled: true });

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("treats aria-disabled on the trigger as disabled", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenu.Trigger aria-disabled>More actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes an open uncontrolled menu when it becomes disabled", async () => {
    const user = userEvent.setup();
    const view = renderMenu();
    const trigger = screen.getByRole("button", { name: "More actions" });

    await user.click(trigger);
    await screen.findByRole("menu");

    view.rerender(
      <DropdownMenu disabled>
        <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );

    view.rerender(
      <DropdownMenu>
        <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles the menu when the trigger is clicked again", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "More actions" });
    await user.click(trigger);
    await screen.findByRole("menu");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("supports ArrowDown, ArrowUp, Home and End navigation", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "More actions" });
    screen.getByRole("button", { name: "More actions" }).focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("menu");

    const edit = screen.getByRole("menuitem", { name: "Edit" });
    const deleteItem = screen.getByRole("menuitem", { name: "Delete" });

    await waitFor(() => expect(edit).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{Home}");
    expect(edit).toHaveFocus();

    await user.keyboard("{End}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(edit).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("opens to the last item when triggered with ArrowUp", async () => {
    const user = userEvent.setup();
    renderMenu();

    screen.getByRole("button", { name: "More actions" }).focus();
    await user.keyboard("{ArrowUp}");
    await screen.findByRole("menu");

    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    });
  });

  it("supports typeahead and skips disabled items", async () => {
    const user = userEvent.setup();
    renderMenu(
      <>
        <DropdownMenu.Item>Apple</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Apricot</DropdownMenu.Item>
        <DropdownMenu.Item>Banana</DropdownMenu.Item>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await screen.findByRole("menu");
    await user.keyboard("b");

    expect(screen.getByRole("menuitem", { name: "Banana" })).toHaveFocus();
  });

  it("renders accessible groups, labels and separators", async () => {
    const user = userEvent.setup();
    renderMenu(
      <>
        <DropdownMenu.Label id="file-actions-label">File actions</DropdownMenu.Label>
        <DropdownMenu.Group aria-labelledby="file-actions-label">
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "More actions" }));
    await screen.findByRole("menu");

    expect(screen.getByText("File actions")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "File actions" })).toBeInTheDocument();
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("does not activate an aria-disabled menu item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu(
      <DropdownMenu.Item aria-disabled onSelect={onSelect}>
        Unavailable action
      </DropdownMenu.Item>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    const item = await screen.findByRole("menuitem", {
      name: "Unavailable action",
    });

    expect(item).toHaveAttribute("aria-disabled", "true");
    expect(item).toBeDisabled();
    await user.click(item);

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("calls onSelect and closes after selecting an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu(
      <DropdownMenu.Item onSelect={onSelect}>Rename</DropdownMenu.Item>,
    );

    const trigger = screen.getByRole("button", { name: "More actions" });
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitem", { name: "Rename" }));

    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("keeps the menu open when onSelect prevents the default action", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn((event: MouseEvent<HTMLElement>) =>
      event.preventDefault(),
    );
    renderMenu(
      <DropdownMenu.Item onSelect={onSelect}>Keep open</DropdownMenu.Item>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Keep open" }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("toggles checkbox items without closing the menu", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    renderMenu(
      <DropdownMenu.CheckboxItem
        defaultChecked={false}
        onCheckedChange={onCheckedChange}
      >
        Show toolbar
      </DropdownMenu.CheckboxItem>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    const checkbox = await screen.findByRole("menuitemcheckbox", {
      name: "Show toolbar",
    });

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("supports controlled checkbox state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    renderMenu(
      <DropdownMenu.CheckboxItem checked onCheckedChange={onCheckedChange}>
        Show toolbar
      </DropdownMenu.CheckboxItem>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    const checkbox = await screen.findByRole("menuitemcheckbox", {
      name: "Show toolbar",
    });
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("selects radio items and closes the menu", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMenu(
      <DropdownMenu.RadioGroup
        defaultValue="comfortable"
        onValueChange={onValueChange}
      >
        <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    const compact = await screen.findByRole("menuitemradio", {
      name: "Compact",
    });

    expect(
      screen.getByRole("menuitemradio", { name: "Comfortable" }),
    ).toHaveAttribute("aria-checked", "true");

    await user.click(compact);

    expect(onValueChange).toHaveBeenCalledWith("compact");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderMenu(<DropdownMenu.Item>Open</DropdownMenu.Item>, {
      open: false,
      onOpenChange,
    });

    await user.click(screen.getByRole("button", { name: "More actions" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports an element as the trigger and link-like menu items", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">More actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item asChild>
            <a href="#edit">Edit</a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("activates link-like menu items with Space", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            asChild
            onSelect={onSelect}
            onKeyDown={onKeyDown}
          >
            <a href="#edit">Edit link</a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    const item = await screen.findByRole("menuitem", { name: "Edit link" });
    item.focus();
    await user.keyboard(" ");

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "More actions" });
    await user.click(trigger);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });
});
