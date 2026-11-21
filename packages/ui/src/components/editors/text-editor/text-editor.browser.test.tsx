import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { StrictMode, useState } from "react";
import { Theme } from "@puzzle-ui/theme";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { TextEditor, useTextEditor } from "./index";
import { createTextDocument } from "./text-document";
import { TextEditorToolbar } from "./text-editor-toolbar";
import { TextRenderer } from "./text-renderer";
import { Preview } from "../../utilities/preview";
import type { TextDocument, TextSelection } from "./text-editor.types";

afterEach(cleanup);

const getPlainText = (document: TextDocument | undefined) =>
  document?.content
    .map((block) => block.children.map((inline) => inline.text).join(""))
    .join("\n");

describe("TextEditor (browser)", () => {
  it("hydrates a server-rendered editor without recoverable errors", async () => {
    const value = createTextDocument("Hydrated content");
    const host = document.createElement("div");
    host.innerHTML = renderToString(<TextEditor defaultValue={value} />);
    document.body.appendChild(host);
    const recoverableErrors: string[] = [];
    const root = hydrateRoot(
      host,
      <TextEditor defaultValue={value} />,
      { onRecoverableError: (error) => recoverableErrors.push(String(error)) },
    );

    await act(async () => {});
    await waitFor(() =>
      expect(host.querySelector(".puzzle-text-editor")?.textContent).toContain(
        "Hydrated content",
      ),
    );
    expect(recoverableErrors).toEqual([]);
    await act(async () => root.unmount());
    host.remove();
  });
  it("hydrates a server-rendered editor without recoverable errors", async () => {
    const value = createTextDocument("Hydrated content");
    const host = document.createElement("div");
    host.innerHTML = renderToString(<TextEditor defaultValue={value} />);
    document.body.appendChild(host);
    const recoverableErrors: string[] = [];
    const root = hydrateRoot(
      host,
      <TextEditor defaultValue={value} />,
      {
        onRecoverableError: (error) => recoverableErrors.push(String(error)),
      },
    );

    await act(async () => {});
    await waitFor(() =>
      expect(host.querySelector(".puzzle-text-editor")?.textContent).toContain(
        "Hydrated content",
      ),
    );
    expect(recoverableErrors).toEqual([]);
    await act(async () => root.unmount());
    host.remove();
  });

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

  it.each(["bullet", "ordered"] as const)(
    "shows %s list markers in the editor and renderer even with a list reset",
    (listType) => {
      const value: TextDocument = {
        type: "doc",
        content: [{ type: "listItem", variant: "body1", listType, children: [{ text: "Item" }] }],
      };
      render(
        <>
          <style>{"ul, ol, li { list-style: none; } li { display: block; }"}</style>
          <TextEditor defaultValue={value} />
          <TextRenderer document={value} />
        </>,
      );
      const lists = document.querySelectorAll(
        listType === "bullet" ? ".puzzle-text-editor ul, .puzzle-text-renderer ul" : ".puzzle-text-editor ol, .puzzle-text-renderer ol",
      );
      expect(lists).toHaveLength(2);
      for (const list of lists) {
        const item = list.querySelector("li")!;
        expect(getComputedStyle(item).display).toBe("list-item");
        expect(getComputedStyle(item).listStyleType).toBe(listType === "bullet" ? "disc" : "decimal");
      }
    },
  );

  it.each(["blockquote", "codeBlock"] as const)(
    "exits an empty %s on Enter and retains editable paragraph behavior",
    async (type) => {
      let latestDocument: TextDocument | undefined;
      render(
        <TextEditor
          defaultValue={{ type: "doc", content: [{ type, variant: "body1", children: [] }] }}
          onChange={(value) => { latestDocument = value; }}
        />,
      );
      const editor = screen.getByRole("textbox", { name: "Text editor" });
      await userEvent.click(editor);
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(latestDocument?.content[0]?.type).toBe("paragraph"));
      await userEvent.type(editor, "After");
      await waitFor(() => expect(getPlainText(latestDocument)).toBe("After"));
    },
  );

  it("exits a code block on an empty line without losing surrounding code", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        defaultValue={{ type: "doc", content: [{ type: "codeBlock", variant: "body1", children: [{ text: "before\n\nafter" }] }] }}
        onChange={(value) => { latestDocument = value; }}
      />,
    );
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const text = editor.querySelector("pre span")!.firstChild!;
    editor.focus();
    const selection = document.getSelection()!;
    selection.setBaseAndExtent(text, 7, text, 7);
    document.dispatchEvent(new Event("selectionchange"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(latestDocument?.content.map((block) => [block.type, block.children.map((inline) => inline.text).join("")])).toEqual([
      ["codeBlock", "before"], ["paragraph", ""], ["codeBlock", "after"],
    ]));
    await userEvent.type(editor, "middle");
    await waitFor(() => expect(latestDocument?.content[1]?.children).toEqual([{ text: "middle" }]));
  });

  it.each(["blockquote", "codeBlock"] as const)(
    "exits a %s after typing a line followed by an empty line",
    async (type) => {
      let latestDocument: TextDocument | undefined;
      render(
        <TextEditor
          defaultValue={{ type: "doc", content: [{ type, variant: "body1", children: [] }] }}
          onChange={(value) => { latestDocument = value; }}
        />,
      );
      const editor = screen.getByRole("textbox", { name: "Text editor" });
      await userEvent.click(editor);
      await userEvent.type(editor, "first");
      await userEvent.keyboard("{Enter}{Enter}");
      await waitFor(() => expect(latestDocument?.content.map((block) => block.type)).toEqual([type, "paragraph"]));
      expect(latestDocument?.content[0]?.children).toEqual([{ text: "first" }]);
      await userEvent.type(editor, "next");
      await waitFor(() => expect(getPlainText(latestDocument)).toBe("first\nnext"));
      await userEvent.keyboard("{Control>}z{/Control}");
      await userEvent.keyboard("{Control>}z{/Control}");
      await waitFor(() => expect(latestDocument?.content.at(-1)?.type).toBe(type));
    },
  );

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

  it("inserts a horizontal rule at the caret and supports undo and redo", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("AlphaBeta")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    const text = editor.querySelector("span")!.firstChild!;
    const range = document.createRange();
    range.setStart(text, 5);
    range.collapse(true);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));

    await userEvent.click(screen.getByRole("button", { name: "Horizontal rule" }));

    await waitFor(() => {
      expect(latestDocument?.content.map((block) => block.type)).toEqual([
        "paragraph",
        "horizontalRule",
        "paragraph",
      ]);
      expect(getPlainText(latestDocument)).toBe("Alpha\n\nBeta");
      expect(editor.querySelector("hr")).not.toBeNull();
    });

    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(getPlainText(latestDocument)).toBe("AlphaBeta"));
    await userEvent.click(screen.getByRole("button", { name: "Redo" }));
    await waitFor(() =>
      expect(latestDocument?.content.map((block) => block.type)).toEqual([
        "paragraph",
        "horizontalRule",
        "paragraph",
      ]),
    );
  });

  it("drags within icon color settings using the Playwright pointer", async () => {
    let latestDocument: TextDocument | undefined;
    const observedColors = new Set<string>();
    const fetchOriginal = globalThis.fetch;
    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      if (String(input).startsWith("https://api.iconify.design/search")) {
        return Promise.resolve(new Response(JSON.stringify({ icons: ["mdi:star"] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }));
      }
      return fetchOriginal(input, init);
    });
    const ControlledEditor = () => {
      const [value, setValue] = useState(() => createTextDocument("Icon item"));
      return <TextEditor toolbar={<TextEditorToolbar />} value={value} onChange={(next) => {
        latestDocument = next;
        const color = next.content[0]?.listAttributes?.icon?.color;
        if (color) observedColors.add(color);
        setValue(next);
      }} />;
    };
    render(<StrictMode><Theme scope="local"><ControlledEditor /></Theme></StrictMode>);
    await userEvent.click(screen.getByRole("button", { name: "List" }));
    await userEvent.click(await screen.findByRole("button", { name: /^Icon$/ }));
    const settings = await screen.findByRole("dialog", { name: "Icon list settings" });
    fireEvent.change(within(settings).getByRole("searchbox", { name: "Search icons" }), {
      target: { value: "star" },
    });
    await userEvent.click(await within(settings).findByRole("button", { name: "mdi:star" }));
    await userEvent.click(await screen.findByRole("button", { name: "Icon color" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose Icon color" });
    const area = within(dialog).getByRole("group", { name: "Color saturation and brightness" });
    await userEvent.pointer([
      { target: area, coords: { x: 10, y: 10 }, keys: "[MouseLeft>]" },
      ...Array.from({ length: 80 }, (_, index) => ({
        target: area,
        coords: { x: 10 + index, y: 10 + index },
      })),
      { target: area, coords: { x: 90, y: 90 }, keys: "[/MouseLeft]" },
    ]);
    const color = latestDocument?.content[0]?.listAttributes?.icon?.color;
    expect(color).toBeDefined();
    expect(color).not.toBe("#0277B5");
    expect(observedColors.size).toBeGreaterThan(10);
    expect(screen.getByRole("textbox", { name: "Text editor" })
      .querySelector('[data-puzzle-editor-control="icon"] svg')).toHaveStyle({ color });
    expect(dialog).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: "Apply color" }));
    await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe(color));
    await userEvent.click(screen.getByRole("button", { name: "List" }));
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#0277B5"));
    await userEvent.click(screen.getByRole("button", { name: "Redo" }));
    await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe(color));
  });

  it("supports color dragging inside the documentation preview iframe", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <Preview hideDevices>
        <TextEditor
          toolbar={<TextEditorToolbar />}
          defaultValue={createTextDocument("Icon item")}
          onChange={(value) => { latestDocument = value; }}
        />
      </Preview>,
    );
    const frame = page.frameLocator(page.getByTitle("Mobile component preview"));
    await frame.getByRole("button", { name: "List", exact: true }).click();
    await frame.getByRole("button", { name: "Icon", exact: true }).click();
    await frame.getByRole("button", { name: "Icon color" }).click();
    const area = frame.getByRole("group", { name: "Color saturation and brightness" });
    await userEvent.pointer([
      { target: area, coords: { x: 10, y: 10 }, keys: "[MouseLeft>]" },
      ...Array.from({ length: 20 }, (_, index) => ({
        target: area,
        coords: { x: 10 + index * 3, y: 10 + index * 3 },
      })),
      { target: area, coords: { x: 70, y: 70 }, keys: "[/MouseLeft]" },
    ]);
    expect(latestDocument?.content[0]?.listAttributes?.icon?.color).not.toBe("#0277B5");
    await frame.getByRole("button", { name: "Cancel color" }).click();
    await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#0277B5"));
  });

  it("previews, cancels and commits icon colors without closing list settings", async () => {
      let latestDocument: TextDocument | undefined;
      render(
        <TextEditor
          toolbar={<TextEditorToolbar />}
          defaultValue={createTextDocument("Icon item")}
          onChange={(document) => { latestDocument = document; }}
        />,
      );

      await userEvent.click(screen.getByRole("button", { name: "List" }));
      await userEvent.click(await screen.findByRole("button", { name: /^Icon$/ }));
      const settings = await screen.findByRole("dialog", { name: "Icon list settings" });
      expect(latestDocument?.content[0]?.listAttributes?.icon).toEqual({
        name: "mdi:circle", size: 18, color: "#0277B5",
      });

      const chooseColor = async (color: string) => {
        await userEvent.click(screen.getByRole("button", { name: "Icon color" }));
        const dialog = await screen.findByRole("dialog", { name: "Choose Icon color" });
        const input = within(dialog).getByRole("textbox", { name: "Color value" });
        fireEvent.change(input, { target: { value: color } });
        await userEvent.click(within(dialog).getByRole("button", { name: /^Apply$/ }));
        await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe(color));
        await waitFor(() => {
          const marker = screen.getByRole("textbox", { name: "Text editor" })
            .querySelector('[data-puzzle-editor-control="icon"] svg');
          expect(marker).toHaveStyle({ color });
        });
        expect(settings).toBeInTheDocument();
        expect(dialog).toBeInTheDocument();
        return dialog;
      };

      const first = await chooseColor("#ff0000");
      await userEvent.click(within(first).getByRole("button", { name: "Cancel color" }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#0277B5"));
      expect(settings).toBeInTheDocument();

      await chooseColor("#0000ff");
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#0277B5"));
      expect(settings).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Icon color" })).toHaveFocus();

      const second = await chooseColor("#00ff00");
      fireEvent.change(within(second).getByRole("textbox", { name: "Color value" }), {
        target: { value: "#00aa00" },
      });
      await userEvent.click(within(second).getByRole("button", { name: /^Apply$/ }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#00aa00"));
      fireEvent.change(within(second).getByRole("textbox", { name: "Color value" }), {
        target: { value: "#00ff00" },
      });
      await userEvent.click(within(second).getByRole("button", { name: /^Apply$/ }));
      await userEvent.click(within(second).getByRole("button", { name: "Apply color" }));
      await waitFor(() => expect(screen.queryByRole("dialog", { name: "Choose Icon color" })).not.toBeInTheDocument());
      expect(settings).toBeInTheDocument();
      expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#00ff00");
      await userEvent.click(screen.getByRole("button", { name: "List" }));
      await userEvent.click(screen.getByRole("button", { name: "Undo" }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#0277B5"));
      await userEvent.click(screen.getByRole("button", { name: "Undo" }));
      await waitFor(() => expect(latestDocument?.content[0]?.listType).toBeUndefined());
      await userEvent.click(screen.getByRole("button", { name: "Redo" }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#0277B5"));
      await userEvent.click(screen.getByRole("button", { name: "Redo" }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#00ff00"));
      await userEvent.click(screen.getByRole("button", { name: "List" }));
      const reopened = await screen.findByRole("dialog", { name: "Icon list settings" });
      const size = within(reopened).getByRole("spinbutton", { name: "Icon size" });
      fireEvent.change(size, { target: { value: "24" } });
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.size).toBe(24));
      expect(reopened).toBeInTheDocument();
      expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#00ff00");
      await userEvent.click(within(reopened).getByRole("button", { name: "Icon color" }));
      const lastPicker = await screen.findByRole("dialog", { name: "Choose Icon color" });
      fireEvent.change(within(lastPicker).getByRole("textbox", { name: "Color value" }), {
        target: { value: "#123456" },
      });
      await userEvent.click(within(lastPicker).getByRole("button", { name: /^Apply$/ }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#123456"));
      await userEvent.click(screen.getByRole("button", { name: "Block style" }));
      await waitFor(() => expect(latestDocument?.content[0]?.listAttributes?.icon?.color).toBe("#00ff00"));
      expect(screen.queryByRole("dialog", { name: "Icon list settings" })).not.toBeInTheDocument();
  });

  it("does not restore stale content when a controlled document changes during color preview", async () => {
    const makeDocument = (text: string): TextDocument => ({
      type: "doc",
      content: [{
        type: "listItem",
        variant: "body1",
        listType: "icon",
        listAttributes: { icon: { name: "mdi:circle", size: 18, color: "#0277B5" } },
        children: [{ text }],
      }],
    });
    const onChange = vi.fn();
    const { rerender } = render(
      <TextEditor value={makeDocument("Original")} onChange={onChange} toolbar={<TextEditorToolbar />} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "List" }));
    await screen.findByRole("dialog", { name: "Icon list settings" });
    await userEvent.click(screen.getByRole("button", { name: "Icon color" }));
    const colorDialog = await screen.findByRole("dialog", { name: "Choose Icon color" });
    fireEvent.change(within(colorDialog).getByRole("textbox", { name: "Color value" }), {
      target: { value: "#ff0000" },
    });
    await userEvent.click(within(colorDialog).getByRole("button", { name: /^Apply$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());

    rerender(<TextEditor value={makeDocument("External update")} onChange={onChange} toolbar={<TextEditorToolbar />} />);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Text editor" })).toHaveTextContent("External update"));
    const calls = onChange.mock.calls.length;
    await userEvent.click(within(colorDialog).getByRole("button", { name: "Cancel color" }));
    expect(screen.getByRole("textbox", { name: "Text editor" })).toHaveTextContent("External update");
    expect(onChange).toHaveBeenCalledTimes(calls);
  });

  it("searches icons and applies a selection without closing its settings", async () => {
    const fetchOriginal = globalThis.fetch;
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);
      if (url.startsWith("https://api.iconify.design/search")) {
        return Promise.resolve(new Response(JSON.stringify({
          icons: url.toLowerCase().includes("missing") ? [] : ["mdi:star"],
        }), { status: 200, headers: { "content-type": "application/json" } }));
      }
      return fetchOriginal(input, init);
    });
    try {
      let latestDocument: TextDocument | undefined;
      render(
        <TextEditor
          defaultValue={createTextDocument("Icon")}
          onChange={(document) => { latestDocument = document; }}
          toolbar={<TextEditorToolbar />}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: "List" }));
      await userEvent.click(await screen.findByRole("button", { name: /^Icon$/ }));
      const settings = await screen.findByRole("dialog", { name: "Icon list settings" });
      const search = within(settings).getByRole("searchbox", { name: "Search icons" });
      fireEvent.change(search, { target: { value: "StAr" } });
      await userEvent.click(await within(settings).findByRole("button", { name: "mdi:star" }));
      expect(latestDocument?.content[0]?.listAttributes?.icon).toEqual({
        name: "mdi:star", size: 18, color: "#0277B5",
      });
      expect(settings).toBeInTheDocument();
      fireEvent.change(search, { target: { value: "missing" } });
      expect(await within(settings).findByText("No icons found.")).toBeVisible();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("keeps icon configuration isolated between editor instances", async () => {
    const firstChange = vi.fn();
    const secondChange = vi.fn();
    render(
      <>
        <TextEditor defaultValue={createTextDocument("First")} onChange={firstChange} toolbar={<TextEditorToolbar />} />
        <TextEditor defaultValue={createTextDocument("Second")} onChange={secondChange} toolbar={<TextEditorToolbar />} />
      </>,
    );
    const toolbars = screen.getAllByRole("toolbar", { name: "Text formatting" });
    await userEvent.click(within(toolbars[0]!).getByRole("button", { name: "List" }));
    await userEvent.click(await screen.findByRole("button", { name: /^Icon$/ }));
    const settings = await screen.findByRole("dialog", { name: "Icon list settings" });
    fireEvent.change(within(settings).getByRole("spinbutton", { name: "Icon size" }), {
      target: { value: "24" },
    });
    await waitFor(() => expect(firstChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        content: [expect.objectContaining({
          listAttributes: { icon: { name: "mdi:circle", size: 24, color: "#0277B5" } },
        })],
      }),
    ));
    expect(secondChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole("textbox", { name: "Text editor" })[1]).toHaveTextContent("Second");
  });

  it("converts and indents list items through the toolbar", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={{
          type: "doc",
          content: [
            { type: "paragraph", variant: "body1", children: [{ text: "First" }] },
            { type: "paragraph", variant: "body1", children: [{ text: "Second" }] },
          ],
        }}
        onChange={(document) => { latestDocument = document; }}
      />,
    );
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    const blocks = editor.querySelectorAll("[data-puzzle-editor-block]");
    const range = document.createRange();
    range.setStart(blocks[0]!.querySelector("span")!.firstChild!, 0);
    range.setEnd(blocks[1]!.querySelector("span")!.firstChild!, 6);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));

    await userEvent.click(screen.getByRole("button", { name: "List" }));
    await userEvent.click(await screen.findByRole("button", { name: "Bullet" }));
    await waitFor(() => expect(latestDocument?.content.map((block) => block.listType)).toEqual(["bullet", "bullet"]));

    const second = editor.querySelectorAll("[data-puzzle-editor-block]")[1]!.querySelector("span")!.firstChild!;
    range.setStart(second, 2);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
    await userEvent.click(screen.getByRole("button", { name: "Indent" }));
    await waitFor(() => expect(latestDocument?.content[1]?.indent).toBe(1));
    await userEvent.click(screen.getByRole("button", { name: "Outdent" }));
    await waitFor(() => expect(latestDocument?.content[1]?.indent).toBeUndefined());

    await userEvent.click(screen.getByRole("button", { name: "List" }));
    await userEvent.click(await screen.findByRole("button", { name: "Ordered" }));
    expect(latestDocument?.content[1]?.listType).toBe("ordered");
    await userEvent.click(screen.getByRole("button", { name: "List" }));
    await userEvent.click(await screen.findByRole("button", { name: "Checklist" }));
    const checklist = await screen.findByRole("dialog", { name: "Checklist settings" });
    await userEvent.click(within(checklist).getByRole("checkbox", { name: "Allow checkbox interaction" }));
    expect(latestDocument?.content[1]?.listAttributes?.interactive).toBe(true);
    await userEvent.click(within(checklist).getByRole("button", { name: "Back" }));
    await userEvent.click(screen.getByRole("button", { name: /^Icon$/ }));
    expect(await screen.findByRole("dialog", { name: "Icon list settings" })).toBeVisible();
    expect(latestDocument?.content[1]?.listType).toBe("icon");
    expect(getPlainText(latestDocument)).toBe("First\nSecond");
  });

  it.each(["bullet", "ordered", "checklist", "icon"] as const)(
    "indents and outdents %s list items without losing content",
    async (listType) => {
      let latestDocument: TextDocument | undefined;
      render(
        <TextEditor
          toolbar={<TextEditorToolbar />}
          defaultValue={{
            type: "doc",
            content: [
              { type: "listItem", variant: "body1", listType, children: [{ text: "First" }] },
              { type: "listItem", variant: "body1", listType, children: [{ text: "Second" }] },
            ],
          }}
          onChange={(document) => { latestDocument = document; }}
        />,
      );
      const editor = screen.getByRole("textbox", { name: "Text editor" });
      await userEvent.click(editor);
      const blocks = editor.querySelectorAll("[data-puzzle-editor-block]");
      const text = blocks[1]!.querySelector("span:not([data-puzzle-editor-control])")!.firstChild!;
      const range = document.createRange();
      range.setStart(text, 2);
      range.collapse(true);
      const selection = window.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
      await userEvent.click(screen.getByRole("button", { name: "Indent" }));
      await waitFor(() => expect(latestDocument?.content[1]?.indent).toBe(1));
      expect(latestDocument?.content[1]?.listType).toBe(listType);
      await userEvent.click(screen.getByRole("button", { name: "Outdent" }));
      await waitFor(() => expect(latestDocument?.content[1]?.indent).toBeUndefined());
      expect(latestDocument?.content[1]?.listType).toBe(listType);
      expect(getPlainText(latestDocument)).toBe("First\nSecond");
    },
  );

  it("formats selected text and switches block styles without losing content", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("Keep this text")}
        onChange={(document) => { latestDocument = document; }}
      />,
    );
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    const text = editor.querySelector("span")!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(text);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));

    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    await userEvent.click(screen.getByRole("button", { name: "Underline" }));
    expect(latestDocument?.content[0]?.children[0]?.marks).toEqual(["bold", "italic", "underline"]);
    await userEvent.click(screen.getByRole("button", { name: "Clear formatting" }));
    expect(latestDocument?.content[0]?.children[0]?.marks).toBeUndefined();
    expect(getPlainText(latestDocument)).toBe("Keep this text");

    await userEvent.click(screen.getByRole("button", { name: "Block style" }));
    const styles = await screen.findByRole("dialog", { name: "Block styles" });
    await userEvent.click(within(styles).getByRole("button", { name: "Headline 2" }));
    expect(latestDocument?.content[0]).toMatchObject({ type: "heading", variant: "headline2" });
    await userEvent.click(screen.getByRole("button", { name: "Blockquote" }));
    expect(editor.querySelector("blockquote")).not.toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Code block" }));
    expect(editor.querySelector("pre")).not.toBeNull();
    expect(editor.querySelector("blockquote")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Blockquote" }));
    expect(editor.querySelector("blockquote")).not.toBeNull();
    expect(editor.querySelector("pre")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Blockquote" }));
    expect(latestDocument?.content[0]?.type).toBe("paragraph");
    expect(getPlainText(latestDocument)).toBe("Keep this text");
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

  it("renders nested semantic lists and toggles a checklist item undoably", async () => {
    let latestDocument: TextDocument | undefined;
    let changeCount = 0;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={{
          type: "doc",
          content: [
            {
              type: "listItem",
              variant: "body1",
              listType: "checklist",
              listAttributes: { interactive: true },
              checked: false,
              children: [{ text: "Parent task" }],
            },
            {
              type: "listItem",
              variant: "body1",
              listType: "bullet",
              indent: 1,
              children: [{ text: "Nested item" }],
            },
          ],
        }}
        onChange={(document) => {
          changeCount += 1;
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    expect(editor.querySelectorAll("ul")).toHaveLength(2);
    const textNode = editor.querySelector(
      'li[data-puzzle-block-index="0"] > span',
    )!.firstChild!;
    const range = editor.ownerDocument.createRange();
    range.selectNodeContents(textNode);
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Mark checklist item complete",
      }),
    );

    await waitFor(() => expect(latestDocument?.content[0]?.checked).toBe(true));
    expect(changeCount).toBe(1);
    expect(window.getSelection()?.toString()).toBe("Parent task");
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(latestDocument?.content[0]?.checked).toBe(false));
    expect(window.getSelection()?.toString()).toBe("Parent task");
  });

  it("continues list items and supports Tab and Shift+Tab indentation", async () => {
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
              children: [{ text: "First" }],
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
    const textNode = editor.querySelector("span")!.firstChild!;
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.collapse(textNode, textNode.textContent?.length ?? 0);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(latestDocument?.content).toHaveLength(2));
    expect(latestDocument?.content[1]?.listType).toBe("bullet");

    await userEvent.keyboard("{Tab}");
    await waitFor(() => expect(latestDocument?.content[1]?.indent).toBe(1));
    editor.focus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await waitFor(() => expect(latestDocument?.content[1]?.indent).toBeUndefined());
    await userEvent.keyboard("{Backspace}");
    await waitFor(() => expect(latestDocument?.content).toHaveLength(1));
  });

  it("supports Tab and Shift+Tab indentation for ordinary blocks", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        defaultValue={createTextDocument("Indented paragraph")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    await userEvent.keyboard("{Tab}");
    await waitFor(() => expect(latestDocument?.content[0]?.indent).toBe(1));
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await waitFor(() =>
      expect(latestDocument?.content[0]?.indent).toBeUndefined(),
    );
  });

  it("groups an IME composition into one undoable history action", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("A")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const textNode = editor.querySelector("span")!.firstChild!;
    editor.focus();
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.collapse(textNode, 1);
    fireEvent.compositionStart(editor);
    textNode.textContent = "Aあ";
    fireEvent.input(editor, {
      inputType: "insertCompositionText",
      data: "あ",
      isComposing: true,
    });
    await waitFor(() =>
      expect(latestDocument?.content[0]?.children[0]?.text).toBe("Aあ"),
    );
    fireEvent.compositionEnd(editor, { data: "あ" });

    const undo = screen.getByRole("button", { name: "Undo" });
    await waitFor(() => expect(undo).toBeEnabled());
    await userEvent.click(undo);
    await waitFor(() =>
      expect(latestDocument?.content[0]?.children[0]?.text).toBe("A"),
    );
  });

  it("converts Markdown heading shortcuts without retaining the marker text", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        defaultValue={createTextDocument()}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(editor);
    await userEvent.type(editor, "## ");

    await waitFor(() => {
      expect(latestDocument?.content[0]?.type).toBe("heading");
      expect(latestDocument?.content[0]?.headingLevel).toBe(2);
      expect(latestDocument?.content[0]?.children).toEqual([]);
    });
  });

  it("converts blockquote and fenced-code shortcuts while preserving text", async () => {
    let quoteDocument: TextDocument | undefined;
    const quoteView = render(
      <TextEditor
        defaultValue={createTextDocument()}
        onChange={(document) => {
          quoteDocument = document;
        }}
      />,
    );
    const quoteEditor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(quoteEditor);
    await userEvent.type(quoteEditor, "> ");
    await waitFor(() => {
      expect(quoteDocument?.content[0]?.type).toBe("blockquote");
      expect(quoteDocument?.content[0]?.children).toEqual([]);
    });
    await userEvent.type(quoteEditor, "quoted");
    await waitFor(() =>
      expect(quoteDocument?.content[0]?.children).toEqual([
        { text: "quoted" },
      ]),
    );

    quoteView.unmount();
    let codeDocument: TextDocument | undefined;
    let codeSelection: TextSelection | undefined;
    const SelectionProbe = () => {
      codeSelection = useTextEditor().selection;
      return null;
    };
    render(
      <TextEditor
        toolbar={<SelectionProbe />}
        defaultValue={createTextDocument()}
        onChange={(document) => {
          codeDocument = document;
        }}
      />,
    );
    const codeEditor = screen.getByRole("textbox", { name: "Text editor" });
    await userEvent.click(codeEditor);
    await userEvent.type(codeEditor, "```");
    await waitFor(() =>
      expect(codeDocument?.content[0]?.type).toBe("codeBlock"),
    );
    await waitFor(() =>
      expect(
        codeEditor.querySelector("[data-puzzle-editor-block]")?.tagName,
      ).toBe("PRE"),
    );
    await userEvent.type(codeEditor, "  line one");
    expect(codeSelection?.focus).toEqual({ block: 0, offset: 10 });
    const selectionBeforeEnter = codeEditor.ownerDocument.getSelection()!;
    expect({
      offset: selectionBeforeEnter.focusOffset,
      nodeText: selectionBeforeEnter.focusNode?.textContent,
    }).toEqual({ offset: 10, nodeText: "  line one" });
    await waitFor(() =>
      expect(codeDocument?.content[0]?.type).toBe("codeBlock"),
    );
    expect(
      codeEditor.querySelector("[data-puzzle-editor-block]")?.tagName,
    ).toBe("PRE");
    const enterWasHandled: boolean[] = [];
    const recordEnter = (event: Event) => {
      if (event.target === codeEditor && (event as KeyboardEvent).key === "Enter") {
        enterWasHandled.push(event.defaultPrevented);
      }
    };
    codeEditor.ownerDocument.addEventListener("keydown", recordEnter);
    await userEvent.keyboard("{Enter}");
    codeEditor.ownerDocument.removeEventListener("keydown", recordEnter);
    expect(enterWasHandled).toEqual([true]);
    expect(codeSelection?.focus).toEqual({ block: 0, offset: 11 });
    const selectionAfterEnter = codeEditor.ownerDocument.getSelection()!;
    expect({
      offset: selectionAfterEnter.focusOffset,
      nodeText: selectionAfterEnter.focusNode?.textContent,
    }).toEqual({ offset: 11, nodeText: "  line one\n" });
    await userEvent.type(codeEditor, "line two");
    await waitFor(() =>
      expect(
        codeDocument?.content[0]?.children.map((inline) => inline.text).join(""),
      ).toBe("  line one\nline two"),
    );
  });

  it("supports registered keyboard shortcuts through the editor command boundary", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        shortcuts={[
          {
            id: "inline-code",
            key: "k",
            modifiers: ["mod", "shift"],
            command: "code",
          },
        ]}
        defaultValue={createTextDocument("Code")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const textNode = editor.querySelector("span")!.firstChild!;
    editor.focus();
    const range = editor.ownerDocument.createRange();
    range.selectNodeContents(textNode);
    const selection = editor.ownerDocument.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    await userEvent.keyboard("{Control>}{Shift>}k{/Shift}{/Control}");

    await waitFor(() =>
      expect(latestDocument?.content[0]?.children).toEqual([
        { text: "Code", marks: ["code"] },
      ]),
    );
  });

  it("sanitizes pasted HTML and retains semantic task-list content", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        defaultValue={createTextDocument("Before")}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const textNode = editor.querySelector("span")!.firstChild!;
    editor.focus();
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.collapse(textNode, 6);
    editor.ownerDocument.dispatchEvent(new Event("selectionchange"));
    const pasteEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(pasteEvent, "clipboardData", {
      value: {
        getData: (type: string) =>
          type === "text/html"
            ? '<ul><li><input type="checkbox" checked><strong>Safe</strong><script>unsafe()</script><a href="javascript:alert(1)"> text</a></li></ul>'
            : "",
      },
    });
    editor.dispatchEvent(pasteEvent);

    await waitFor(() => {
      expect(latestDocument?.content).toHaveLength(2);
      expect(latestDocument?.content[1]?.listType).toBe("checklist");
    });
    expect(latestDocument?.content[1]?.checked).toBe(true);
    expect(latestDocument?.content[1]?.children).toEqual([
      { text: "Safe", marks: ["bold"] },
      { text: " text" },
    ]);
  });

  it("pastes and undoes a large HTML list as one transaction", async () => {
    let latestDocument: TextDocument | undefined;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument()}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    const items = Array.from(
      { length: 250 },
      (_, index) => `<li>Item ${index}</li>`,
    ).join("");
    const pasteEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(pasteEvent, "clipboardData", {
      value: {
        getData: (type: string) =>
          type === "text/html" ? `<ul>${items}</ul>` : "",
      },
    });
    editor.dispatchEvent(pasteEvent);

    await waitFor(() => expect(latestDocument?.content).toHaveLength(250));
    expect(editor.querySelectorAll("li")).toHaveLength(250);
    expect(latestDocument?.content[249]?.children[0]?.text).toBe("Item 249");
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(latestDocument?.content).toHaveLength(1));
    expect(latestDocument?.content[0]?.children).toEqual([]);
  });
});
