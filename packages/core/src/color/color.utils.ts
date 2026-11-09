import type { ColorType, HSLColor, RGBColor } from "./color.types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeHue = (hue: number): number => ((hue % 360) + 360) % 360;

const normalizeAlpha = (value?: string): number => {
  if (value === undefined) return 1;

  const alpha = value.endsWith("%")
    ? Number.parseFloat(value) / 100
    : Number.parseFloat(value);

  return clamp(alpha, 0, 1);
};

const CSS_NAMED_COLORS = new Set([
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "rebeccapurple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen",
    "transparent",
    "currentcolor",
]);

const normalizeChannel = (value: string): number => {
  const channel = value.endsWith("%")
    ? (Number.parseFloat(value) / 100) * 255
    : Number.parseFloat(value);

  return clamp(channel, 0, 255);
};

const getColorType = (color: string): ColorType => {
  const value = color.trim().toLowerCase();

  if (/^var\(\s*--[\w-]+(?:\s*,\s*.+)?\)$/.test(value)) {
    return "css-variable";
  }

  if (/^#[\da-f]{8}$/.test(value) || /^#[\da-f]{4}$/.test(value)) {
    return "hexa";
  }

  if (/^#[\da-f]{6}$/.test(value) || /^#[\da-f]{3}$/.test(value)) {
    return "hex";
  }

  if (/^rgba\(/.test(value)) return "rgba";
  if (/^rgb\(/.test(value)) return "rgb";
  if (/^hsla\(/.test(value)) return "hsla";
  if (/^hsl\(/.test(value)) return "hsl";

  if (/^[a-z]+$/.test(value)) return "named";

  return "unknown";
};

const isCssVariable = (color: string): boolean =>
  getColorType(color) === "css-variable";

const isColor = (color: string): boolean => {
  const type = getColorType(color);

  return type === "named"
    ? CSS_NAMED_COLORS.has(color.trim().toLowerCase())
    : type !== "unknown";
};

const hexToRgba = (hex: string): RGBColor => {
  const value = hex.trim().replace(/^#/, "");

  if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  const expanded =
    value.length <= 4
      ? [...value].map((channel) => channel + channel).join("")
      : value;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  const a =
    expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
};

const rgbToHex = (r: number, g: number, b: number, a?: number): string => {
  const channelToHex = (channel: number): string =>
    Math.round(clamp(channel, 0, 255))
      .toString(16)
      .padStart(2, "0");

  const alpha =
    a !== undefined && a < 1 ? channelToHex(clamp(a, 0, 1) * 255) : "";

  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}${alpha}`;
};

const parseRgb = (color: string): RGBColor | null => {
  const match = color
    .trim()
    .match(
      /^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
    );

  if (!match) return null;

  const [, r, g, b, alpha] = match;
  if (r === undefined || g === undefined || b === undefined) return null;

  return {
    r: normalizeChannel(r),
    g: normalizeChannel(g),
    b: normalizeChannel(b),
    a: normalizeAlpha(alpha),
  };
};

const hslToRgb = ({ h, s, l, a = 1 }: HSLColor): RGBColor => {
  const hue = normalizeHue(h) / 360;
  const saturation = clamp(s / 100, 0, 1);
  const lightness = clamp(l / 100, 0, 1);

  const channel = (n: number): number => {
    const k = (n + hue * 12) % 12;
    const chroma = saturation * Math.min(lightness, 1 - lightness);

    return Math.round(
      (lightness - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255,
    );
  };

  return {
    r: channel(0),
    g: channel(8),
    b: channel(4),
    a: clamp(a, 0, 1),
  };
};

const rgbToHsl = ({ r, g, b, a = 1 }: RGBColor): HSLColor => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (max === red) {
      h = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      h = 60 * ((blue - red) / delta + 2);
    } else {
      h = 60 * ((red - green) / delta + 4);
    }
  }

  return {
    h: normalizeHue(h),
    s: s * 100,
    l: l * 100,
    a,
  };
};

const parseHsl = (color: string): RGBColor | null => {
  const match = color
    .trim()
    .match(
      /^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
    );

  if (!match) return null;

  const [, h, s, l, alpha] = match;

  return hslToRgb({
    h: Number(h),
    s: Number(s),
    l: Number(l),
    a: normalizeAlpha(alpha),
  });
};

const parseColor = (color: string): RGBColor | null => {
  const type = getColorType(color);

  if (type === "hex" || type === "hexa") {
    return hexToRgba(color);
  }

  if (type === "rgb" || type === "rgba") {
    return parseRgb(color);
  }

  if (type === "hsl" || type === "hsla") {
    return parseHsl(color);
  }

  return null;
};

const rgbToCss = ({ r, g, b, a }: RGBColor): string =>
  a < 1
    ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(a.toFixed(3))})`
    : `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

const hslToCss = ({ h, s, l, a }: HSLColor): string =>
  a < 1
    ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${Number(a.toFixed(3))})`
    : `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;

const getColorLuminance = (color: string): number | null => {
  const rgb = parseColor(color);

  if (!rgb) return null;

  const linearize = (value: number): number => {
    const channel = value / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * linearize(rgb.r) +
    0.7152 * linearize(rgb.g) +
    0.0722 * linearize(rgb.b)
  );
};

const isColorDark = (color: string): boolean | null => {
  const luminance = getColorLuminance(color);

  return luminance === null ? null : luminance < 0.179;
};

export {
  clamp,
  getColorType,
  isCssVariable,
  isColor,
  hexToRgba,
  rgbToHex,
  parseRgb,
  parseColor,
  hslToRgb,
  rgbToHsl,
  rgbToCss,
  hslToCss,
  getColorLuminance,
  isColorDark,
};
