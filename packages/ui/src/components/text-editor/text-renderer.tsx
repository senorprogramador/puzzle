import type { ReactNode } from "react";
import { cn } from "@puzzle/core";
import "./text-editor.css";
import type { TextBlock, TextDocument, TextMark } from "./text-editor.types";

export type TextRendererProps = {
  document: TextDocument;
  className?: string;
};

const MARK_COMPONENTS: Record<TextMark, (children: ReactNode) => ReactNode> = {
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  underline: (children) => <u>{children}</u>,
  strike: (children) => <s>{children}</s>,
};

const renderInline = (block: TextBlock, blockIndex: number): ReactNode[] =>
  block.children.map((inline, inlineIndex) => {
    const parts = inline.text.split("\n");
    let node: ReactNode = parts.flatMap((part, partIndex) =>
      partIndex === 0
        ? [part]
        : [
            <br key={`break-${blockIndex}-${inlineIndex}-${partIndex}`} />,
            part,
          ],
    );

    for (const mark of [...(inline.marks ?? [])].reverse()) {
      node = MARK_COMPONENTS[mark](node);
    }

    return <span key={`${blockIndex}-${inlineIndex}`}>{node}</span>;
  });

const getHeadingTag = (variant: TextBlock["variant"]): "h1" | "h2" | "h3" | "h4" => {
  switch (variant) {
    case "display1":
    case "headline1":
      return "h1";
    case "display2":
    case "headline2":
      return "h2";
    case "headline3":
      return "h3";
    default:
      return "h4";
  }
};

const TextRenderer = ({ document, className }: TextRendererProps) => {
  return (
    <div className={cn("puzzle-text-renderer", className)}>
      {document.content.map((block, index) => {
        const className = cn(
          "puzzle-text-renderer__block",
          `puzzle-typography-${block.variant}`,
        );
        const children = renderInline(block, index);

        if (block.type === "heading") {
          const HeadingTag = getHeadingTag(block.variant);
          return (
            <HeadingTag key={index} className={className}>
              {children.length ? children : <br />}
            </HeadingTag>
          );
        }

        return (
          <p key={index} className={className}>
            {children.length ? children : <br />}
          </p>
        );
      })}
    </div>
  );
};

export { TextRenderer };
