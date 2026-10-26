export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
    throw new Error("Invalid hex color");
  }
  let r: number, g: number, b: number;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
