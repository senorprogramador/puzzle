import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Editor, type TextEditorHandle } from "./editor";
import { TextEditor, useTextEditor } from "./index";
import { TextEditorToolbar } from "./text-editor-toolbar";
import { createTextDocument } from "./text-document";
import type { TextDocument, TextSelection } from "./text-editor.types";

afterEach(cleanup);

const selectText = (root: HTMLElement, from: number, to: number) => {
  const text = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
  ).nextNode() as Text;
  const range = root.ownerDocument.createRange();
  range.setStart(text, from);
  range.setEnd(text, to);

  const selection = root.ownerDocument.defaultView!.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  fireEvent(root.ownerDocument, new Event("selectionchange"));
};

describe("Editor transactions", () => {
  it("renders a large block document without dropping content", () => {
    const document: TextDocument = {
      type: "doc",
      content: Array.from({ length: 1000 }, (_, index) => ({
        type: "paragraph" as const,
        variant: "body1" as const,
        children: [{ text: `Paragraph ${index}` }],
      })),
    };
    const { container } = render(<Editor defaultValue={document} />);

    expect(
      container.querySelectorAll("[data-puzzle-editor-block]"),
    ).toHaveLength(1000);
    expect(container).toHaveTextContent("Paragraph 999");
  });

  it("does not re-emit unchanged selection updates", () => {
    const onSelectionChange = vi.fn();
    render(
      <Editor
        defaultValue={createTextDocument("Selection")}
        onSelectionChange={onSelectionChange}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const text = editor.querySelector("span")!.firstChild!;
    editor.focus();
    const selection = editor.ownerDocument.getSelection()!;
    selection.collapse(text, 3);
    fireEvent(editor.ownerDocument, new Event("selectionchange"));
    const count = onSelectionChange.mock.calls.length;

    fireEvent(editor.ownerDocument, new Event("selectionchange"));
    fireEvent(editor.ownerDocument, new Event("selectionchange"));

    expect(onSelectionChange).toHaveBeenCalledTimes(count);
  });

  it("does not rerender a custom toolbar for unchanged selection events", async () => {
    let toolbarRenders = 0;
    const ToolbarProbe = () => {
      useTextEditor();
      toolbarRenders += 1;
      return null;
    };
    render(
      <TextEditor
        toolbar={<ToolbarProbe />}
        defaultValue={createTextDocument("Toolbar")}
      />,
    );

    await act(async () => {});
    const initialRenders = toolbarRenders;
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const text = editor.querySelector("span")!.firstChild!;
    editor.focus();
    const selection = editor.ownerDocument.getSelection()!;
    selection.collapse(text, 3);
    fireEvent(editor.ownerDocument, new Event("selectionchange"));
    await waitFor(() => expect(toolbarRenders).toBeGreaterThan(initialRenders));
    const updatedRenders = toolbarRenders;

    act(() => {
      fireEvent(editor.ownerDocument, new Event("selectionchange"));
      fireEvent(editor.ownerDocument, new Event("selectionchange"));
    });
    expect(toolbarRenders).toBe(updatedRenders);
  });

  it("exposes text statistics and applies replace-all as one undoable command", () => {
    const ref = createRef<TextEditorHandle>();
    render(
      <Editor
        ref={ref}
        defaultValue={createTextDocument("Draft draftling DRAFT")}
      />,
    );

    expect(ref.current!.getTextStatistics()).toEqual({
      wordCount: 3,
      characterCount: 21,
    });
    expect(ref.current!.findText("draft", { wholeWord: true })).toHaveLength(2);
    act(() => ref.current!.replaceAllText("draft", "ready", { wholeWord: true }));
    expect(ref.current!.getDocument().content[0]?.children[0]?.text)
      .toBe("ready draftling ready");

    act(() => ref.current!.undo());
    expect(ref.current!.getDocument().content[0]?.children[0]?.text)
      .toBe("Draft draftling DRAFT");
  });

  it("server-renders a stable read-only editor shell without browser globals", () => {
    const markup = renderToString(
      <TextEditor
        readOnly
        defaultValue={createTextDocument("Server content")}
        toolbar={<TextEditorToolbar />}
      />,
    );

    expect(markup).toContain('role="textbox"');
    expect(markup).toContain('aria-readonly="true"');
  });

  it("keeps the selection through formatting, undo, and redo", () => {
    const ref = createRef<TextEditorHandle>();
    render(<Editor ref={ref} defaultValue={createTextDocument("Hello")} />);

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const selection: TextSelection = {
      anchor: { block: 0, offset: 1 },
      focus: { block: 0, offset: 4 },
    };

    act(() => selectText(editor, 1, 4));
    expect(ref.current!.getSelection()).toEqual(selection);

    act(() => ref.current!.setTextAlign("center"));
    expect(ref.current!.getDocument().content[0]!.align).toBe("center");
    expect(ref.current!.getSelection()).toEqual(selection);
    expect(editor.ownerDocument.defaultView!.getSelection()!.anchorOffset).toBe(
      1,
    );
    expect(editor.ownerDocument.defaultView!.getSelection()!.focusOffset).toBe(
      4,
    );

    act(() => ref.current!.undo());
    expect(ref.current!.getDocument().content[0]!.align).toBeUndefined();
    expect(ref.current!.getSelection()).toEqual(selection);

    act(() => ref.current!.redo());
    expect(ref.current!.getDocument().content[0]!.align).toBe("center");
    expect(ref.current!.getSelection()).toEqual(selection);
  });

  it("preserves selection for structurally equal controlled values", () => {
    const ref = createRef<TextEditorHandle>();
    const { rerender } = render(
      <Editor ref={ref} value={createTextDocument("Hello")} />,
    );
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const selection: TextSelection = {
      anchor: { block: 0, offset: 1 },
      focus: { block: 0, offset: 4 },
    };

    act(() => selectText(editor, 1, 4));
    expect(ref.current!.getSelection()).toEqual(selection);

    rerender(<Editor ref={ref} value={createTextDocument("Hello")} />);

    expect(ref.current!.getSelection()).toEqual(selection);
  });

  it("applies changed controlled values without emitting another change", () => {
    const ref = createRef<TextEditorHandle>();
    const onChange = vi.fn();
    const { rerender } = render(
      <Editor
        ref={ref}
        value={createTextDocument("Before")}
        onChange={onChange}
      />,
    );

    rerender(
      <Editor
        ref={ref}
        value={createTextDocument("After")}
        onChange={onChange}
      />,
    );

    expect(ref.current!.getDocument().content[0]!.children[0]!.text).toBe(
      "After",
    );
    expect(ref.current!.getSelection()).toEqual({
      anchor: { block: 0, offset: 0 },
      focus: { block: 0, offset: 0 },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports Tiptap's strike shortcut and preserves the existing alias", () => {
    const ref = createRef<TextEditorHandle>();
    render(<Editor ref={ref} defaultValue={createTextDocument("Hello")} />);
    const editor = screen.getByRole("textbox", { name: "Text editor" });

    const strike = new KeyboardEvent("keydown", {
      key: "S",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    act(() => editor.dispatchEvent(strike));

    expect(strike.defaultPrevented).toBe(true);
    expect(ref.current!.getActiveMarks()).toContain("strike");

    const legacyShortcut = new KeyboardEvent("keydown", {
      key: "X",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    act(() => editor.dispatchEvent(legacyShortcut));

    expect(legacyShortcut.defaultPrevented).toBe(true);
    expect(ref.current!.getActiveMarks()).not.toContain("strike");
  });
});
