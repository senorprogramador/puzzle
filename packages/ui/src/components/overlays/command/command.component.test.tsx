import { cleanup, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { Command } from "./index";

import type { CommandItem } from "./command.types";

afterEach(cleanup);

const commands: CommandItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    group: "Navigation",
  },
  {
    id: "settings",
    label: "Settings",
    group: "Navigation",
    keywords: ["preferences"],
  },
  {
    id: "disabled",
    label: "Disabled command",
    disabled: true,
  },
];

describe("Command", () => {
  it("renders the search input", () => {
    render(<Command commands={commands} />);

    expect(
      screen.getByRole("combobox", {
        name: "Search commands",
      }),
    ).toBeInTheDocument();
  });

  it("renders commands", () => {
    render(<Command commands={commands} />);

    expect(
      screen.getByRole("option", {
        name: "Dashboard",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Settings",
      }),
    ).toBeInTheDocument();
  });

  it("renders command groups", () => {
    render(<Command commands={commands} />);

    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("filters commands by label", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    await user.type(screen.getByRole("combobox"), "dashboard");

    expect(
      screen.getByRole("option", {
        name: "Dashboard",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: "Settings",
      }),
    ).not.toBeInTheDocument();
  });

  it("filters commands by keyword", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    await user.type(screen.getByRole("combobox"), "preferences");

    expect(
      screen.getByRole("option", {
        name: "Settings",
      }),
    ).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    render(<Command commands={[]} />);

    expect(screen.getAllByText("No commands found.")).toHaveLength(2);
  });

  it("supports a custom empty message", () => {
    render(<Command commands={[]} emptyMessage="Nothing here" />);

    expect(screen.getAllByText("Nothing here")).toHaveLength(2);
  });

  it("supports loading state", () => {
    render(
      <Command commands={commands} loading loadingMessage="Loading commands" />,
    );

    expect(screen.getAllByText("Loading commands")).toHaveLength(2);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
  });

  it("calls command onSelect when clicked", async () => {
    const user = userEvent.setup();
    const commandOnSelect = vi.fn();

    render(
      <Command
        commands={[
          {
            id: "dashboard",
            label: "Dashboard",
            onSelect: commandOnSelect,
          },
        ]}
      />,
    );

    await user.click(
      screen.getByRole("option", {
        name: "Dashboard",
      }),
    );

    expect(commandOnSelect).toHaveBeenCalledTimes(1);
  });

  it("calls component onSelect when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Command commands={commands} onSelect={onSelect} />);

    await user.click(
      screen.getByRole("option", {
        name: "Dashboard",
      }),
    );

    expect(onSelect).toHaveBeenCalledWith(commands[0]);
  });

  it("does not select disabled commands", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Command commands={commands} onSelect={onSelect} />);

    await user.click(
      screen.getByRole("option", {
        name: "Disabled command",
      }),
    );

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("supports controlled query", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();

    render(
      <Command commands={commands} query="" onQueryChange={onQueryChange} />,
    );

    await user.type(screen.getByRole("combobox"), "dashboard");

    expect(onQueryChange).toHaveBeenCalledWith("d");
    expect(onQueryChange).toHaveBeenCalledWith("a");
  });

  it("supports custom filtering", async () => {
    const user = userEvent.setup();

    render(
      <Command
        commands={commands}
        filter={(command, query) => command.id.startsWith(query)}
      />,
    );

    await user.type(screen.getByRole("combobox"), "set");

    expect(
      screen.getByRole("option", {
        name: "Settings",
      }),
    ).toBeInTheDocument();
  });

  it("supports default query", () => {
    render(<Command commands={commands} defaultQuery="settings" />);

    expect(screen.getByRole("combobox")).toHaveValue("settings");

    expect(
      screen.getByRole("option", {
        name: "Settings",
      }),
    ).toBeInTheDocument();
  });

  it("supports disabled items through ARIA", () => {
    render(<Command commands={commands} />);

    expect(
      screen.getByRole("option", {
        name: "Disabled command",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("does not select a command when no item is active", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Command commands={commands} onSelect={onSelect} />);

    await user.keyboard("{Enter}");

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("exposes listbox semantics", () => {
    render(<Command commands={commands} />);

    expect(
      screen.getByRole("listbox", {
        name: "Commands",
      }),
    ).toBeInTheDocument();
  });

  it("exposes combobox ARIA attributes", () => {
    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("aria-autocomplete", "list");

    expect(input).toHaveAttribute("aria-controls");

    expect(input).toHaveAttribute("aria-expanded", "true");
  });
});
