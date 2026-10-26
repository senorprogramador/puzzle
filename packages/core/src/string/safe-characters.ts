/** Removes unsafe characters from a string */
export const withSafeCharacters = (input: string): string =>
  input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(
      /([A-Z].*[^\s][A-Z])/g,
      "$1".slice(0, 1).toUpperCase() + "$1".slice(1).toLowerCase(),
    );
