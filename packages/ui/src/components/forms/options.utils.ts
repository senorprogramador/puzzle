type IndexedOption<T> = {
  option: T;
  index: number;
};

type OptionGroup<T> = {
  label: string | null;
  options: IndexedOption<T>[];
};

const groupOptions = <T extends { group?: string }>(
  options: readonly T[],
): OptionGroup<T>[] => {
  const groups = new Map<string | null, OptionGroup<T>>();

  options.forEach((option, index) => {
    const label = option.group ?? null;
    let group = groups.get(label);

    if (!group) {
      group = { label, options: [] };
      groups.set(label, group);
    }

    group.options.push({ option, index });
  });

  return Array.from(groups.values());
};

const findEnabledOptionIndex = <T extends { disabled?: boolean }>(
  options: readonly T[],
  startIndex: number,
  direction: -1 | 1,
  wrap = true,
): number => {
  const length = options.length;

  if (length === 0) {
    return -1;
  }

  for (let step = 1; step <= length; step++) {
    let index = startIndex + step * direction;

    if (wrap) {
      index = ((index % length) + length) % length;
    } else if (index < 0 || index >= length) {
      break;
    }

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

export {
  findEnabledOptionIndex,
  groupOptions,
  type IndexedOption,
  type OptionGroup,
};
