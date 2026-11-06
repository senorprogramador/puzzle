import type { AutocompleteOption } from "./autocomplete.types";

type IndexedAutocompleteOption<T> = {
  option: AutocompleteOption<T>;
  index: number;
};

type AutocompleteOptionGroup<T> = {
  label: string | null;
  options: IndexedAutocompleteOption<T>[];
};

const normalizeAutocompleteText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const filterAutocompleteOptions = <T>(
  options: readonly AutocompleteOption<T>[],
  inputValue: string,
): AutocompleteOption<T>[] => {
  const query = normalizeAutocompleteText(inputValue.trim());

  if (!query) {
    return [...options];
  }

  return options.filter((option) => {
    const label = normalizeAutocompleteText(option.label);
    const description =
      typeof option.description === "string"
        ? normalizeAutocompleteText(option.description)
        : "";

    return label.includes(query) || description.includes(query);
  });
};

const groupAutocompleteOptions = <T>(
  options: readonly AutocompleteOption<T>[],
): AutocompleteOptionGroup<T>[] => {
  const groups = new Map<string | null, AutocompleteOptionGroup<T>>();

  options.forEach((option, index) => {
    const label = option.group ?? null;
    let group = groups.get(label);

    if (!group) {
      group = {
        label,
        options: [],
      };

      groups.set(label, group);
    }

    group.options.push({ option, index });
  });

  return Array.from(groups.values());
};

const findEnabledAutocompleteIndex = <T>(
  options: readonly AutocompleteOption<T>[],
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
      index = (index + length) % length;
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
  filterAutocompleteOptions,
  findEnabledAutocompleteIndex,
  groupAutocompleteOptions,
  normalizeAutocompleteText,
  type AutocompleteOptionGroup,
};
