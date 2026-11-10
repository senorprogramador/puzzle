type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

type ScrollAreaOverflow = {
  overflowX: "auto" | "hidden";
  overflowY: "auto" | "hidden";
};

const getScrollAreaOverflow = (
  orientation: ScrollAreaOrientation,
): ScrollAreaOverflow => ({
  overflowX:
    orientation === "horizontal" || orientation === "both" ? "auto" : "hidden",
  overflowY:
    orientation === "vertical" || orientation === "both" ? "auto" : "hidden",
});

export {
  getScrollAreaOverflow,
  type ScrollAreaOrientation,
  type ScrollAreaOverflow,
};
