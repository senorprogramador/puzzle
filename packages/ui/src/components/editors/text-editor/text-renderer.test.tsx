import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TextRenderer } from "./text-renderer";
import type { TextBlock, TextDocument } from "./text-editor.types";

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
