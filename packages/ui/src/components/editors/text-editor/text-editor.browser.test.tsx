import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { TextEditor } from "./index";
import { createTextDocument } from "./text-document";
import { TextEditorToolbar } from "./text-editor-toolbar";
import type { TextDocument } from "./text-editor.types";

afterEach(cleanup);

const getPlainText = (document: TextDocument | undefined) =>
  document?.content
    .map((block) => block.children.map((inline) => inline.text).join(""))
    .join("\n");

describe("TextEditor (browser)", () => {
  it("synchronizes native typing and handles keyboard undo and redo", async () => {
    let latestDocument: TextDocument | undefined;
    const onChange = vi.fn((document: TextDocument) => {
      latestDocument = document;
    });
    const defaultValue: TextDocument = {
      type: "doc",
      content: [
        {
          type: "heading",
          variant: "headline4",
          headingLevel: 2,
          children: [{ text: "Hello" }],
        },
      ],
    };

    render(
      <TextEditor
        defaultValue={defaultValue}
        onChange={onChange}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const inputTypes: string[] = [];
    editor.addEventListener("beforeinput", (event) => {
      inputTypes.push((event as InputEvent).inputType);
    });
    await userEvent.click(editor);
    await userEvent.keyboard("{Control>}{End}{/Control}");
    await userEvent.type(editor, " world");

    await waitFor(() =>
      expect(getPlainText(latestDocument)).toBe("Hello world"),
    );
    expect(latestDocument?.content[0]?.headingLevel).toBe(2);
    expect(inputTypes).toEqual(Array(6).fill("insertText"));
    expect(window.getSelection()?.focusOffset).toBe("Hello world".length);

    await userEvent.keyboard("{Control>}z{/Control}");
    await waitFor(() => expect(getPlainText(latestDocument)).toBe("Hello"));

    await userEvent.keyboard("{Control>}{Shift>}z{/Shift}{/Control}");
    await waitFor(() =>
      expect(getPlainText(latestDocument)).toBe("Hello world"),
    );
  });

  it("exits a list when Enter is pressed in an empty list item", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        defaultValue={{
          type: "doc",
          content: [
            {
              type: "listItem",
              variant: "body1",
              listType: "bullet",
              children: [],
            },
          ],
        }}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(latestDocument?.content[0]?.type).toBe("paragraph");
      expect(latestDocument?.content[0]?.listType).toBeUndefined();
    });
  });

  it("preserves selected formatting and supports toolbar history actions", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("Hello")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    const text = editor.querySelector("span")!.firstChild!;
    const range = editor.ownerDocument.createRange();
    range.selectNodeContents(text);
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    expect(window.getSelection()?.toString()).toBe("Hello");
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));

    await waitFor(() =>
      expect(latestDocument?.content[0]?.children[0]?.marks).toEqual(["bold"]),
    );

    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() =>
      expect(latestDocument?.content[0]?.children[0]?.marks).toBeUndefined(),
    );

    await userEvent.click(screen.getByRole("button", { name: "Redo" }));
    await waitFor(() =>
      expect(latestDocument?.content[0]?.children[0]?.marks).toEqual(["bold"]),
    );
  });

  it("applies a link to the selected text after interacting with the popover", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("Hello world")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const linkButton = screen.getByRole("button", { name: "Link" });
    expect(linkButton).toBeDisabled();
    await userEvent.click(editor);
    const text = editor.querySelector("span")!.firstChild!;
    const range = editor.ownerDocument.createRange();
    range.setStart(text, 6);
    range.setEnd(text, 11);
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    await waitFor(() => expect(linkButton).toBeEnabled());

    await userEvent.click(linkButton);
    const dialog = await screen.findByRole("dialog", { name: "Link settings" });
    const input = screen.getByRole("textbox", { name: "Link URL" });
    const applyButton = screen.getByRole("button", { name: "Apply link" });
    expect(dialog).toContainElement(input);
    expect(applyButton).toHaveClass("puzzle-button--primary");
    const inputRect = input.getBoundingClientRect();
    const buttonRect = applyButton.getBoundingClientRect();
    expect(buttonRect.left).toBeGreaterThanOrEqual(inputRect.right);
    expect(buttonRect.bottom).toBeCloseTo(inputRect.bottom, 0);
    await userEvent.type(input, "https://example.com");
    await userEvent.click(applyButton);

    await waitFor(() =>
      expect(latestDocument?.content[0]?.children).toEqual([
        { text: "Hello " },
        { text: "world", link: { href: "https://example.com" } },
      ]),
    );
    expect(screen.queryByRole("dialog", { name: "Link settings" })).not.toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe("world");
    selection.collapse(editor.querySelector("a")!.firstChild!, 2);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    await waitFor(() => expect(linkButton).toBeDisabled());
  });

  it("returns focus and selection to the editor when cancelling a link", async () => {
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("Hello")}
      />,
    );
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    const text = editor.querySelector("span")!.firstChild!;
    const range = editor.ownerDocument.createRange();
    range.selectNodeContents(text);
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    const linkButton = screen.getByRole("button", { name: "Link" });
    await waitFor(() => expect(linkButton).toBeEnabled());

    await userEvent.click(linkButton);
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    expect(editor).toHaveFocus();
    expect(window.getSelection()?.toString()).toBe("Hello");
  });
});
