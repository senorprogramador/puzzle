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
