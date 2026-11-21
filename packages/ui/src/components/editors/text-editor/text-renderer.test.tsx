import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextRenderer } from "./text-renderer";
import type { TextBlock, TextDocument } from "./text-editor.types";

vi.mock("@puzzle-ui/icons", () => ({
  Icon: ({ name }: { name: string }) => (
    <svg data-testid="list-icon" data-icon-name={name} />
  ),
}));

afterEach(() => {
  cleanup();
});

const doc = (...content: TextBlock[]): TextDocument => ({
  type: "doc",
  content,
});

describe("TextRenderer", () => {
  it("renders paragraphs with their typography variant", () => {
    render(
      <TextRenderer
        document={doc({
          type: "paragraph",
          variant: "body1",
          children: [{ text: "Hello" }],
        })}
      />,
    );

    const paragraph = screen.getByText("Hello").closest("p");

    expect(paragraph).toHaveClass("puzzle-typography-body1");
  });

  it("derives the heading tag from the variant when no level is given", () => {
    render(
      <TextRenderer
        document={doc(
          { type: "heading", variant: "headline1", children: [{ text: "One" }] },
          { type: "heading", variant: "headline2", children: [{ text: "Two" }] },
          { type: "heading", variant: "headline3", children: [{ text: "Three" }] },
        )}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "One" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Two" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Three" })).toBeTruthy();
  });

  it("separates the semantic heading level from the visual variant", () => {
    render(
      <TextRenderer
        document={doc({
          type: "heading",
          variant: "headline4",
          headingLevel: 2,
          children: [{ text: "Small but important" }],
        })}
      />,
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveClass("puzzle-typography-headline4");
  });

  it("supports heading levels up to h6", () => {
    render(
      <TextRenderer
        document={doc({
          type: "heading",
          variant: "headline1",
          headingLevel: 6,
          children: [{ text: "Deep" }],
        })}
      />,
    );

    expect(screen.getByRole("heading", { level: 6 })).toBeTruthy();
  });

  it("groups consecutive list items into one list per list type", () => {
    render(
      <TextRenderer
        document={doc(
          { type: "listItem", variant: "body1", listType: "bullet", children: [{ text: "A" }] },
          { type: "listItem", variant: "body1", listType: "bullet", children: [{ text: "B" }] },
          { type: "listItem", variant: "body1", listType: "ordered", children: [{ text: "C" }] },
        )}
      />,
    );

    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("list")[0]!.tagName).toBe("UL");
    expect(screen.getAllByRole("list")[1]!.tagName).toBe("OL");
  });

  it("renders nested checklist and icon lists semantically", () => {
    render(
      <TextRenderer
        document={doc(
          {
            type: "listItem",
            variant: "body1",
            listType: "checklist",
            listAttributes: { interactive: true },
            checked: true,
            children: [{ text: "Parent" }],
          },
          {
            type: "listItem",
            variant: "body1",
            listType: "icon",
            indent: 1,
            listAttributes: {
              icon: { name: "mdi:star", size: 20, color: "#123456" },
            },
            children: [{ text: "Nested" }],
          },
        )}
      />,
    );

    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getByRole("checkbox", {
      name: "Mark checklist item incomplete",
    })).toBeDisabled();
    expect(screen.getByTestId("list-icon")).toHaveAttribute(
      "data-icon-name",
      "mdi:star",
    );
    expect(screen.getByText("Nested").closest("li")?.parentElement?.tagName)
      .toBe("UL");
  });

  it("server-renders semantic block and list content without editor controls", () => {
    const markup = renderToStaticMarkup(
      <TextRenderer
        document={doc(
          {
            type: "blockquote",
            variant: "body1",
            children: [{ text: "Quoted" }],
          },
          {
            type: "codeBlock",
            variant: "body1",
            children: [{ text: "line one\n  line two" }],
          },
          {
            type: "listItem",
            variant: "body1",
            listType: "checklist",
            listAttributes: { interactive: true },
            children: [{ text: "Task" }],
          },
          {
            type: "horizontalRule",
            variant: "body1",
            children: [],
          },
        )}
      />,
    );

    expect(markup).toContain("<blockquote");
    expect(markup).toContain("<pre");
    expect(markup).toContain("<hr");
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain("disabled");
  });

  it("only enables checklist interaction when both options are enabled", () => {
    const onChecklistChange = vi.fn();
    render(
      <TextRenderer
        document={doc({
          type: "listItem",
          variant: "body1",
          listType: "checklist",
          listAttributes: { interactive: true },
          children: [{ text: "Task" }],
        })}
        interactiveLists
        onChecklistChange={onChecklistChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Mark checklist item complete",
    });
    expect(checkbox).toBeEnabled();
    fireEvent.click(checkbox);
    expect(onChecklistChange).toHaveBeenCalledWith(0, true);
  });

  it("renders a large flat list without changing item order", () => {
    const items = Array.from({ length: 1000 }, (_, index) => ({
      type: "listItem" as const,
      variant: "body1" as const,
      listType: "bullet" as const,
      children: [{ text: `Item ${index}` }],
    }));
    render(<TextRenderer document={doc(...items)} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(1000);
    expect(screen.getByText("Item 999")).toBeInTheDocument();
  });

  it("applies inline marks as semantic elements", () => {
    const { container } = render(
      <TextRenderer
        document={doc({
          type: "paragraph",
          variant: "body1",
          children: [{ text: "Marked", marks: ["bold", "italic"] }],
        })}
      />,
    );

    expect(container.querySelector("strong em, em strong")).toBeTruthy();
  });

  it("renders blockquotes, inline code, code blocks, and horizontal rules semantically", () => {
    const { container } = render(
      <TextRenderer
        document={doc(
          {
            type: "blockquote",
            variant: "body1",
            children: [{ text: "Quoted " }, { text: "code", marks: ["code"] }],
          },
          {
            type: "codeBlock",
            variant: "body1",
            children: [{ text: "one\n  two" }],
          },
          {
            type: "horizontalRule",
            variant: "body1",
            children: [],
          },
        )}
      />,
    );

    expect(container.querySelector("blockquote")).toHaveTextContent("Quoted code");
    expect(container.querySelector("blockquote code")).toHaveTextContent("code");
    expect(container.querySelector("pre code")?.textContent).toBe("one\n  two");
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("renders inline code with a semantic code element", () => {
    const { container } = render(
      <TextRenderer
        document={doc({
          type: "paragraph",
          variant: "body1",
          children: [{ text: "const value = 1;", marks: ["code"] }],
        })}
      />,
    );

    expect(container.querySelector("code")).toHaveTextContent("const value = 1;");
  });

  it("renders links as safe semantic anchors", () => {
    const { container } = render(
      <TextRenderer
        document={doc({
          type: "paragraph",
          variant: "body1",
          children: [
            { text: "Safe", link: { href: "https://example.com" } },
            { text: " unsafe", link: { href: "javascript:alert(1)" } },
          ],
        })}
      />,
    );

    expect(container.querySelector('a[href="https://example.com"]')).toHaveTextContent(
      "Safe",
    );
    expect(container.querySelectorAll("a")).toHaveLength(1);
    expect(container).toHaveTextContent("Safe unsafe");
  });

  it("turns newlines into line breaks and keeps empty blocks open", () => {
    const { container } = render(
      <TextRenderer
        document={doc(
          { type: "paragraph", variant: "body1", children: [{ text: "a\nb" }] },
          { type: "paragraph", variant: "body1", children: [] },
        )}
      />,
    );

    expect(container.querySelectorAll("br")).toHaveLength(2);
  });

  it("applies text alignment", () => {
    render(
      <TextRenderer
        document={doc({
          type: "paragraph",
          variant: "body1",
          align: "center",
          children: [{ text: "Centered" }],
        })}
      />,
    );

    expect(screen.getByText("Centered").closest("p")).toHaveStyle({
      textAlign: "center",
    });
  });
});
