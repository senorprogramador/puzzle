type SeparatorOrientation = "horizontal" | "vertical";

type SeparatorSemantics =
  | {
      role: "none";
      "aria-orientation"?: undefined;
    }
  | {
      role: "separator";
      "aria-orientation"?: "vertical";
    };

const getSeparatorSemantics = (
  orientation: SeparatorOrientation,
  decorative: boolean,
): SeparatorSemantics => {
  if (decorative) {
    return {
      role: "none",
    };
  }

  return {
    role: "separator",
    ...(orientation === "vertical"
      ? { "aria-orientation": "vertical" as const }
      : {}),
  };
};

export {
  getSeparatorSemantics,
  type SeparatorOrientation,
  type SeparatorSemantics,
};
