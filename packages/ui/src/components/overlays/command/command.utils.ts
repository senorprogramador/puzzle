import type { CommandItem } from "./command.types";

const normalizeCommandText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();

const filterCommands = (
  commands: CommandItem[],
  query: string,
): CommandItem[] => {
  const normalizedQuery = normalizeCommandText(query);

  if (!normalizedQuery) {
    return commands;
  }

  const terms = normalizedQuery.split(/\s+/);

  return commands.filter((command) => {
    const searchableText = normalizeCommandText(
      [
        command.label,
        command.description ?? "",
        ...(command.keywords ?? []),
        command.group ?? "",
      ].join(" "),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};

const getNextEnabledIndex = (
  commands: CommandItem[],
  currentIndex: number,
  direction: 1 | -1,
  loop = true,
): number => {
  if (commands.length === 0) {
    return -1;
  }

  let index = currentIndex;

  for (let attempt = 0; attempt < commands.length; attempt++) {
    index += direction;

    if (loop) {
      index = (index + commands.length) % commands.length;
    } else if (index < 0 || index >= commands.length) {
      return currentIndex;
    }

    if (!commands[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

const findFirstEnabledIndex = (commands: CommandItem[]): number =>
  commands.findIndex((command) => !command.disabled);

const findLastEnabledIndex = (commands: CommandItem[]): number => {
  for (let index = commands.length - 1; index >= 0; index--) {
    if (!commands[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

export {
  filterCommands,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  getNextEnabledIndex,
  normalizeCommandText,
};
