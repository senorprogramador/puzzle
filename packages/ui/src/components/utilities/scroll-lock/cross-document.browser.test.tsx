import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AppBar } from "../../layout/app-bar";
import { Drawer } from "../../overlays/drawer";
import { ScrollLock } from "../../utilities/scroll-lock";
import { Preview } from "../preview";
import { Editor } from "../../editors/text-editor/editor";
import { createTextDocument } from "../../editors/text-editor/text-document";
import type { TextSelection } from "../../editors/text-editor/text-editor.types";

afterEach(() => {
  cleanup();
  document.body.removeAttribute("style");
});

// Renders children into a separate document (an iframe) to prove that
// components use their element's owner document and window, not the globals.
const InFrame = ({
  children,
  width = 500,
  height = 400,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
}) => {
  const [body, setBody] = useState<HTMLElement | null>(null);

  return (
    <iframe
      title="frame"
      style={{ width, height }}
      ref={(frame) => {
        const frameBody = frame?.contentDocument?.body ?? null;

        if (frameBody && frameBody !== body) setBody(frameBody);
      }}
    >
      {body ? createPortal(children, body) : null}
    </iframe>
  );
};

const getFrame = () =>
  (screen.getByTitle("frame") as HTMLIFrameElement).contentDocument as Document;

describe("cross-document behavior (browser)", () => {
  it("locks Preview's explicit root scroller and restores it when disabled", async () => {
    const Example = ({ enabled }: { enabled: boolean }) => (
      <Preview fit="device">
        <ScrollLock enabled={enabled} />
        <div style={{ minHeight: "200vh" }}>Scrollable preview content</div>
      </Preview>
    );
    const { container, rerender } = render(<Example enabled={false} />);
    const frame = container.querySelector("iframe")!;
    const frameDocument = await waitFor(() => {
      expect(frame.contentDocument?.body.textContent).toContain("Scrollable preview content");
      return frame.contentDocument!;
    });
    const root = frameDocument.documentElement;
    const rootStyle = root.style;

    expect(root.scrollHeight).toBeGreaterThan(root.clientHeight);
    expect(rootStyle.overflowY).toBe("auto");

    rerender(<Example enabled />);

    await waitFor(() => expect(rootStyle.overflowY).toBe("hidden"));
    expect(frameDocument.defaultView!.getComputedStyle(root).overflowY).toBe("hidden");
    expect(document.documentElement.style.overflowY).not.toBe("hidden");

    rerender(<Example enabled={false} />);

    await waitFor(() => expect(rootStyle.overflowY).toBe("auto"));
    expect(rootStyle.getPropertyPriority("overflow-y")).toBe("important");
  });

  it("ScrollLock locks the document it is rendered in", async () => {
    render(
      <InFrame>
        <ScrollLock />
      </InFrame>,
    );

    await waitFor(() => expect(getFrame().body.style.overflow).toBe("hidden"));
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("Drawer limits its size by the frame's viewport, not the host window", async () => {
    render(
      <InFrame width={400}>
        <Drawer open onOpenChange={() => {}} position="left">
          Content
        </Drawer>
      </InFrame>,
    );

    const bar = await waitFor(() => {
      const found = getFrame().querySelector('[role="separator"]');

      expect(found).not.toBeNull();
      return found as HTMLElement;
    });

    await waitFor(() => {
      const max = Number(bar.getAttribute("aria-valuemax"));

      expect(max).toBeLessThanOrEqual(400);
      expect(max).toBeLessThan(window.innerWidth);
    });
  });

  it("AppBar writes its sticky offset to the frame's document element", async () => {
    render(
      <InFrame>
        <AppBar sticky title="Bar" />
      </InFrame>,
    );

    await waitFor(() =>
      expect(
        getFrame().documentElement.style.getPropertyValue(
          "--puzzle-sticky-offset",
        ),
      ).not.toBe(""),
    );
    expect(
      document.documentElement.style.getPropertyValue("--puzzle-sticky-offset"),
    ).toBe("");
  });

  it("Editor syncs the selection from the frame's window", async () => {
    const selections: TextSelection[] = [];

    render(
      <InFrame>
        <Editor
          defaultValue={createTextDocument("Hello")}
          onSelectionChange={(selection) => selections.push(selection)}
        />
      </InFrame>,
    );

    const editable = await waitFor(() => {
      const found = getFrame().querySelector('[contenteditable="true"]');

      expect(found).not.toBeNull();
      return found as HTMLElement;
    });

    const frameWindow = getFrame().defaultView as Window;
    const range = getFrame().createRange();

    editable.focus();
    const text = getFrame()
      .createTreeWalker(editable, NodeFilter.SHOW_TEXT)
      .nextNode() as Text;

    range.setStart(text, 0);
    range.setEnd(text, 5);
    frameWindow.getSelection()?.removeAllRanges();
    frameWindow.getSelection()?.addRange(range);

    await waitFor(() => {
      const last = selections.at(-1);

      expect(last?.anchor.offset).toBe(0);
      expect(last?.focus.offset).toBe(5);
    });
    expect(window.getSelection()?.toString()).toBe("");
  });
});
