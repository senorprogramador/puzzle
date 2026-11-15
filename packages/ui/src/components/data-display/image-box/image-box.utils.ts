type ImageBoxLayoutType = "empty" | "single" | "split" | "stacked" | "grid";

type ImageBoxLayout = {
  type: ImageBoxLayoutType;
  visibleCount: number;
  columns: number;
  rows: number;
  hasOverflow: boolean;
  overflowCount: number;
  totalCount: number;
};

const getImageBoxLayout = (imageCount: number): ImageBoxLayout => {
  if (!Number.isInteger(imageCount) || imageCount < 0) {
    throw new RangeError("imageCount must be a non-negative integer");
  }

  if (imageCount === 0) {
    return {
      type: "empty",
      visibleCount: 0,
      columns: 0,
      rows: 0,
      hasOverflow: false,
      overflowCount: 0,
      totalCount: 0,
    };
  }

  if (imageCount === 1) {
    return {
      type: "single",
      visibleCount: 1,
      columns: 1,
      rows: 1,
      hasOverflow: false,
      overflowCount: 0,
      totalCount: 1,
    };
  }

  if (imageCount === 2) {
    return {
      type: "split",
      visibleCount: 2,
      columns: 2,
      rows: 1,
      hasOverflow: false,
      overflowCount: 0,
      totalCount: 2,
    };
  }

  if (imageCount < 5) {
    const rows = imageCount - 1;

    return {
      type: "stacked",
      visibleCount: imageCount,
      columns: 1,
      rows,
      hasOverflow: false,
      overflowCount: 0,
      totalCount: imageCount,
    };
  }

  return {
    type: "grid",
    visibleCount: 5,
    columns: 2,
    rows: 2,
    hasOverflow: imageCount > 5,
    overflowCount: Math.max(0, imageCount - 5),
    totalCount: imageCount,
  };
};

export { getImageBoxLayout, type ImageBoxLayout, type ImageBoxLayoutType };
