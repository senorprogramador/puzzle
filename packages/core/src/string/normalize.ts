/** Normalizes a search string by removing diacritics and converting to lowercase */
export const normalizeSearchString = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

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

/** Escapes special characters in a string for use in CSS strings */
export const escapeCssString = (value: string): string => {
  return value.replace(/["\\\n\r\f]/g, (character) => {
    switch (character) {
      case '"':
        return '\\"';
      case "\\":
        return "\\\\";
      case "\n":
        return "\\a ";
      case "\r":
        return "\\d ";
      case "\f":
        return "\\c ";
      default:
        return character;
    }
  });
};
