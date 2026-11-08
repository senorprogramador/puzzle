import { cleanup, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { Command, CommandDialog } from "./index";

import type { CommandItem } from "./command.types";

afterEach(() => {
  cleanup();

  document.querySelectorAll("iframe").forEach((iframe) => iframe.remove());
});

const commands: CommandItem[] = [
  {
    id: "first",
    label: "First command",
  },
  {
    id: "disabled",
    label: "Disabled command",
    disabled: true,
  },
  {
    id: "second",
    label: "Second command",
  },
];

describe("Command keyboard navigation", () => {
  it("navigates using ArrowDown", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("option", {
        name: "First command",
      }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled items using ArrowDown", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("option", {
        name: "Second command",
      }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("wraps to the first command", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowUp}");
    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("option", {
        name: "First command",
      }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("supports ArrowUp navigation", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowUp}");

    expect(
      screen.getByRole("option", {
        name: "Second command",
      }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("activates the selected command using Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Command commands={commands} onSelect={onSelect} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith(commands[0]);
  });

  it("does not activate a disabled command", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Command commands={commands} onSelect={onSelect} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith(commands[2]);

    expect(onSelect).not.toHaveBeenCalledWith(commands[1]);
  });

  it("keeps focus on the input during navigation", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowDown}");

    expect(input).toHaveFocus();
  });

  it("updates aria-activedescendant during navigation", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{ArrowDown}");

    const activeOption = screen.getByRole("option", {
      name: "First command",
    });

    expect(input).toHaveAttribute("aria-activedescendant", activeOption.id);
  });

  it("supports Ctrl+Home and Ctrl+End", async () => {
    const user = userEvent.setup();

    render(<Command commands={commands} />);

    const input = screen.getByRole("combobox");

    input.focus();

    await user.keyboard("{Control>}{End}{/Control}");

    expect(
      screen.getByRole("option", {
        name: "Second command",
      }),
    ).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Control>}{Home}{/Control}");

    expect(
      screen.getByRole("option", {
        name: "First command",
      }),
    ).toHaveAttribute("aria-selected", "true");
  });
});

describe("CommandDialog shortcut", () => {
  it("opens using Ctrl+K", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(event.defaultPrevented).toBe(true);
  });

  it("opens using Meta+K", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not open from an editable input", () => {
    const onOpenChange = vi.fn();

    render(
      <>
        <input aria-label="External input" />

        <CommandDialog
          open={false}
          onOpenChange={onOpenChange}
          commands={commands}
        />
      </>,
    );

    const input = screen.getByRole("textbox", {
      name: "External input",
    });

    input.focus();

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("ignores Shift+Ctrl+K", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("ignores Alt+Ctrl+K", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        altKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("ignores prevented keyboard events", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    event.preventDefault();

    document.dispatchEvent(event);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("ignores IME composition events", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, "isComposing", {
      value: true,
    });

    document.dispatchEvent(event);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("does not register the shortcut when shortcut is false", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        shortcut={false}
        commands={commands}
      />,
    );

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("removes the listener after unmount", () => {
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
    );

    unmount();

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("CommandDialog iframe support", () => {
  it("registers the shortcut on the iframe document", () => {
    const iframe = document.createElement("iframe");

    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentDocument;
    const iframeWindow = iframe.contentWindow;

    expect(iframeDocument).not.toBeNull();
    expect(iframeWindow).not.toBeNull();

    if (!iframeDocument || !iframeWindow) {
      iframe.remove();
      return;
    }

    const onOpenChange = vi.fn();

    const { unmount } = render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
      {
        container: iframeDocument.body,
      },
    );

    const KeyboardEventConstructor = iframeDocument?.defaultView?.KeyboardEvent;

    if (!KeyboardEventConstructor) {
      throw new Error("Iframe KeyboardEvent constructor is unavailable");
    }

    iframeDocument.dispatchEvent(
      new KeyboardEventConstructor("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).toHaveBeenCalledWith(true);

    onOpenChange.mockClear();

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();

    unmount();
    iframe.remove();
  });

  it("removes the listener from the iframe document after unmount", () => {
    const iframe = document.createElement("iframe");

    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentDocument;
    const iframeWindow = iframe.contentWindow;

    if (!iframeDocument || !iframeWindow) {
      iframe.remove();
      return;
    }

    const onOpenChange = vi.fn();

    const { unmount } = render(
      <CommandDialog
        open={false}
        onOpenChange={onOpenChange}
        commands={commands}
      />,
      {
        container: iframeDocument.body,
      },
    );

    unmount();

    const KeyboardEventConstructor = iframeDocument?.defaultView?.KeyboardEvent;

    if (!KeyboardEventConstructor) {
      throw new Error("Iframe KeyboardEvent constructor is unavailable");
    }

    iframeDocument.dispatchEvent(
      new KeyboardEventConstructor("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onOpenChange).not.toHaveBeenCalled();

    iframe.remove();
  });
});
