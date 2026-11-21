import type {
  TextBlock,
  TextListAttributes,
  TextListType,
} from "./text-editor.types";

type RawListTreeItem = {
  block: TextBlock;
  blockIndex: number;
  children: RawListTreeItem[];
};

type TextListTreeItem = {
  block: TextBlock;
  blockIndex: number;
  children: TextListTreeEntry[];
};

type RawTextListTreeEntry =
  | {
      type: "block";
      block: TextBlock;
      blockIndex: number;
    }
  | {
      type: "list";
      listType: TextListType;
      attributes?: TextListAttributes;
      items: RawListTreeItem[];
    };

type TextListTreeEntry =
  | {
      type: "block";
      block: TextBlock;
      blockIndex: number;
    }
  | {
      type: "list";
      listType: TextListType;
      attributes?: TextListAttributes;
      items: TextListTreeItem[];
    };

const sameListConfiguration = (
  left: TextListAttributes | undefined,
  right: TextListAttributes | undefined,
): boolean => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

export const createTextListTree = (
  blocks: TextBlock[],
): TextListTreeEntry[] => {
  const roots: RawListTreeItem[] = [];
  const parents: RawListTreeItem[] = [];

  blocks.forEach((block, blockIndex) => {
    const node: RawListTreeItem = { block, blockIndex, children: [] };
    if (!block.listType) {
      roots.push(node);
      parents.length = 0;
      return;
    }

    const indent = Math.max(0, Math.min(block.indent ?? 0, parents.length));
    if (indent === 0) roots.push(node);
    else parents[indent - 1]!.children.push(node);
    parents[indent] = node;
    parents.length = indent + 1;
  });

  const createEntries = (nodes: RawListTreeItem[]): RawTextListTreeEntry[] => {
    const entries: RawTextListTreeEntry[] = [];
    let index = 0;

    while (index < nodes.length) {
      const first = nodes[index]!;
      const listType = first.block.listType;
      if (!listType) {
        entries.push({
          type: "block",
          block: first.block,
          blockIndex: first.blockIndex,
        });
        index += 1;
        continue;
      }

      const attributes = first.block.listAttributes;
      const items: RawListTreeItem[] = [];
      while (index < nodes.length) {
        const candidate = nodes[index]!;
        if (
          candidate.block.listType !== listType ||
          !sameListConfiguration(
            candidate.block.listAttributes,
            attributes,
          )
        ) {
          break;
        }
        items.push(candidate);
        index += 1;
      }

      entries.push({
        type: "list",
        listType,
        ...(attributes ? { attributes } : {}),
        items,
      });
    }

    return entries;
  };

  const attachChildren = (nodes: RawListTreeItem[]): TextListTreeEntry[] => {
    const entries = createEntries(nodes);
    return entries.map((entry) => {
      if (entry.type === "block") return entry;
      return {
        ...entry,
        items: entry.items.map((item) => ({
          ...item,
          children: attachChildren(item.children),
        })),
      };
    });
  };

  return attachChildren(roots);
};

export type { TextListTreeEntry, TextListTreeItem };
