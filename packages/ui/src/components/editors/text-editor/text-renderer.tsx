import type { ReactNode } from "react";
import { cn } from "@puzzle/core";
import "./text-editor.css";
import type { TextBlock, TextDocument, TextMark } from "./text-editor.types";

export type TextRendererProps = { document: TextDocument; className?: string };

const MARK_COMPONENTS: Record<TextMark, (children: ReactNode) => ReactNode> = {
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  underline: (children) => <u>{children}</u>,
  strike: (children) => <s>{children}</s>,
};

const renderInline = (block: TextBlock, blockIndex: number): ReactNode[] =>
  block.children.map((inline, inlineIndex) => {
    const parts = inline.text.split("\n");
    let node: ReactNode = parts.flatMap((part, partIndex) => partIndex === 0
      ? [part]
      : [<br key={`break-${blockIndex}-${inlineIndex}-${partIndex}`} />, part]);
    for (const mark of [...(inline.marks ?? [])].reverse()) node = MARK_COMPONENTS[mark](node);
    return <span key={`${blockIndex}-${inlineIndex}`}>{node}</span>;
  });

const getHeadingTag = (variant: TextBlock["variant"]): "h1" | "h2" | "h3" | "h4" => {
  switch (variant) {
    case "display1": case "headline1": return "h1";
    case "display2": case "headline2": return "h2";
    case "headline3": return "h3";
    default: return "h4";
  }
};

const TextRenderer = ({ document, className }: TextRendererProps) => {
  const blocks = document.content;
  const output: ReactNode[] = [];
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.listType) {
      const listType = block.listType;
      const items: ReactNode[] = [];
      while (index < blocks.length && blocks[index].listType === listType) {
        const item = blocks[index];
        const itemChildren = renderInline(item, index);
        items.push(<li key={index} className={cn("puzzle-text-renderer__block", `puzzle-typography-${item.variant}`)} style={{ textAlign: item.align }}>
          {itemChildren.length ? itemChildren : <br />}
        </li>);
        index++;
      }
      const List = listType === "ordered" ? "ol" : "ul";
      output.push(<List key={`list-${index}`} className="puzzle-text-renderer__list">{items}</List>);
      continue;
    }
    const blockClass = cn("puzzle-text-renderer__block", `puzzle-typography-${block.variant}`);
    const children = renderInline(block, index);
    const style = { textAlign: block.align };
    if (block.type === "heading") {
      const HeadingTag = getHeadingTag(block.variant);
      output.push(<HeadingTag key={index} className={blockClass} style={style}>{children.length ? children : <br />}</HeadingTag>);
    } else {
      output.push(<p key={index} className={blockClass} style={style}>{children.length ? children : <br />}</p>);
    }
    index++;
  }
  return <div className={cn("puzzle-text-renderer", className)}>{output}</div>;
};

export { TextRenderer };
