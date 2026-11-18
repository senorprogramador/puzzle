import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeShowcaseSection } from "./code-showcase";
import type {
  CodeShowcaseVariant,
  CodeSnippet,
} from "./code-showcase.types";

const variants: CodeShowcaseVariant[] = [
  "single",
  "tabs",
  "split",
  "editor",
  "terminal",
  "multi-language",
  "numbered",
  "comparison",
  "installation",
  "playground",
  "featured",
  "compact",
];

const snippets: CodeSnippet[] = [
  {
    id: "typescript",
    title: "Create a project",
    language: "typescript",
    filename: "create-project.ts",
    code: 'const project = await createProject("launch");\nconsole.log(project.id);',
    highlightedLines: [2],
  },
  {
    id: "shell",
    title: "Install",
    language: "bash",
    code: "bun add @acme/sdk",
  },
];

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);

afterEach(() => {
  cleanup();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
  vi.restoreAllMocks();
});

describe("CodeShowcaseSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const items = variant === "single" ? snippets.slice(0, 1) : snippets;
    const { container } = render(
      <CodeShowcaseSection variant={variant} items={items} copyable={false} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    if (variant === "playground") {
      expect(
        screen.getByRole("textbox", {
          name: "Edit Create a project code",
        }),
      ).toHaveValue(snippets[0]?.code);
    } else {
      expect(
        screen.getByText('const project = await createProject("launch");'),
      ).toBeVisible();
    }
  });

  it("copies the current snippet and announces feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const onCopy = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <CodeShowcaseSection
        variant="compact"
        items={snippets}
        onCopy={onCopy}
      />,
    );
    const copyButton = screen.getByRole("button", {
      name: "Copy Create a project code",
    });
    const panel = copyButton.closest<HTMLElement>(
      ".puzzle-code-showcase__panel",
    );
    if (!panel) {
      throw new Error("Code panel not found.");
    }
    await user.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(snippets[0]?.code);
      expect(within(panel).getByRole("status")).toHaveTextContent(
        "Code copied to clipboard.",
      );
    });
    expect(onCopy).toHaveBeenCalledWith(snippets[0]?.code);
  });

  it("announces clipboard failures and makes the code available for manual copying", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    const onCopyError = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<CodeShowcaseSection items={[snippets[0]!]} onCopyError={onCopyError} />);
    await user.click(
      screen.getByRole("button", { name: "Copy Create a project code" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Could not copy. Select and copy the code manually.",
      );
    });
    expect(onCopyError).toHaveBeenCalled();
    expect(screen.getByText(/createProject/)).toBeVisible();
  });

  it("uses accessible keyboard-operable language tabs and optional line numbers", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CodeShowcaseSection variant="multi-language" items={snippets} />,
    );
    expect(container.querySelector("code")).not.toHaveAttribute("lang");
    const firstTab = screen.getByRole("tab", { name: "typescript" });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "bash" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const numbered = render(
      <CodeShowcaseSection variant="numbered" items={[snippets[0]!]} />,
    );
    expect(
      numbered.container.querySelectorAll(".puzzle-code-showcase__line-number"),
    ).toHaveLength(2);
    expect(container.querySelector('[data-language="bash"]')).not.toBeNull();
  });

  it("supports editing in the lightweight playground and handles empty or large collections", () => {
    const { container, rerender } = render(
      <CodeShowcaseSection variant="playground" items={[snippets[0]!]} />,
    );
    const editor = screen.getByRole("textbox", {
      name: "Edit Create a project code",
    });
    fireEvent.change(editor, { target: { value: "let updated = true;" } });
    expect(editor).toHaveValue("let updated = true;");

    rerender(<CodeShowcaseSection items={[]} />);
    expect(container.querySelector(".puzzle-code-showcase__panel")).toBeNull();

    const manySnippets = Array.from({ length: 60 }, (_, index) => ({
      id: `snippet-${index}`,
      language: "text",
      code: `line ${index}`,
    }));
    rerender(
      <CodeShowcaseSection
        variant="compact"
        items={manySnippets}
        copyable={false}
      />,
    );
    expect(
      container.querySelectorAll(".puzzle-code-showcase__panel"),
    ).toHaveLength(60);
  });

  it("requires exactly one snippet in the single variant", () => {
    expect(() =>
      render(<CodeShowcaseSection variant="single" items={snippets} />),
    ).toThrow('The "single" code showcase variant accepts exactly one snippet.');
  });
});
