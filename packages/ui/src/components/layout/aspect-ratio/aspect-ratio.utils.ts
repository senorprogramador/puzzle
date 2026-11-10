import type { CSSProperties } from "react";

const getAspectRatioStyle = (
  ratio: number,
  style?: CSSProperties,
): CSSProperties => {
  if (!Number.isFinite(ratio) || ratio <= 0) {
    throw new RangeError(
      "AspectRatio: ratio must be a positive finite number.",
    );
  }

  return {
    ...style,
    aspectRatio: ratio,
  };
};

export { getAspectRatioStyle };
