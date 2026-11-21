import type { ReactNode } from "react";
import { cn } from "@puzzle-ui/core";
import { Icon } from "@puzzle-ui/icons";
import { Link } from "../../navigation/link";
import "./text-editor.css";
import type {
  TextBlock,
  TextDocument,
  TextMark,
} from "./text-editor.types";
import {
  getBlockText,
  normalizeLinkHref,
  normalizeTextDocument,
} from "./text-document";
import { createTextListTree } from "./text-list-tree";
import type { TextListTreeEntry } from "./text-list-tree";

export type TextRendererProps = {
  document: TextDocument;
  className?: string;
  /** Enables checklist changes only for lists configured as interactive. */
  interactiveLists?: boolean;
  onChecklistChange?: (blockIndex: number, checked: boolean) => void;
};

const MARK_COMPONENTS: Record<TextMark, (children: ReactNode) => ReactNode> = {
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  underline: (children) => <u>{children}</u>,
  strike: (children) => <s>{children}</s>,
  code: (children) => <code>{children}</code>,
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
    const href =
      typeof inline.link?.href === "string"
        ? normalizeLinkHref(inline.link.href)
        : null;
    if (href) node = <Link href={href}>{node}</Link>;
    return <span key={`${blockIndex}-${inlineIndex}`}>{node}</span>;
  });

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const getHeadingTag = (block: TextBlock): (typeof HEADING_TAGS)[number] => {
  if (block.headingLevel) return HEADING_TAGS[block.headingLevel - 1]!;

  switch (block.variant) {
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

const TextRenderer = ({
  document,
  className,
  interactiveLists = false,
  onChecklistChange,
}: TextRendererProps) => {
  const blocks = normalizeTextDocument(document).content;
  const roots = createTextListTree(blocks);

  const renderBlock = (block: TextBlock, blockIndex: number): ReactNode => {
    const blockClass = cn(
      "puzzle-text-renderer__block",
      `puzzle-typography-${block.variant}`,
    );
    const children = renderInline(block, blockIndex);
    const style = {
      textAlign: block.align,
      marginInlineStart:
        block.indent && !block.listType
          ? `calc(${block.indent} * var(--puzzle-space-4, 1rem))`
          : undefined,
    };

    if (block.type === "horizontalRule") {
      return (
        <hr
          key={blockIndex}
          className={blockClass}
          data-puzzle-block-type={block.type}
          data-puzzle-indent={block.indent}
          style={style}
        />
      );
    }
    if (block.type === "codeBlock") {
      return (
        <pre
          key={blockIndex}
          className={blockClass}
          data-puzzle-block-type={block.type}
          data-puzzle-indent={block.indent}
          style={style}
        >
          <code>{getBlockText(block)}</code>
        </pre>
      );
    }
    if (block.type === "blockquote") {
      return (
        <blockquote
          key={blockIndex}
          className={blockClass}
          data-puzzle-block-type={block.type}
          data-puzzle-indent={block.indent}
          style={style}
        >
          {children.length ? children : <br />}
        </blockquote>
      );
    }
    if (block.type === "heading") {
      const HeadingTag = getHeadingTag(block);
      return (
        <HeadingTag
          key={blockIndex}
          className={blockClass}
          data-puzzle-indent={block.indent}
          style={style}
        >
          {children.length ? children : <br />}
        </HeadingTag>
      );
    }

    return (
      <p
        key={blockIndex}
        className={blockClass}
        data-puzzle-indent={block.indent}
        style={style}
      >
        {children.length ? children : <br />}
      </p>
    );
  };

  const renderSequence = (
    entries: TextListTreeEntry[],
    keyPrefix: string,
  ): ReactNode[] =>
    entries.map((entry, entryIndex) => {
      if (entry.type === "block") {
        return renderBlock(entry.block, entry.blockIndex);
      }

      const List = entry.listType === "ordered" ? "ol" : "ul";
      const items = entry.items.map(({ block, blockIndex, children }, itemIndex) => {
        const itemChildren = renderInline(block, blockIndex);
        const interactive =
          interactiveLists &&
          onChecklistChange !== undefined &&
          block.listAttributes?.interactive === true;
        const icon = block.listAttributes?.icon;

        return (
          <li
            key={`${keyPrefix}-item-${blockIndex}`}
            className={cn(
              "puzzle-text-renderer__block",
              `puzzle-typography-${block.variant}`,
            )}
            data-puzzle-variant={block.variant}
            data-puzzle-heading-level={block.headingLevel}
            data-puzzle-align={block.align}
            data-puzzle-checked={block.checked}
            style={{ textAlign: block.align }}
          >
            {entry.listType === "checklist" && (
              <input
                className="puzzle-text-renderer__checkbox"
                type="checkbox"
                checked={block.checked === true}
                disabled={!interactive}
                aria-label={
                  block.checked
                    ? "Mark checklist item incomplete"
                    : "Mark checklist item complete"
                }
                onChange={(event) =>
                  onChecklistChange?.(blockIndex, event.currentTarget.checked)
                }
              />
            )}
            {entry.listType === "icon" && icon && (
              <span className="puzzle-text-renderer__icon" aria-hidden="true">
                <Icon name={icon.name} size={icon.size} color={icon.color}>
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                </Icon>
              </span>
            )}
            <span className="puzzle-text-renderer__item-content">
              {itemChildren.length ? itemChildren : <br />}
            </span>
            {children.length > 0 &&
              renderSequence(children, `${keyPrefix}-nested-${itemIndex}`)}
          </li>
        );
      });

      return (
        <List
          key={`${keyPrefix}-list-${entry.items[0]?.blockIndex ?? entryIndex}`}
          className={cn(
            "puzzle-text-renderer__list",
            `puzzle-text-renderer__list--${entry.listType}`,
          )}
          data-puzzle-list-type={entry.listType}
          data-puzzle-list-interactive={entry.attributes?.interactive}
          data-puzzle-list-icon={entry.attributes?.icon?.name}
          data-puzzle-list-icon-size={entry.attributes?.icon?.size}
          data-puzzle-list-icon-color={entry.attributes?.icon?.color}
        >
          {items}
        </List>
      );
    });

  return (
    <div className={cn("puzzle-text-renderer", className)}>
      {renderSequence(roots, "root")}
    </div>
  );
};

export { TextRenderer };
