const normalizeRating = (value: number, max: number, precision: 0.5 | 1) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const clamped = Math.min(max, Math.max(0, value));

  return Math.round(clamped / precision) * precision;
};

const getRatingStarState = (value: number, index: number) => {
  const remainder = value - index;

  if (remainder >= 1) {
    return "full" as const;
  }

  if (remainder >= 0.5) {
    return "half" as const;
  }

  return "empty" as const;
};

const getNextRating = (
  value: number,
  key: string,
  max: number,
  precision: 0.5 | 1,
) => {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return normalizeRating(value + precision, max, precision);

    case "ArrowLeft":
    case "ArrowDown":
      return normalizeRating(value - precision, max, precision);

    case "Home":
      return 0;

    case "End":
      return max;

    default:
      return undefined;
  }
};

export { normalizeRating, getRatingStarState, getNextRating };
