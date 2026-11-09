import {
  getColorType,
  isColor,
  isColorDark,
  isCssVariable,
} from "./color.utils";

export const isHexColor = (color: string): boolean =>
  /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color.trim());

export const isDarkColor = (color: string): boolean => {
  const result = isColorDark(color);

  if (result === null) {
    throw new Error(`Unsupported color: ${color}`);
  }

  return result;
};

export { getColorType, isColor, isCssVariable, isColorDark };
